// SPDX-License-Identifier: Apache-2.0
// Copyright (c) Viacheslav Shynkarenko

// The worker in front of the built site.
//
// It does the three things a static file cannot: it serves `/install.sh`, so
// the short install command on the page is the release's own installer; it
// answers `/api/release`, so a page built a month ago still names today's
// version; and it sends `www` to the apex, which a `_redirects` file cannot do
// because Workers takes only relative URLs there.
//
// Everything else it hands straight to the asset store, and the fingerprinted
// files never reach it at all — `assets.run_worker_first` in `wrangler.jsonc`
// excludes them. The security headers are the asset store's, in
// `public/_headers`, so they also cover what the worker never sees.

const SITE = "niobe.dev";
const REPO = "niobe-dev/niobe";
const RELEASES = `https://github.com/${REPO}/releases`;

/// How long an answer about the latest release is reused. A release is
/// published by hand, minutes apart at worst, and five minutes of staleness is
/// invisible next to a static page that would otherwise name the version it
/// was built with.
const RELEASE_TTL = 300;

interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    // One name for the site, so a page is not indexed twice under two
    // hostnames. The path and the query are kept.
    if (url.hostname === `www.${SITE}`) {
      url.hostname = SITE;
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/install.sh") return installer(request, ctx);
    if (url.pathname === "/api/release") return latestRelease(request, ctx);

    // A file, or the 404 page when there is none.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

/// `curl -fsSL https://niobe.dev/install.sh | sh`.
///
/// The bytes are the release asset's, fetched on the way through — this is a
/// shorter name for that file, not a second copy of it that could drift. A
/// request that cannot be answered redirects to GitHub rather than returning a
/// half-written script: `sh` would run whatever it was given.
async function installer(request: Request, ctx: ExecutionContext): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed\n", {
      status: 405,
      headers: { allow: "GET, HEAD" },
    });
  }

  const source = `${RELEASES}/latest/download/install.sh`;
  let upstream: Response;
  try {
    upstream = await fetch(source, {
      headers: { "user-agent": "niobe.dev" },
      cf: { cacheTtl: RELEASE_TTL, cacheEverything: true },
    });
  } catch {
    return Response.redirect(source, 302);
  }

  if (!upstream.ok) return Response.redirect(source, 302);

  const script = await upstream.text();
  // A truncated body would still be piped into a shell. The script's own last
  // line is the only thing that runs it, so its presence is what "complete"
  // means here.
  if (!script.trimEnd().endsWith('main "$@"')) {
    return Response.redirect(source, 302);
  }

  const response = new Response(request.method === "HEAD" ? null : script, {
    headers: {
      "content-type": "text/x-shellscript; charset=utf-8",
      "cache-control": `public, max-age=${RELEASE_TTL}`,
      // Where these bytes came from, for anyone who would rather read the
      // original before running it.
      "x-install-source": source,
      "x-content-type-options": "nosniff",
    },
  });
  ctx.passThroughOnException();
  return response;
}

interface LatestRelease {
  tag: string;
  version: string;
  url: string;
  install: string;
}

/// What the newest release is called, for the pages that name a version.
///
/// The tag comes from the redirect GitHub answers `releases/latest` with,
/// which costs no API quota — an API call from a shared edge address is rate
/// limited by someone else's traffic.
async function latestRelease(request: Request, ctx: ExecutionContext): Promise<Response> {
  const cache = caches.default;
  const key = new Request(new URL("/api/release", request.url).toString(), {
    method: "GET",
  });

  const hit = await cache.match(key);
  if (hit) return withCors(hit);

  const failed = (reason: string) =>
    withCors(
      new Response(JSON.stringify({ error: reason, releases: RELEASES }, null, 2), {
        status: 502,
        headers: { "content-type": "application/json; charset=utf-8" },
      }),
    );

  let location: string | null;
  try {
    const redirect = await fetch(`${RELEASES}/latest`, {
      method: "HEAD",
      redirect: "manual",
      headers: { "user-agent": "niobe.dev" },
      cf: { cacheTtl: RELEASE_TTL, cacheEverything: true },
    });
    location = redirect.headers.get("location");
  } catch {
    return failed("GitHub could not be reached");
  }

  const tag = location?.split("/tag/")[1];
  if (!tag) return failed("GitHub did not name a latest release");

  const body: LatestRelease = {
    tag,
    version: tag.replace(/^v/, ""),
    url: `${RELEASES}/tag/${tag}`,
    install: `curl -fsSL https://${SITE}/install.sh | sh`,
  };

  const response = new Response(JSON.stringify(body, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${RELEASE_TTL}`,
    },
  });
  ctx.waitUntil(cache.put(key, response.clone()));
  return withCors(response);
}

/// The one endpoint anything off-origin may read: it is public information,
/// and a reader's own tooling asking for it is a reasonable thing to allow.
function withCors(response: Response): Response {
  const copy = new Response(response.body, response);
  copy.headers.set("access-control-allow-origin", "*");
  return copy;
}

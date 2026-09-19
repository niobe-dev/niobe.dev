// SPDX-License-Identifier: Apache-2.0
// Copyright (c) Viacheslav Shynkarenko

// An Atom feed of published releases, so that "tell me when there is a new
// version" needs no account anywhere.

import type { APIRoute } from "astro";
import { site } from "../lib/site";
import { releases } from "../lib/release";

const escape = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export const GET: APIRoute = async () => {
  const published = await releases();
  const updated = published[0]?.publishedAt ?? new Date().toISOString();

  const entries = published
    .map(
      (release) => `  <entry>
    <id>${site.origin}/changelog#${escape(release.tag)}</id>
    <title>${escape(release.name)}</title>
    <updated>${release.publishedAt}</updated>
    <link rel="alternate" href="${escape(release.url)}"/>
    <content type="text">${escape(release.notes.trim() || `${release.name} is published, with binaries for macOS and Linux and the installer beside them.`)}</content>
  </entry>`,
    )
    .join("\n");

  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${site.origin}/releases.xml</id>
  <title>${site.name} releases</title>
  <subtitle>${escape(site.tagline)}</subtitle>
  <updated>${updated}</updated>
  <author><name>${escape(site.owner)}</name></author>
  <link rel="self" href="${site.origin}/releases.xml"/>
  <link rel="alternate" href="${site.origin}/changelog"/>
${entries}
</feed>
`;

  return new Response(feed, {
    headers: {
      "content-type": "application/atom+xml; charset=utf-8",
      "cache-control": "public, max-age=600",
    },
  });
};

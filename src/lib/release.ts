// SPDX-License-Identifier: Apache-2.0
// Copyright (c) Viacheslav Shynkarenko

// What the site knows about published releases, read from the GitHub API while
// the site is built.
//
// A build that cannot reach GitHub still succeeds and still deploys: the pages
// render without a version and the browser fills it in from `/api/release`,
// which the worker answers from GitHub at request time. A launch should not be
// held up by a rate limit, and a stale number is worse than no number.

import { site } from "./site";

export interface Release {
  /// The tag as published, `v0.3.0`.
  tag: string;
  /// The tag without its `v`, which is what `niobe --version` prints.
  version: string;
  /// The release title, or the tag when it has none.
  name: string;
  /// ISO 8601, as GitHub returns it.
  publishedAt: string;
  /// The release page on GitHub.
  url: string;
  /// The release notes, as markdown.
  notes: string;
  /// Names of the files published with it.
  assets: string[];
}

interface ApiRelease {
  tag_name: string;
  name: string | null;
  published_at: string;
  html_url: string;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  assets: { name: string }[];
}

function shape(release: ApiRelease): Release {
  return {
    tag: release.tag_name,
    version: release.tag_name.replace(/^v/, ""),
    name: release.name ?? release.tag_name,
    publishedAt: release.published_at,
    url: release.html_url,
    notes: release.body ?? "",
    assets: release.assets.map((asset) => asset.name),
  };
}

let cached: Promise<Release[]> | null = null;

/// Every published release, newest first. Drafts and pre-releases are left
/// out: the site describes what `install.sh` would install.
export function releases(): Promise<Release[]> {
  cached ??= load();
  return cached;
}

/// The release `install.sh` installs by default, or `null` when GitHub could
/// not be reached.
export async function latestRelease(): Promise<Release | null> {
  return (await releases())[0] ?? null;
}

async function load(): Promise<Release[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
    "user-agent": `${site.domain} build`,
  };
  if (token) headers.authorization = `Bearer ${token}`;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${site.repo}/releases?per_page=50`,
      { headers, signal: AbortSignal.timeout(15_000) },
    );
    if (!response.ok) {
      throw new Error(`the releases API answered ${response.status}`);
    }
    const body = (await response.json()) as ApiRelease[];
    return body
      .filter((release) => !release.draft && !release.prerelease)
      .map(shape);
  } catch (reason) {
    console.warn(
      `niobe.dev: building without release data (${reason instanceof Error ? reason.message : reason}); ` +
        "the version shown on the page will be filled in by /api/release",
    );
    return [];
  }
}

/// `19 September 2026`, in the one place that decides how a date reads.
export function readableDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

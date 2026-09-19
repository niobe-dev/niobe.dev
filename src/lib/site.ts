// SPDX-License-Identifier: Apache-2.0
// Copyright (c) Viacheslav Shynkarenko

/// Everything about the project that more than one page needs to name.
export const site = {
  name: "Niobe",
  domain: "niobe.dev",
  origin: "https://niobe.dev",
  tagline: "A terminal coding agent that shows the work, the reasons and the bill.",
  owner: "Viacheslav Shynkarenko",
  license: "Apache-2.0",

  org: "niobe-dev",
  repo: "niobe-dev/niobe",
  repoUrl: "https://github.com/niobe-dev/niobe",
  issuesUrl: "https://github.com/niobe-dev/niobe/issues",
  releasesUrl: "https://github.com/niobe-dev/niobe/releases",
  siteRepoUrl: "https://github.com/niobe-dev/niobe.dev",

  /// The short form the site serves itself, from `worker/index.ts`. It fetches
  /// the same script the release carries, so the two commands install the same
  /// thing.
  install: "curl -fsSL https://niobe.dev/install.sh | sh",
  /// The long form, for anyone who would rather not trust a redirect.
  installDirect:
    "curl -fsSL https://github.com/niobe-dev/niobe/releases/latest/download/install.sh | sh",
} as const;

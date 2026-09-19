// SPDX-License-Identifier: Apache-2.0
// Copyright (c) Viacheslav Shynkarenko

import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// The site is static: every page is rendered at build time and served from
// Cloudflare's edge as a file. The only dynamic routes are the two the worker
// in `worker/index.ts` answers itself (`/install.sh` and `/api/release`), which
// never reach the asset store.
export default defineConfig({
  site: "https://niobe.dev",
  output: "static",
  trailingSlash: "ignore",
  integrations: [sitemap({ filter: (page) => !page.includes("/404") })],
  build: { format: "directory", inlineStylesheets: "never" },
  // Nothing is inlined into the HTML, so the site can be served under a
  // content security policy that allows no inline script at all. See the
  // headers in `worker/index.ts`.
  vite: { build: { assetsInlineLimit: 0 } },
  markdown: {
    shikiConfig: { theme: "github-dark-default", wrap: false },
  },
  devToolbar: { enabled: false },
});

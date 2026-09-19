<!--
SPDX-License-Identifier: Apache-2.0
Copyright (c) Viacheslav Shynkarenko
-->

# niobe.dev

The website for [Niobe](https://github.com/niobe-dev/niobe) — a terminal coding agent that
keeps you aware of what is being built and how.

**<https://niobe.dev>**

## What is here

- The landing page, and a drawing of the shell as it really looks.
- The documentation: installing, running a session, permissions, trust, cost, configuration
  and the full CLI reference.
- A changelog built from the product's GitHub releases, with an [Atom
  feed](https://niobe.dev/releases.xml).
- `https://niobe.dev/install.sh`, which serves the installer published with the newest
  release.

## Running it

```sh
npm install
npm run dev       # http://localhost:4321
npm run preview   # the real worker, via wrangler
npm run build     # static output in dist/
```

Astro for the pages, a small Cloudflare Worker for `/install.sh` and `/api/release`,
Cloudflare Workers static assets for everything else. A push to `main` deploys.

The version the pages name is never typed by hand: it is read from the product's releases at
build time and corrected in the browser from `/api/release`, so a page built last month still
names this morning's release.

## Contributing

Corrections to the documentation are welcome — especially anywhere the site describes
behaviour the binary does not have. Open an issue or a pull request.

[`AGENTS.md`](AGENTS.md) is the guide for working in this repository, human or otherwise.

## Licence

Apache-2.0, the same as Niobe. See [`LICENSE`](LICENSE).

The fonts in `public/fonts` are [Space Grotesk](https://github.com/floriankarsten/space-grotesk)
and [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), both under the SIL Open
Font License 1.1.

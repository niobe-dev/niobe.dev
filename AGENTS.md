<!--
SPDX-License-Identifier: Apache-2.0
Copyright (c) Viacheslav Shynkarenko
-->

# AI Agent Guidelines for niobe.dev

This repository is the website at <https://niobe.dev>: the landing page, the documentation
and the changelog for [`niobe-dev/niobe`](https://github.com/niobe-dev/niobe), the terminal
coding agent.

The product repository has its own `AGENTS.md`, and it governs the product. This file governs
the site. Where they overlap — the copyright header rule, the ban on internal planning
references — the product's wording is the one both follow.

---

## 0. The one rule

**The site may not say anything the shipped binary does not do.**

A landing page is the easiest place in a project to write a sentence nobody has to defend.
This one describes Niobe as it is today: the `claude` bridge spawns a process, the codex
bridge and the native loop do not, and the page says so. Every figure on screen in the
terminal illustration is captioned as an illustration, because the product's own first
promise is that a number you cannot trace is not printed.

Before writing or changing a sentence about what Niobe does, read the source:

| Question | Where the answer is |
| --- | --- |
| Commands, flags, exit codes, config keys, keys in the shell | `print_help()` in `crates/niobe-cli/src/main.rs` |
| What the panes are called and what they draw | `crates/niobe-tui/src/ui.rs` |
| What the installer does and what it reads | `install.sh` at the product repository root |
| What is not implemented yet | The last section of `print_help()`, and §2 of the product's `AGENTS.md` |

Quoting the help text closely is right. Paraphrasing it into a claim it does not make is not.

---

## 1. The stack, and why

- **Astro**, static output. Every page is HTML on disk before anyone asks for it.
- **Cloudflare Workers** with static assets. The zone is already on Cloudflare, so the site
  sits behind the same WAF, caching and TLS as everything else on the domain.
- **No client framework.** The only JavaScript that ships is three small scripts: copy the
  install command, correct the version from `/api/release`, and add a link to each heading.
  A reader with JavaScript off loses none of the content.
- **Self-hosted fonts.** A page that asks a third party for a file tells that third party who
  read it. A product whose first promise is no telemetry does not open with one.

## 2. Layout

```
src/
  pages/            one file per route; index, changelog, 404, releases.xml, docs/
  layouts/          Base (head, meta, icons) and Docs (bar, sidebar, table of contents)
  components/       Nav, Footer, Backdrop, Terminal, InstallCommand, Version
  content/docs/     the documentation, one markdown file per page
  content.config.ts the frontmatter schema and the order the sections are drawn in
  lib/              site constants, the GitHub release reader, the doc ordering
  styles/           global.css (tokens and chrome), prose.css (rendered markdown), fonts.css
worker/index.ts     /install.sh and /api/release; everything else is a file
public/             icons, fonts, robots.txt, _headers, _redirects
scripts/            regenerate the brand rasters and the webfonts
brand/              the mark as SVG, and the GitHub organisation avatar
mock/               the original design mock, kept for reference. Not built, not deployed.
```

## 3. Commands

```sh
npm run dev       # Astro dev server
npm run build     # static build into dist/
npm run preview   # build, then serve through the real worker with wrangler
npm run check     # type-check the worker
npm run brand     # redraw the icons and the social card
npm run fonts     # refresh the self-hosted webfonts
```

`npm run build` is the gate. It compiles every page and every component, so a broken template
fails there rather than in someone's browser. Run it, and `npm run check`, before committing.

## 4. How a change reaches the site

A push to `main` runs `.github/workflows/deploy.yml`: build, then `wrangler deploy`, then a
curl of the home page, the installer and `/api/release` to prove what is live. A pull request
runs the same build without deploying.

Two secrets make the deploy work, and they live in the repository's Actions secrets:
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## 5. Staying current with releases

The version appears in three places, and none of them is typed by hand:

1. **At build time** — `src/lib/release.ts` reads the product repository's releases and the
   pages are rendered with today's tag in them.
2. **In the browser** — every element marked `data-niobe-version` is corrected from
   `/api/release`, which the worker answers from GitHub. A page built last month still names
   this morning's release.
3. **On a schedule** — the deploy workflow also runs every six hours, so the static HTML and
   the changelog catch up without anyone pushing.

A build that cannot reach GitHub still succeeds and still deploys. It renders without a
version rather than with a stale one, and the browser fills it in. **Do not add a hard-coded
version as a fallback**; a wrong number that looks right is the failure this whole design
avoids.

## 6. Writing

- **Voice**: plain, specific, and about the reader's situation. Say what a thing does and why
  it is that way. No superlatives, no "simply", no "just".
- **Never invent a figure.** Every number on the site is either read from GitHub at build
  time, quoted from the product's source, or visibly labelled as an illustration.
- **A documentation page** is a markdown file in `src/content/docs/` with `title`,
  `description`, `section` and `order` in its frontmatter. Adding one puts it in the sidebar,
  in the index, and in the previous/next chain automatically — there is no list to update.
- **The description is the lede.** It is printed under the title, used as the page's
  `<meta name="description">`, and shown on the documentation index. Write one sentence that
  works in all three.
- **No roadmap language.** Describe what exists. "Not implemented yet: the codex bridge does
  not spawn the CLI" is fine; "coming soon" is not.

## 7. Design

The palette is the shell's own, defined once as custom properties at the top of
`src/styles/global.css`. Use the tokens; do not write a hex value into a component.

- The landing page sits on `--page: #07060d`; the documentation on `#050807`.
- `src/components/Terminal.astro` is a drawing of the real TUI. If the shell's panes, status
  line or function keys change, that component is wrong until it is updated.
- Every animation is off under `prefers-reduced-motion`, and the falling glyphs are hidden
  entirely. Keep it that way.
- The page must not scroll sideways at 390 px. The backdrop is the only thing allowed past
  the viewport, and it is clipped.
- Nothing is inlined into the HTML — `vite.build.assetsInlineLimit` is `0` — so the content
  security policy in `public/_headers` can forbid inline script. A change that reintroduces
  an inline `<script>` breaks the policy and must not land.

## 8. Copyright headers

Every file that can carry a comment starts with the SPDX header:

```
SPDX-License-Identifier: Apache-2.0
Copyright (c) Viacheslav Shynkarenko
```

`//` in TypeScript, Astro frontmatter and JavaScript; `#` in YAML, `_headers` and `_redirects`;
`/* */` in CSS; an HTML comment in markdown. Exempt, because the format has no comments:
`LICENSE`, `CLAUDE.md`, `package.json`, `tsconfig.json`, `*.md` under `src/content/` (the
frontmatter is the file's head), and anything generated into `public/` or `dist/`.

## 9. No internal planning references

This repository is public. No milestone markers, task or phase numbers, ticket ids, or links
to private documents — in the pages, the code, the comments, or the commit messages.

## 10. Landing the work

`npm run build` and `npm run check` green, then stage exactly the files you touched, by name,
then commit. Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `chore:`). The subject
says what changed; the body says why it is right.

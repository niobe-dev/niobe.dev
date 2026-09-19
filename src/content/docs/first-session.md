---
title: Your first session
description: Run niobe in a repository, ask for a change, and read what comes back.
section: Getting started
order: 2
---

## Open the shell

```sh
cd my-project
niobe
```

Niobe opens on the repository you are standing in. There is nothing to sign in
to: the session runs on whatever the `claude` CLI is signed in as.

If standard output is not a terminal there is nothing to draw into, so a piped
or redirected run prints the help instead of failing with an errno.

## Ask for something

Type into the composer at the bottom of the session pane and press
<kbd>Enter</kbd>. <kbd>Alt</kbd>+<kbd>Enter</kbd> opens a new line instead of
sending.

```
› add etag support to the catalog fetcher
```

What happens next, on screen:

1. **The transcript fills in.** Every read, edit and command the backend makes
   appears in the session pane with what it touched and what it returned.
2. **A prompt may stop the turn.** In `ask` mode, a call no rule already allows
   waits for you: <kbd>y</kbd> allows it once, <kbd>n</kbd> denies it,
   <kbd>a</kbd> allows every call to that tool from now on, <kbd>p</kbd> allows
   that tool on that target. See [Permissions](/docs/permissions).
3. **The right column keeps score.** Cost and tokens at the top, running
   sub-agents in the middle, changed files and the decisions behind them at the
   bottom.
4. **The status line says where you are** — the repository, the backend and
   model, the branch, the tokens so far, and the budget if you set one.

## Stop, scroll, leave

- <kbd>PgUp</kbd> / <kbd>PgDn</kbd> scroll the transcript. Scrolled back, the
  shell says so, and <kbd>PgDn</kbd> returns you to the newest line.
- <kbd>Shift</kbd>+<kbd>Tab</kbd> cycles how tool calls are gated.
- <kbd>F10</kbd> or <kbd>Ctrl</kbd>+<kbd>Q</kbd> quits. The terminal is
  restored on every exit path, including a panic or a `SIGTERM`.

Nothing is lost on the way out. Every event was written to
`.niobe/sessions.db` as it happened, so the session can be carried on later:

```sh
niobe sessions            # what this repository can continue
niobe --resume 3          # carry on with one
```

## Set a ceiling

```sh
niobe --budget 2.50
```

The session stops once it has cost that much, and says so in the transcript
before it gets there. On a subscription plan the figure is what the same work
would have cost on the provider's API — see
[Cost and budgets](/docs/cost-and-budgets).

## Where the session is kept

Everything goes under the repository root, and nothing leaves the machine:

| Path | What it holds |
| --- | --- |
| `.niobe/sessions.db` | Every event of every session, append-only. |
| `.niobe/config.toml` | The repository's profiles and the permission rules you pinned. |

Both are worth a line in `.gitignore` unless you mean to share them — and
sharing `config.toml` is a decision Niobe makes you confirm, because a config
arrives with a clone. See [Trusting a repository's config](/docs/trust).

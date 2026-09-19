---
title: Sessions
description: Every session is recorded append-only in your repository, and any of them — including one started in plain Claude Code — can be carried on.
section: Guides
order: 5
---

## Where a session lives

Every event of every session is written, as it happens, into
`.niobe/sessions.db` at the root of the repository it ran in — or of the
working directory, outside one. It is SQLite, and the schema's triggers refuse
an update or a delete: the log is append-only by construction, not by
convention.

Nothing is sent anywhere. The file is yours, and reading it needs no tool but
`sqlite3`.

## Listing what you can continue

```sh
niobe sessions
```

Two lists under one question, because you have one question — *what can I carry
on with?*

1. **Niobe's own**, by the number the store gave them.
2. **The `claude` CLI's**, for this repository, by the id it calls them by.

## Carrying one on

```sh
niobe --resume 3                    # a session Niobe recorded
niobe --resume 8f3c…                # one the claude CLI recorded
```

Resuming one of Niobe's own opens the shell on it and keeps recording into it.

Resuming one of the CLI's reads that transcript in as the history of a **new**
Niobe session and asks the CLI to carry the conversation on. From then on it is
an ordinary Niobe session and its number resumes it.

With standard output redirected, `--resume` prints what the session folds to
instead of opening the shell.

## Reading the CLI's transcripts

They live under `~/.claude/projects` — `CLAUDE_CONFIG_DIR/projects` when that
is set — one directory per working directory the CLI has run in. Niobe reads
the transcripts there and nothing else in that directory, and **never writes
back into it**.

What an import brings in is what the CLI wrote down: the turns, the tool calls,
the files they changed, the tokens each message was billed, and what the
session had cost when the CLI last closed it. A session the CLI has not closed
yet has no cost recorded in it, so Niobe shows what it can count rather than a
figure nobody reported.

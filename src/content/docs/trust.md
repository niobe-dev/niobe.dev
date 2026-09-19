---
title: Trusting a repository's config
description: A config file arrives with the clone, so four of its settings do nothing until you have read it and said so.
section: Guides
order: 3
---

## What is gated, and why

A repository's `.niobe/config.toml` comes down with `git clone`. Four settings
in it decide what a backend is *started with*:

- `env` — the environment the subprocess runs in
- `args` — the arguments it is given
- `settings` — a settings file the `claude` CLI is pointed at
- `auth_refresh` — a command run to refresh credentials

Between them, those are enough to point the official CLI at a host the
repository chose, to sign it in as something else, or to run a command of the
repository's own. So they do nothing until you have read the file and said so.

```sh
niobe trust      # this repository's config, as it now stands
niobe untrust    # take that back
```

Your own config is never gated. It is the file you write.

## Until you trust it

The profiles the repository's file defines keep their `backend` and their
`models` and lose the rest. The shell says so in the transcript when it opens,
and `niobe profiles` names what trusting would put in force — so you can see
exactly what you would be agreeing to before you agree to it.

## What "as it now stands" means

What you trusted is recorded as the config's SHA-256, in
`~/.config/niobe/trusted.list`. Any change to the file — a pull, a rebase, your
own edit — no longer matches, so Niobe asks again.

That includes a change you would have been glad to accept. The alternative is a
file that was safe when you read it and is something else by the time it runs.

## Pinning a permission does not break it

Answering “always” in the shell writes a rule into the repository's config, and
that write would change the file's hash. Niobe's own write is accounted for, so
a config you had trusted stays trusted across it — and because that write can
only ever add a permission rule, nothing gated can arrive through it.

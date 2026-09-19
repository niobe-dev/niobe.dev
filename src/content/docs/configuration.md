---
title: Configuration
description: Profiles, permission rules and the theme, in two TOML files that layer — yours, then the repository's.
section: Reference
order: 1
---

## The two files

| File | What it is |
| --- | --- |
| `~/.config/niobe/config.toml` | Yours. `$XDG_CONFIG_HOME/niobe/config.toml` when that variable is set. Never gated. |
| `.niobe/config.toml` | The repository's, at its root. Overrides yours, replacing any profile of the same name whole. |

A profile of the same name is replaced, not merged — so a repository profile is
read as one thing you either accept or do not, rather than a set of edits
scattered through yours.

Four of the repository file's settings do nothing until you run `niobe trust`.
[Trust](/docs/trust) says which and why.

## A profile

A profile is a backend plus what it runs with.

```toml
theme = "neo"
default_profile = "personal"

[profiles.personal]
backend = "claude"

[profiles.work]
backend = "claude"
models = ["opus", "sonnet", "haiku"]
env = { CLAUDE_CODE_USE_BEDROCK = "1", AWS_PROFILE = "work-sso" }
auth_refresh = "aws sso login --profile work-sso"

[profiles.personal-account]
backend = "claude"
settings = "~/.config/niobe/claude-personal.json"
```

```sh
niobe profiles            # every profile, the selected one marked
niobe --profile work      # run under one
```

| Key | What it does |
| --- | --- |
| `backend` | Which bridge starts the session. `claude` is the one that spawns a process today. |
| `models` | The models <kbd>F8</kbd> offers, named the way this backend takes them. A profile that names none has nothing to switch between — Niobe never invents a model id. |
| `env` | Passed to the subprocess exactly as written. |
| `args` | Extra arguments for the backend's binary. |
| `settings` | A settings file the `claude` CLI is given as `--settings <path>`. |
| `auth_refresh` | A command run to refresh credentials before the backend starts. |

## Two accounts on one machine

`settings` is the answer to a machine whose own `claude` settings configure the
wrong account. The CLI's settings environment wins over the environment a
process is started with, so a profile's `env` cannot take back what that file
sets — and a file of your own can.

Niobe merges nothing and rewrites nothing: the path is passed on and the CLI
reads it. A `~` at the front is your home directory. The file has to be there,
and a path that is not is reported at its line in the config before anything
starts.

`niobe profiles` shows which profiles name a settings file — and, where this
machine's own `claude` settings set `CLAUDE_CODE_USE_BEDROCK`, which do not.

## Permission rules

```toml
[permissions]
allow = ["Read", "Bash(cargo test)", "Bash(cargo clippy *)"]
```

See [Permissions](/docs/permissions) for what each form matches. Answering
“always” in the shell appends to this array in the repository's file.

## Theme

```toml
theme = "neo"      # or "classic"
```

`--theme` beats the config, and <kbd>F9</kbd> beats both for the rest of the
session.

## When a config is wrong

The parser walks the spanned TOML document by hand, so an invalid file is
reported as its key and its line rather than as a parse error somewhere in a
file. A theme name no theme answers to is refused at its line rather than
falling back to the default: someone who wrote a theme into their config and
got the usual one would read it as the file not being loaded at all.

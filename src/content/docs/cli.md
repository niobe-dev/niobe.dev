---
title: CLI reference
description: Every command, flag and exit status, as `niobe --help` prints them.
section: Reference
order: 2
---

## Commands

```
niobe                  Open the shell on a new session
niobe --resume <id>    Open the shell on an earlier session and continue it
niobe sessions         List the sessions this repository can carry on
niobe profiles         List the profiles the config defines, the selected one marked
niobe trust            Let this repository's config start a backend with what it names
niobe untrust          Take that back
niobe prices [model]   List the prices in force today, or every price a model has had
niobe replay <file>    Fold a JSON Lines event log into the shell (development)
```

## Options

| Flag | What it does |
| --- | --- |
| `--profile <name>` | Run under this profile instead of the default one. Applies to the shell, `--resume` and `profiles`. |
| `--budget <amount>` | Stop the session once it has cost this many dollars. Applies to the shell and `--resume`. |
| `--theme <name>` | Draw the shell in this palette: `classic` or `neo`. Applies to the shell and `--resume`. |
| `-h`, `--help` | Print the help. |
| `-V`, `--version` | Print the version. |

All three may stand anywhere on the line, and take either form —
`--budget 0.50` or `--budget=0.50` — since they qualify the command rather than
being one. A flag given where it does not apply is refused with a sentence
saying where it does, rather than being ignored.

`--budget` refuses zero and anything below it: a session that could not make a
single request is not what anyone asked for, and a negative budget is a typo.

## Exit status

| Code | Meaning |
| --- | --- |
| `0` | The session ended — including because the terminal it drew on went away. |
| `1` | Something failed. The reason was written to standard error, which discards it when standard error is closed or `/dev/null`. |
| `2` | Something failed and the reason could not be written to standard error. |

## Without a terminal

There is nothing to draw into when standard output is redirected, and raw mode
would fail, so a piped run prints the help instead of an errno. The config is
read first either way, so a config that cannot be used is reported rather than
hidden behind the help.

With standard output redirected, `--resume` and `replay` print what the session
folds to instead of opening the shell — which is how a recorded session is
inspected from a script.

## Paths

| Path | What it holds |
| --- | --- |
| `~/.config/niobe/config.toml` | Your profiles, permission rules and theme. |
| `~/.config/niobe/prices.toml` | Your own price table, if you write one. |
| `~/.config/niobe/trusted.list` | The SHA-256 of each repository config you have trusted. |
| `.niobe/config.toml` | The repository's profiles and pinned permission rules. |
| `.niobe/sessions.db` | Every event of every session in this repository, append-only. |

`$XDG_CONFIG_HOME/niobe` replaces `~/.config/niobe` when that variable is set.

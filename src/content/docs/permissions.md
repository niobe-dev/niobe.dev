---
title: Permissions
description: How a tool call is gated, what the four answers mean, and where an “always” answer is written down.
section: Guides
order: 2
---

## The prompt

In `ask` mode, a tool call that no rule already allows stops the turn and takes
the keyboard:

```
 the turn is waiting on you
 Bash wants to run
   “cargo clippy --workspace --all-targets”

 y allow · n deny · a always · p this target
```

| Key | Answer |
| --- | --- |
| <kbd>y</kbd>, <kbd>Enter</kbd> | Allow this call |
| <kbd>n</kbd>, <kbd>Esc</kbd> | Deny it. The denial is shown in the timeline, so a turn that went nowhere is not a mystery |
| <kbd>a</kbd> | Allow it, and every call to that tool from now on |
| <kbd>p</kbd> | Allow it, and every call to that tool on the same target from now on |

<kbd>Shift</kbd>+<kbd>Tab</kbd> cycles between `plan` (nothing runs), `ask`
(this prompt) and `auto` (the backend decides). The status line always names
the mode in force.

## Standing answers

An “always” answer is written into this repository's `.niobe/config.toml` as a
rule, and answers the same prompt in every later session:

```toml
[permissions]
allow = ["Read", "Bash(cargo test)"]
```

- A bare tool name allows **every** call to it.
- A name and a target allow **that target alone**.
- A target ending in `*` matches by prefix — `Bash(cargo *)`.

**Only you write a `*`.** When Niobe records an answer it stores the target
exactly as it stood; it never widens a rule into a guess at what else you
meant. Editing the file by hand is how a rule becomes a pattern.

The user's config and the repository's both apply, and a rule in either allows
the call.

## Why the write is safe

The write Niobe makes when you answer “always” is its own: it splices one
string into the `allow` array at the byte range the parser recorded, so your
comments and your ordering survive, and it can add no `env`, no `args`, no
`settings` and no `auth_refresh`. A repository config you had trusted stays
trusted across it — see [Trust](/docs/trust).

## Taking a rule back

Delete the line. There is no command for it because there is no state anywhere
else: the file is the whole of it.

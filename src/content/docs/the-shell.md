---
title: The shell
description: What every pane on screen is, the keys that drive it, and the three modes a session can run in.
section: Getting started
order: 3
---

## The layout

The screen is a menu bar, a body, a status line and a row of function keys.

The body is the session pane on the left and three panes stacked on the right.
On a narrow terminal the right-hand stack is dropped and the session pane takes
the whole body, so the transcript is never the thing that goes.

| Pane | What it shows |
| --- | --- |
| **Session** | The transcript: what you asked, what the backend replied, every tool call, and the composer at the bottom. |
| **Cost** | The session's spend, tokens in and out, tokens read from cache, and which tools have been busiest. |
| **Parallel** | The sub-agents running right now, and how many have been spawned, finished and failed. |
| **Changes** | Every file the session has changed with its `+`/`−` counts and the reason it was changed, then the decisions the session has recorded. |

Each line in the transcript carries a glyph for who produced it: `>` you, `◆`
the assistant, `⚙` a tool call, `!` an error the backend reported, `·` the
shell explaining something itself.

## Keys

| Key | What it does |
| --- | --- |
| <kbd>Enter</kbd> | Send what is in the composer |
| <kbd>Alt</kbd>+<kbd>Enter</kbd> | Open a new line in the composer |
| <kbd>PgUp</kbd> / <kbd>PgDn</kbd> | Scroll the transcript |
| <kbd>Shift</kbd>+<kbd>Tab</kbd> | Cycle how tool calls are gated |
| <kbd>F8</kbd> | Pick a model from the ones the profile names |
| <kbd>F9</kbd> | Cycle the palette |
| <kbd>F10</kbd>, <kbd>Ctrl</kbd>+<kbd>Q</kbd> | Quit |

When a backend stops for permission the prompt takes the keyboard:
<kbd>y</kbd> allows the call, <kbd>n</kbd> denies it, <kbd>a</kbd> allows every
call to that tool from now on, <kbd>p</kbd> allows that tool on the same target
from now on. [Permissions](/docs/permissions) has the detail.

## Modes

<kbd>Shift</kbd>+<kbd>Tab</kbd> cycles the mode the session runs in, and the
status line names the one in force.

| Mode | What it means |
| --- | --- |
| `plan` | Nothing is changed. The backend reads, reasons and proposes. |
| `ask` | Every call no rule already allows stops for you. |
| `auto` | The decision is left to the backend. The transcript still shows every call it made. |

A mode a backend reports that Niobe has no word for is named on the status line
rather than shown as one of these three. Niobe does not translate something it
does not recognise into something it does.

## Switching model

<kbd>F8</kbd> offers the models the selected profile names, in the spelling
that profile's backend takes. A profile that names none has nothing to switch
between, because Niobe never invents a model id.

The switch applies from the next turn and keeps everything said so far: the
running session is told to change, not replaced. The backend resolves the name
it is given and says what it ended up on, which may be spelt differently from
the way it was asked for.

Naming models is a per-profile setting — see
[Configuration](/docs/configuration).

## Themes

Two palettes ship: `classic` is DOS blue, `neo` is green on black.

```sh
niobe --theme neo
```

```toml
# at the top of a config file
theme = "neo"
```

<kbd>F9</kbd> cycles them while a session runs, and beats both.

Every colour is one of the sixteen the terminal names rather than a hex value,
so a session looks the same over SSH and inside `screen`, and your own colour
scheme decides what those sixteen mean.

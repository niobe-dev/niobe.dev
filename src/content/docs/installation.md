---
title: Installation
description: One static binary for macOS and Linux, checked against its published SHA-256 and placed on your PATH.
section: Getting started
order: 1
---

## Quick install

```sh
curl -fsSL https://niobe.dev/install.sh | sh
```

That URL serves the installer published with the newest release, which is the
same file as:

```sh
curl -fsSL https://github.com/niobe-dev/niobe/releases/latest/download/install.sh | sh
```

Use whichever you prefer. The second asks nothing of this site.

The script picks the archive for your machine, checks it against the SHA-256
published beside it, and puts `niobe` in `~/.local/bin`. It edits no shell
profile, asks for no `sudo`, and touches nothing outside the install directory.

It is POSIX `sh`, short enough to read in a minute, and the whole of it is one
function called on the last line — so a download cut off half way through runs
nothing.

## Read it first

Piping a script into a shell is a decision, not a habit. Inspect it before you
run it:

```sh
curl -fsSL https://niobe.dev/install.sh -o install.sh
less install.sh
sh install.sh
```

## Settings

All optional, read from the environment:

| Variable | What it does |
| --- | --- |
| `NIOBE_VERSION` | The release to install, for example `v0.3.0`. The default is the latest. |
| `NIOBE_INSTALL_DIR` | Where the binary goes. The default is `~/.local/bin`. |
| `NIOBE_DOWNLOAD_URL` | Where the release files are fetched from instead of GitHub — any URL curl can read, `file://` included. |

```sh
NIOBE_VERSION=v0.3.0 sh install.sh
NIOBE_INSTALL_DIR=/usr/local/bin sh install.sh
```

## What is built

| Platform | Architectures |
| --- | --- |
| macOS | arm64 (Apple silicon), x86-64 |
| Linux | x86-64, arm64 — statically linked against musl |

A shell running under Rosetta reports `x86_64` on Apple silicon; the installer
notices and fetches the native build anyway.

Windows is not built. There is no release archive for it, and the installer
says so rather than installing something that will not run.

## Put it on your PATH

`~/.local/bin` is on the path on many systems and not on others. If
`niobe --version` is not found after installing, add it:

```sh
# ~/.zshrc, ~/.bashrc, or wherever your shell reads
export PATH="$HOME/.local/bin:$PATH"
```

## Check the install

```sh
niobe --version
```

## What it needs to run

Niobe drives the official `claude` CLI as a subprocess. Install that separately
and sign it in the way you normally would — Niobe never touches its
credentials. See [Backends](/docs/backends).

## From source

The workspace builds with a current stable Rust toolchain:

```sh
git clone https://github.com/niobe-dev/niobe
cd niobe
cargo build --release   # target/release/niobe
```

## Updating and removing

Run the installer again for the newest release. To remove Niobe, delete the
binary and, if you want its records gone too, the directories it writes:

```sh
rm ~/.local/bin/niobe
rm -rf ~/.config/niobe    # config, trust list, your own price table
rm -rf .niobe             # per repository: its session store and config
```

---
title: Backends
description: Niobe drives the official CLIs rather than the provider APIs, so a session runs on the access those CLIs already have.
section: Guides
order: 1
---

## Bridge-first

A `claude` profile starts the official `claude` CLI as a subprocess, with the
profile's environment, arguments and settings file, and your repository as its
working directory. Everything that binary reports — messages, tool calls, token
counts, costs — is translated into Niobe's own event model and folded into the
session you are watching.

The consequence is the point: **there is no API key to paste.** Whatever the
`claude` binary is signed in as is what the session runs on, subscription
included.

## The line this stands on

Only the official binaries touch subscription credentials.

- Niobe never reads their token files.
- Niobe never sets their user agent.
- No token extraction, no header spoofing, no reimplementation of a login.

This is not a policy that could be relaxed for a feature; it is the reason the
bridge design exists. A repository's config is not a way around it either — a
profile that arrives with a clone cannot put an environment, arguments, a
settings file or a refresh command in front of a backend until you have read
that file and said so. See [Trust](/docs/trust).

The second half of the same promise: **no telemetry.** Network calls go to the
configured provider and to the CLIs. There is no analytics endpoint, no crash
reporter, and no opt-out to find, because there is nothing to opt out of.

## What a session costs

Every cost the `claude` CLI reports is one it computed from published prices
rather than money that moved, so Niobe stores it as *API-equivalent* and never
as a charge. On a flat-rate plan that figure is what the same work would have
cost on the provider's API. [Cost and budgets](/docs/cost-and-budgets) explains
how each number on screen is labelled.

## Carrying on a Claude Code session

A session you started in plain Claude Code can be continued here.
`niobe sessions` lists the CLI's own sessions for this repository alongside
Niobe's, and `--resume` with one of those reads its transcript in as the
history of a new Niobe session, then asks the CLI to carry the conversation on.

Nothing is ever written back into the CLI's store. See
[Sessions](/docs/sessions).

## Not implemented yet

The codex bridge names its binary and does not spawn it. Neither does the
native agent loop, which is the path to what the bridges cannot expose. A
session under one of those profiles has nowhere to send a prompt, and says so
rather than appearing to start.

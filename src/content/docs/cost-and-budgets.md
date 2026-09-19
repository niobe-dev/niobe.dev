---
title: Cost and budgets
description: Where every figure on screen comes from, what its label means, and how to cap what a session may spend.
section: Guides
order: 4
---

## The rule

> Every cost number is traceable to a `usage` field the backend reported, or it
> is labelled. A fabricated number is indistinguishable from a measured one,
> which is the whole product gone.

That rule decides everything below.

## What the labels mean

| Label | What it is |
| --- | --- |
| **Measured** | Taken from a `usage` field the backend reported. |
| **API-equivalent** | A figure the backend computed from published prices, not money that moved. Everything the `claude` CLI reports is this. |
| **Unpriced** | A model id the price table does not list. Nothing is guessed from a similar id. |

Where there is no number at all, the screen shows an em dash — never a zero. A
zero is a measurement; a dash is the absence of one, and the difference matters
when you are deciding whether to trust the total.

## The Cost pane

Four figures across the top: what the session has cost, tokens in, tokens out,
and tokens read from cache. Underneath, a bar per tool showing which have been
busiest, and a line counting the calls: how many finished, how many failed, how
many you denied, and how much output they produced.

The bars carry the tool mix rather than dollars per tool, because spend is not
attributed per call — and a per-tool dollar figure that was really a division
of the total would be exactly the kind of number this product refuses to print.

## Budgets

```sh
niobe --budget 2.50
```

The session stops once it has cost that much, and says so in the transcript
once most of it is gone.

The cap is checked between turns rather than inside one, so a session can
finish above the figure by whatever the turn that crossed the line cost. On a
subscription plan, the figure the backend reports is what the same work would
have cost on the provider's API — so the cap is on that, not on money that
moved.

## Where the prices come from

Costs are computed from a price table bundled into the binary: USD per million
tokens for each model id, each price dated from the day it took effect, so a
session is priced at the rates of the day it ran rather than today's.

```sh
niobe prices              # what is in force today
niobe prices opus-5       # every price one model has had
```

Every number in the table carries its published source in a comment beside it,
and the test suite checks the table against costs worked out by hand.

To override it, write `~/.config/niobe/prices.toml` in the same shape. It
replaces the whole price history of every id it lists, and leaves every id it
does not alone.

## Flat-rate plans

When a backend reports usage windows — the rolling limits a subscription plan
runs on — they appear on the status line where a budget would, because on a
flat-rate plan the windows *are* the budget. A metered profile has no windows,
and nothing is shown for them: a `0%/5h` would be a figure nobody measured.

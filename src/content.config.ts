// SPDX-License-Identifier: Apache-2.0
// Copyright (c) Viacheslav Shynkarenko

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/// The three groups the sidebar draws, in the order it draws them.
export const SECTIONS = ["Getting started", "Guides", "Reference"] as const;

const docs = defineCollection({
  loader: glob({ base: "./src/content/docs", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    /// One sentence: the page's own lede, and its description in search
    /// results and link previews.
    description: z.string(),
    section: z.enum(SECTIONS),
    /// Where the page sits inside its section.
    order: z.number().int(),
  }),
});

export const collections = { docs };

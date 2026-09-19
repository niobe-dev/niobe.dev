// SPDX-License-Identifier: Apache-2.0
// Copyright (c) Viacheslav Shynkarenko

import { getCollection, type CollectionEntry } from "astro:content";
import { SECTIONS } from "../content.config";

export type Doc = CollectionEntry<"docs">;

/// Every page, in reading order: section by section, and by `order` inside
/// each. The sidebar, the index and the previous/next links all walk this one
/// list, so they cannot disagree about what comes after what.
export async function orderedDocs(): Promise<Doc[]> {
  const docs = await getCollection("docs");
  return docs.sort(
    (a, b) =>
      SECTIONS.indexOf(a.data.section) - SECTIONS.indexOf(b.data.section) ||
      a.data.order - b.data.order,
  );
}

export interface Group {
  section: (typeof SECTIONS)[number];
  docs: Doc[];
}

export async function groupedDocs(): Promise<Group[]> {
  const docs = await orderedDocs();
  return SECTIONS.map((section) => ({
    section,
    docs: docs.filter((doc) => doc.data.section === section),
  })).filter((group) => group.docs.length > 0);
}

export const docPath = (doc: Doc): string => `/docs/${doc.id}`;

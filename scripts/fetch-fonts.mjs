// SPDX-License-Identifier: Apache-2.0
// Copyright (c) Viacheslav Shynkarenko

// Refreshes the self-hosted webfonts in `public/fonts` and the @font-face
// declarations in `src/styles/fonts.css` from Google Fonts.
//
// The fonts are copied here rather than linked because a page that asks a
// third party for a file tells that third party who read it, and a product
// whose first promise is no telemetry should not open with one. Only the latin
// and latin-ext subsets are kept; nothing on the site is written in another
// script.
//
// Run it when a weight is added, not on every build: the files are committed.

import fs from "node:fs/promises";

const FAMILIES =
  "family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;700";
// Google Fonts serves woff2 only to a user agent it believes supports it.
const CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const SUBSETS = new Set(["latin", "latin-ext"]);

const css = await (
  await fetch(`https://fonts.googleapis.com/css2?${FAMILIES}&display=swap`, {
    headers: { "user-agent": CHROME },
  })
).text();

// The stylesheet names each subset in a comment on the line before its face.
const faces = [];
let subset = null;
for (const chunk of css.split("@font-face")) {
  const face = chunk.slice(0, chunk.indexOf("}") + 1);
  if (face.includes("font-family")) faces.push({ subset, face });
  const named = [...chunk.matchAll(/\/\* (\S+) \*\//g)].pop();
  if (named) subset = named[1];
}

const declarations = [];
for (const { subset, face } of faces) {
  if (!SUBSETS.has(subset)) continue;
  const family = face.match(/font-family: '([^']+)'/)[1];
  const weight = face.match(/font-weight: (\d+)/)[1];
  const remote = face.match(/url\(([^)]+)\)/)[1];
  const name = `${family.toLowerCase().replaceAll(" ", "-")}-${weight}-${subset}.woff2`;

  const woff2 = await fetch(remote);
  if (!woff2.ok) throw new Error(`${remote} answered ${woff2.status}`);
  await fs.writeFile(
    `public/fonts/${name}`,
    Buffer.from(await woff2.arrayBuffer()),
  );

  const body = face.slice(face.indexOf("{") + 1, face.lastIndexOf("}"));
  const decls = body
    .replace(remote, `/fonts/${name}`)
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean);
  declarations.push(`@font-face {\n${decls.map((d) => `  ${d};`).join("\n")}\n}`);
}

await fs.writeFile(
  "src/styles/fonts.css",
  `/* SPDX-License-Identifier: Apache-2.0 */
/* Space Grotesk and JetBrains Mono, both under the SIL Open Font License 1.1,
   served from this origin so that reading the site asks nothing of a third
   party. Regenerate with \`node scripts/fetch-fonts.mjs\`. */

${declarations.join("\n\n")}
`,
);

console.log(`fonts: ${declarations.length} faces`);

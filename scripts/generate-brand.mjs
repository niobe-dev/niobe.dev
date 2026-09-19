// SPDX-License-Identifier: Apache-2.0
// Copyright (c) Viacheslav Shynkarenko

// Draws every raster the site and the GitHub organisation need from one source:
// the mark in `mark()` below, a rhombus carrying the site's own green-to-pink
// gradient. Nothing here is traced from an image, so a colour change is a
// one-line change and every size stays in step.
//
// Run it after touching the palette: `npm run brand`. The outputs are
// committed, so a build never depends on this script or on the network.

import fs from "node:fs/promises";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const OUT_PUBLIC = "public";
const OUT_BRAND = "brand";

const BG = "#07060d";
const GREEN = "#39ff7a";
const PINK = "#ff2dc8";

// Google's TTFs, which resvg can read; the woff2 the site serves it cannot.
// Cached under node_modules so a second run is offline.
const FONTS = {
  // The static weights, not the variable file: resvg renders a variable font at
  // its default instance, so `font-weight` on the card would do nothing.
  "SpaceGrotesk-Regular.ttf":
    "https://raw.githubusercontent.com/floriankarsten/space-grotesk/master/fonts/ttf/static/SpaceGrotesk-Regular.ttf",
  "SpaceGrotesk-Bold.ttf":
    "https://raw.githubusercontent.com/floriankarsten/space-grotesk/master/fonts/ttf/static/SpaceGrotesk-Bold.ttf",
  "JetBrainsMono-Regular.ttf":
    "https://raw.githubusercontent.com/JetBrains/JetBrainsMono/master/fonts/ttf/JetBrainsMono-Regular.ttf",
  "JetBrainsMono-Bold.ttf":
    "https://raw.githubusercontent.com/JetBrains/JetBrainsMono/master/fonts/ttf/JetBrainsMono-Bold.ttf",
};

async function fonts() {
  const dir = "node_modules/.cache/niobe-brand-fonts";
  await fs.mkdir(dir, { recursive: true });
  const files = [];
  for (const [name, url] of Object.entries(FONTS)) {
    const file = path.join(dir, name);
    try {
      await fs.access(file);
    } catch {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${url} answered ${res.status}`);
      await fs.writeFile(file, Buffer.from(await res.arrayBuffer()));
    }
    files.push(path.resolve(file));
  }
  return files;
}

/// The mark itself, in a `size`-square box, as SVG elements.
///
/// `inset` is how much of the box the rhombus leaves empty on each side: the
/// favicon fills its square, an app icon keeps a margin so that a rounded mask
/// cannot clip a corner off.
function mark(size, inset, { glow = false } = {}) {
  const half = size / 2;
  const reach = half - inset;
  const points = `${half},${inset} ${half + reach},${half} ${half},${size - inset} ${inset},${half}`;
  return `
  <defs>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${GREEN}"/>
      <stop offset="1" stop-color="${PINK}"/>
    </linearGradient>
    ${glow ? `<filter id="halo" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${size * 0.06}"/></filter>` : ""}
  </defs>
  ${glow ? `<polygon points="${points}" fill="url(#edge)" filter="url(#halo)" opacity=".55"/>` : ""}
  <polygon points="${points}" fill="url(#edge)"/>`;
}

function icon(size, { inset, background }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  ${background ? `<rect width="${size}" height="${size}" fill="${BG}"/>` : ""}
  ${mark(size, inset)}
</svg>`;
}

function png(svg, width, fontFiles) {
  return new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Space Grotesk" },
  })
    .render()
    .asPng();
}

/// A .ico wrapping PNGs, which every browser that still wants an .ico reads.
/// The container is 6 bytes of header and 16 per image, so writing it by hand
/// is smaller than a dependency that writes it.
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

function card(fontFiles) {
  const w = 1200;
  const h = 630;
  const grid = [];
  for (let x = 0; x <= w; x += 48)
    grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`);
  for (let y = 0; y <= h; y += 48)
    grid.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${GREEN}"/>
      <stop offset="1" stop-color="${PINK}"/>
    </linearGradient>
    <radialGradient id="pink"><stop offset="0" stop-color="${PINK}" stop-opacity=".30"/><stop offset="1" stop-color="${PINK}" stop-opacity="0"/></radialGradient>
    <radialGradient id="green"><stop offset="0" stop-color="${GREEN}" stop-opacity=".20"/><stop offset="1" stop-color="${GREEN}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${BG}"/>
  <g stroke="${GREEN}" stroke-opacity=".07" stroke-width="1">${grid.join("")}</g>
  <ellipse cx="1060" cy="70" rx="440" ry="380" fill="url(#pink)"/>
  <ellipse cx="60" cy="600" rx="420" ry="340" fill="url(#green)"/>

  <polygon points="88,108 132,152 88,196 44,152" fill="url(#edge)"/>
  <text x="152" y="168" font-family="Space Grotesk" font-weight="700" font-size="42" letter-spacing="4" fill="#dfe6ff">NIOBE</text>

  <text x="44" y="300" font-family="Space Grotesk" font-weight="700" font-size="68" letter-spacing="-1.5" fill="#dfe6ff">AI coding at full speed.</text>
  <text x="44" y="378" font-family="Space Grotesk" font-weight="700" font-size="68" letter-spacing="-1.5" fill="${GREEN}">Without the black box.</text>

  <text x="44" y="452" font-family="Space Grotesk" font-weight="400" font-size="26" fill="#b7bfe0">A terminal coding agent that shows the work, the reasons and the bill.</text>

  <rect x="44" y="498" width="740" height="62" fill="#020805" stroke="${GREEN}" stroke-opacity=".5"/>
  <text x="68" y="537" font-family="JetBrains Mono" font-size="22" fill="${GREEN}">$</text>
  <text x="96" y="537" font-family="JetBrains Mono" font-size="22" fill="#c9ffd6">curl -fsSL https://niobe.dev/install.sh | sh</text>

  <text x="${w - 44}" y="537" text-anchor="end" font-family="JetBrains Mono" font-size="19" fill="#9aa3c7">niobe.dev</text>
</svg>`;
  return png(svg, w, fontFiles);
}

const fontFiles = await fonts();
const written = [];
const write = async (file, data) => {
  await fs.writeFile(file, data);
  written.push(`${file} (${(data.length / 1024).toFixed(1)} kB)`);
};

// A full-bleed square: what a browser tab and the GitHub avatar both show.
const square = (size) => icon(size, { inset: size * 0.22, background: true });
// Transparent, for embedding in a page that brings its own background.
const bare = (size) => icon(size, { inset: size * 0.22, background: false });

await write(`${OUT_PUBLIC}/favicon.svg`, Buffer.from(square(512)));
await write(`${OUT_BRAND}/niobe-mark.svg`, Buffer.from(bare(512)));
await write(
  `${OUT_PUBLIC}/favicon.ico`,
  ico([16, 32, 48].map((size) => ({ size, data: png(square(512), size, fontFiles) }))),
);
// Apple crops to a rounded square and adds no background of its own.
await write(
  `${OUT_PUBLIC}/apple-touch-icon.png`,
  png(icon(512, { inset: 512 * 0.26, background: true }), 180, fontFiles),
);
await write(`${OUT_PUBLIC}/icon-192.png`, png(square(512), 192, fontFiles));
await write(`${OUT_PUBLIC}/icon-512.png`, png(square(512), 512, fontFiles));
await write(`${OUT_PUBLIC}/og.png`, card(fontFiles));
// GitHub resizes the organisation avatar itself and wants a square well over
// the 200 px it displays.
await write(`${OUT_BRAND}/github-org-avatar.png`, png(square(512), 1024, fontFiles));

console.log(written.join("\n"));

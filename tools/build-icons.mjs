import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.cwd());
const iconDir = path.join(root, "assets", "icons");
const files = (await readdir(iconDir)).filter((file) => file.endsWith(".svg"));

const symbols = [];

for (const file of files.sort()) {
  const name = path.basename(file, ".svg");
  const source = await readFile(path.join(iconDir, file), "utf8");
  const inner = source
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>[\s\S]*$/, "")
    .replace(/<path\s+stroke="none"\s+d="M0 0h24v24H0z"\s+fill="none"\s*\/>/g, "")
    .replace(/<path\s+d="M0 0h24v24H0z"\s+fill="none"\s+stroke="none"\s*\/>/g, "")
    .trim();

  symbols.push(
    `  <symbol id="i-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">\n    ${inner.replace(/\n\s*/g, "\n    ")}\n  </symbol>`
  );
}

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden">\n${symbols.join("\n")}\n</svg>`;

const pages = (await readdir(root)).filter((file) => file.endsWith(".html"));
let updated = 0;

for (const page of pages) {
  const file = path.join(root, page);
  const html = await readFile(file, "utf8");

  if (!html.includes("<!--ICON_SPRITE-->")) {
    continue;
  }

  await writeFile(file, html.replace("<!--ICON_SPRITE-->", sprite));
  updated += 1;
}

console.log(`Built sprite with ${symbols.length} icons. Updated ${updated} page(s).`);

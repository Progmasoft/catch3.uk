// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

// Copies the documentation of Catch3 from a checkout of Progmasoft/catch3 into content/docs, the
// pages of /docs/. The documentation lives with the source and keeps the licenses that repository
// states; the copy is generated and not committed.
//
//   node tools/docs.mjs <catch3-checkout>
//
// Links between documents become links between pages, links to other files of the repository
// point at GitHub, and the "Home" footer and the top anchor of each document are dropped, as the
// site has its own navigation.

import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { docSlug, rewriteDoc } from "../app/utils/docs.ts";

const checkout = process.argv[2];
if (!checkout) {
  console.error("usage: node tools/docs.mjs <catch3-checkout>");
  process.exit(2);
}

const source = join(checkout, "docs");
const target = new URL("../content/docs/", import.meta.url).pathname;
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });

const files = readdirSync(source)
  .filter((name) => name.endsWith(".md"))
  .sort();
const pages = [];
for (const name of files) {
  const { title, body } = rewriteDoc(readFileSync(join(source, name), "utf8"));
  const slug = docSlug(name);
  const front = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `source: ${JSON.stringify(`docs/${name}`)}`,
    `slug: ${JSON.stringify(slug)}`,
    "---",
    "",
  ].join("\n");
  writeFileSync(join(target, `${slug || "index"}.md`), front + body);
  pages.push(slug);
}
writeFileSync(join(target, "pages.json"), `${JSON.stringify(pages, null, 2)}\n`);
console.log(`${pages.length} documents from ${source}`);

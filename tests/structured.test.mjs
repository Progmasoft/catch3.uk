// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { sitePages } from "../app/utils/site.ts";
import { catch3Data, jsonLd } from "../app/utils/structured.ts";

const latest = { version: "0.4.0", date: "2026-11-15", tag: "catch3-0.4.0", summary: "..." };

test("the home page describes Catch3 with its latest release", () => {
  const data = catch3Data("de-DE", "/de", "Ein Testframework.", latest);
  assert.equal(data["@type"], "SoftwareSourceCode");
  assert.equal(data.url, "https://catch3.uk/de");
  assert.equal(data.inLanguage, "de-DE");
  assert.equal(data.version, "0.4.0");
  assert.equal(data.dateModified, "2026-11-15");
  assert.deepEqual(data.license, [
    "https://spdx.org/licenses/BSL-1.0.html",
    "https://spdx.org/licenses/LGPL-3.0-or-later.html",
  ]);
  assert.equal(catch3Data("en-US", "/", "x").url, "https://catch3.uk/");
  assert.equal(catch3Data("en-US", "/", "x").version, undefined);
});

test("JSON-LD text cannot close its script element", () => {
  const text = jsonLd({ description: "</script><b>" });
  assert.ok(!text.includes("</script>"));
  assert.deepEqual(JSON.parse(text), { description: "</script><b>" });
});

// The node tests run from the repository root.
const llms = readFileSync("public/llms.txt", "utf8");

test("llms.txt has the form of llmstxt.org and links every page of the site", () => {
  assert.match(llms, /^# Catch3\n\n> /);
  for (const page of sitePages) assert.ok(llms.includes(`(https://catch3.uk${page})`), page);
  for (const word of ["Tala", "Talac", "Xide", "X#"]) assert.ok(!llms.includes(word), word);
});

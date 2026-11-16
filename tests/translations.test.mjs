// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const folder = join(import.meta.dirname, "..", "i18n", "locales");
const read = (name) => JSON.parse(readFileSync(join(folder, `${name}.json`), "utf8"));

/** Every key of a message tree with the placeholders of its text, as "a.b.c {x}". */
function keys(tree, prefix = "") {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string"
      ? [`${prefix}${key} ${[...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).join(",")}`]
      : keys(value, `${prefix}${key}.`),
  );
}

const english = keys(read("en-US")).sort();

for (const language of ["de-DE", "ru-RU", "fr-FR"]) {
  test(`${language} has every message of en-US with the same placeholders`, () => {
    assert.deepEqual(keys(read(language)).sort(), english);
  });

  test(`${language} leaves no message empty`, () => {
    assert.ok(!JSON.stringify(read(language)).includes('""'), "an empty message");
  });
}

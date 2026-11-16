// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import assert from "node:assert/strict";
import { test } from "node:test";
import english from "../i18n/locales/en-US.json" with { type: "json" };
import german from "../i18n/locales/de-DE.json" with { type: "json" };
import russian from "../i18n/locales/ru-RU.json" with { type: "json" };
import french from "../i18n/locales/fr-FR.json" with { type: "json" };

/** Every key of a message tree with the placeholders of its text, as "a.b.c x,y". */
function keys(tree, prefix = "") {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string"
      ? [`${prefix}${key} ${[...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).join(",")}`]
      : keys(value, `${prefix}${key}.`),
  );
}

const reference = keys(english).sort();

for (const [language, messages] of Object.entries({
  "de-DE": german,
  "ru-RU": russian,
  "fr-FR": french,
})) {
  test(`${language} has every message of en-US with the same placeholders`, () => {
    assert.deepEqual(keys(messages).sort(), reference);
  });

  test(`${language} leaves no message empty`, () => {
    assert.ok(!JSON.stringify(messages).includes('""'), "an empty message");
  });
}

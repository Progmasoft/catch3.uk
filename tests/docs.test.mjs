// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import assert from "node:assert/strict";
import { test } from "node:test";
import { docPath, docSlug, docsSource, rewriteDoc, rewriteLink } from "../app/utils/docs.ts";

test("each document has its page under /docs/", () => {
  assert.equal(docSlug("Readme.md"), "");
  assert.equal(docSlug("release-notes.md"), "changelog");
  assert.equal(docSlug("progmasoft-runner.md"), "progmasoft-runner");
  assert.equal(docPath(""), "/docs/");
  assert.equal(docPath("tutorial"), "/docs/tutorial/");
});

test("links between documents stay on the site, other files go to GitHub", () => {
  assert.equal(rewriteLink("tutorial.md"), "/docs/tutorial/");
  assert.equal(rewriteLink("tutorial.md#writing-tests"), "/docs/tutorial/#writing-tests");
  assert.equal(rewriteLink("Readme.md#top"), "/docs/");
  assert.equal(rewriteLink("release-notes.md#v300"), "/docs/changelog/#v300");
  assert.equal(
    rewriteLink("../examples/010-TestCase.cpp"),
    `${docsSource}examples/010-TestCase.cpp`,
  );
  assert.equal(rewriteLink("doxygen/index.html"), `${docsSource}docs/doxygen/index.html`);
  assert.equal(rewriteLink("#sections"), "#sections");
  assert.equal(rewriteLink("https://godbolt.org/z/1"), "https://godbolt.org/z/1");
  assert.equal(rewriteLink("mailto:support@progmasoft.com"), "mailto:support@progmasoft.com");
});

test("a document loses its top anchor and Home link, and code keeps its text", () => {
  const { title, body } = rewriteDoc(
    [
      '<a id="top"></a>',
      "# Assertion Macros",
      "",
      'See [the tutorial](tutorial.md) and <a href="logging.md#info">logging</a>.',
      "",
      "```cpp",
      "// [not a link](tutorial.md)",
      "```",
      "",
      "---",
      "",
      "[Home](Readme.md#top)",
      "",
    ].join("\r\n"),
  );
  assert.equal(title, "Assertion Macros");
  assert.ok(body.startsWith("# Assertion Macros\n"));
  assert.ok(body.includes("[the tutorial](/docs/tutorial/)"));
  assert.ok(body.includes('href="/docs/logging/#info"'));
  assert.ok(body.includes("// [not a link](tutorial.md)"));
  assert.ok(!body.includes("Home"));
  assert.ok(!body.includes('id="top"'));
  assert.ok(!body.trimEnd().endsWith("---"));
});

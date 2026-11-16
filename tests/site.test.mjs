// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import assert from "node:assert/strict";
import { test } from "node:test";
import { detectSystem, isSystem, systems } from "../app/utils/site.ts";
import { majorMinor, newestFirst, releaseUrl, sourceArchiveUrl } from "../app/utils/releases.ts";

test("a browser's system comes from its platform or its user agent", () => {
  assert.equal(detectSystem("Windows", ""), "windows");
  assert.equal(detectSystem("macOS", ""), "macos");
  assert.equal(detectSystem("Linux", ""), "linux");
  assert.equal(detectSystem(undefined, "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"), "windows");
  assert.equal(detectSystem(undefined, "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)"), "macos");
  assert.equal(detectSystem(undefined, "Mozilla/5.0 (X11; Linux x86_64)"), "linux");
  assert.equal(detectSystem(undefined, "Mozilla/5.0 (Linux; Android 15; Pixel 9)"), "linux");
  assert.equal(detectSystem(undefined, "Mozilla/5.0 (X11; CrOS x86_64 16000.0.0)"), "linux");
});

test("iOS, iPadOS and unknown systems get no installer page", () => {
  assert.equal(
    detectSystem(undefined, "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)"),
    undefined,
  );
  assert.equal(detectSystem(undefined, "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)"), undefined);
  assert.equal(detectSystem("", "SomethingElse/1.0"), undefined);
});

test("only the three systems are values of ?os=", () => {
  for (const system of systems) assert.ok(isSystem(system));
  for (const value of ["", "Linux", "android", undefined, 3, ["linux"]])
    assert.ok(!isSystem(value));
});

test("releases are ordered newest first, number by number", () => {
  const versions = ["0.1.0", "0.3.0.1", "0.10.0", "0.3.0", "0.4.0", "0.3.0.2", "0.2.0"];
  assert.deepEqual(versions.sort(newestFirst), [
    "0.10.0",
    "0.4.0",
    "0.3.0.2",
    "0.3.0.1",
    "0.3.0",
    "0.2.0",
    "0.1.0",
  ]);
  assert.equal(newestFirst("1.2.3", "1.2.3"), 0);
});

test("release addresses and the CMake version come from the release", () => {
  const release = { tag: "catch3-0.4.0" };
  assert.equal(
    releaseUrl(release),
    "https://github.com/Progmasoft/catch3/releases/tag/catch3-0.4.0",
  );
  assert.equal(
    sourceArchiveUrl(release),
    "https://github.com/Progmasoft/catch3/archive/refs/tags/catch3-0.4.0.tar.gz",
  );
  assert.equal(majorMinor("0.4.0"), "0.4");
  assert.equal(majorMinor("0.3.0.2"), "0.3");
});

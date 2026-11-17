// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import assert from "node:assert/strict";
import { test } from "node:test";
import { detectSystem, isSystem, systems } from "../app/utils/site.ts";
import {
  releaseAnchor,
  commandFiles,
  installerUrls,
  majorMinor,
  newestFirst,
  sourceFiles,
} from "../app/utils/releases.ts";

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

test("the download page lists macOS, then Windows, then Linux", () => {
  assert.deepEqual([...systems], ["macos", "windows", "linux"]);
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

test("the files of a release are on storage.catch3.uk, each with its sums and SBOM", () => {
  const [tarXz, zip] = sourceFiles("0.4.0");
  assert.equal(tarXz.url, "https://storage.catch3.uk/0.4.0/source/catch3-0.4.0.tar.xz");
  assert.equal(zip.url, "https://storage.catch3.uk/0.4.0/source/catch3-0.4.0.zip");
  assert.equal(tarXz.sha256, `${tarXz.url}.sha256sums`);
  assert.equal(tarXz.blake3, `${tarXz.url}.b3sums`);
  assert.equal(tarXz.sbom, `${tarXz.url}.cdx.json`);
  const command = commandFiles("1.0.0");
  assert.deepEqual(
    [...command.macos, ...command.windows].map((file) => file.url),
    [
      "https://storage.catch3.uk/1.0.0/darwin/arm64/catch3-1.0.0-darwin-arm64.zip",
      "https://storage.catch3.uk/1.0.0/darwin/x86_64/catch3-1.0.0-darwin-x86_64.zip",
      "https://storage.catch3.uk/1.0.0/windows/x64/catch3-1.0.0-windows-x64.zip",
      "https://storage.catch3.uk/1.0.0/windows/arm64/catch3-1.0.0-windows-arm64.zip",
    ],
  );
  assert.deepEqual(installerUrls("1.0.0"), {
    zsh: "https://storage.catch3.uk/1.0.0/darwin/install.zsh",
    powershell: "https://storage.catch3.uk/1.0.0/windows/Install-Catch3.ps1",
    cmd: "https://storage.catch3.uk/1.0.0/windows/install.cmd",
  });
  assert.equal(releaseAnchor("0.4.0"), "v0.4.0");
  assert.equal(majorMinor("0.4.0"), "0.4");
  assert.equal(majorMinor("0.3.0.2"), "0.3");
});

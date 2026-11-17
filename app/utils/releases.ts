// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

/** A release of Catch3, as content/releases holds it. */
export interface Release {
  version: string;
  date: string;
  tag: string;
  summary: string;
  /** Whether the release has the catch3 command. */
  command: boolean;
}

/** Where the files of every release are. */
export const storage = "https://storage.catch3.uk";

/**
 * Orders two versions newest first. Each number is compared as a number, and a version with
 * more numbers comes after the same version with fewer: 0.3.0.2 is newer than 0.3.0.
 */
export function newestFirst(a: string, b: string): number {
  const left = a.split(".").map(Number);
  const right = b.split(".").map(Number);
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const difference = (right[i] ?? -1) - (left[i] ?? -1);
    if (difference !== 0) return difference;
  }
  return 0;
}

/** A file of a release: the archive, and beside it its SHA-256, BLAKE3 and CycloneDX files. */
export interface ReleaseFile {
  /** The key of its label among the messages, under releases.files. */
  label: string;
  url: string;
  sha256: string;
  blake3: string;
  sbom: string;
}

function file(label: string, url: string): ReleaseFile {
  return {
    label,
    url,
    sha256: `${url}.sha256sums`,
    blake3: `${url}.b3sums`,
    sbom: `${url}.cdx.json`,
  };
}

/** The source archives of a release. */
export function sourceFiles(version: string): ReleaseFile[] {
  const base = `${storage}/${version}/source/catch3-${version}`;
  return [file("sourceTarXz", `${base}.tar.xz`), file("sourceZip", `${base}.zip`)];
}

/** The archives of the catch3 command of a release, for macOS and Windows. */
export function commandFiles(version: string): { macos: ReleaseFile[]; windows: ReleaseFile[] } {
  const base = `${storage}/${version}`;
  return {
    macos: [
      file("macosArm64", `${base}/darwin/arm64/catch3-${version}-darwin-arm64.zip`),
      file("macosX86_64", `${base}/darwin/x86_64/catch3-${version}-darwin-x86_64.zip`),
    ],
    windows: [
      file("windowsX64", `${base}/windows/x64/catch3-${version}-windows-x64.zip`),
      file("windowsArm64", `${base}/windows/arm64/catch3-${version}-windows-arm64.zip`),
    ],
  };
}

/** The installers of the catch3 command of a release. */
export function installerUrls(version: string) {
  const base = `${storage}/${version}`;
  return {
    zsh: `${base}/darwin/install.zsh`,
    powershell: `${base}/windows/Install-Catch3.ps1`,
    cmd: `${base}/windows/install.cmd`,
  };
}

/** The anchor of a release, the row of /releases/ that holds its notes and files. */
export function releaseAnchor(version: string): string {
  return `v${version}`;
}

/** MAJOR.MINOR of a version, as find_package asks for it. */
export function majorMinor(version: string): string {
  return version.split(".").slice(0, 2).join(".");
}

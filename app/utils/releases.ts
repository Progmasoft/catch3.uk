// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

/** A release of Catch3, as content/releases holds it. */
export interface Release {
  version: string;
  date: string;
  tag: string;
  summary: string;
}

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

/** The page of a release on GitHub. */
export function releaseUrl(release: Pick<Release, "tag">): string {
  return `https://github.com/Progmasoft/catch3/releases/tag/${release.tag}`;
}

/** The source archive of a release on GitHub. */
export function sourceArchiveUrl(release: Pick<Release, "tag">): string {
  return `https://github.com/Progmasoft/catch3/archive/refs/tags/${release.tag}.tar.gz`;
}

/** MAJOR.MINOR of a version, as find_package asks for it. */
export function majorMinor(version: string): string {
  return version.split(".").slice(0, 2).join(".");
}

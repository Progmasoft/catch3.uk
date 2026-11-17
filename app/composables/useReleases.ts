// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import { newestFirst, type Release } from "~/utils/releases";

/** Every release of Catch3, newest first. */
export function useReleases() {
  return useAsyncData("releases", async () => {
    const rows = await queryCollection("releases")
      .select("version", "date", "tag", "summary", "command")
      .all();
    return rows
      .map((row): Release => ({
        version: row.version,
        date: row.date,
        tag: row.tag,
        summary: row.summary,
        command: row.command ?? false,
      }))
      .sort((a, b) => newestFirst(a.version, b.version));
  });
}

/** Every release with its full notes, newest first, for the rows of /releases/. */
export function useReleaseNotes() {
  return useAsyncData("release-notes", async () => {
    const rows = await queryCollection("releases").all();
    return rows.sort((a, b) => newestFirst(a.version, b.version));
  });
}

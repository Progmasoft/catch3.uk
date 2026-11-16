// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import { newestFirst, type Release } from "~/utils/releases";

/** Every release of Catch3, newest first. */
export function useReleases() {
  return useAsyncData("releases", async () => {
    const rows = await queryCollection("releases").all();
    return rows
      .map((row): Release => ({
        version: row.version,
        date: row.date,
        tag: row.tag,
        summary: row.summary,
      }))
      .sort((a, b) => newestFirst(a.version, b.version));
  });
}

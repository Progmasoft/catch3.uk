// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import { defineCollection, defineContentConfig, z } from "@nuxt/content";

// One file for each release of Catch3: its facts above, its full notes below. The notes are in
// English, as on GitHub.
export default defineContentConfig({
  collections: {
    releases: defineCollection({
      type: "page",
      source: "releases/*.md",
      schema: z.object({
        version: z.string(),
        date: z.string(),
        tag: z.string(),
        summary: z.string(),
        // Whether the release has the catch3 command, with its archives on storage.catch3.uk.
        command: z.boolean().default(false),
      }),
    }),
  },
});

// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import { defineCollection, defineContentConfig, z } from "@nuxt/content";

// One file for each release of Catch3. The summaries are English, as the release notes are.
export default defineContentConfig({
  collections: {
    releases: defineCollection({
      type: "data",
      source: "releases/*.yml",
      schema: z.object({
        version: z.string(),
        date: z.string(),
        tag: z.string(),
        summary: z.string(),
      }),
    }),
  },
});

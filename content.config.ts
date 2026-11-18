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
    // The documentation of Catch3, copied from its source by tools/docs.mjs before a build. It is
    // in English, as in the repository; the page around it is in the visitor's language.
    docs: defineCollection({
      type: "page",
      source: "docs/*.md",
      schema: z.object({
        title: z.string(),
        // The document in Progmasoft/catch3, such as docs/tutorial.md.
        source: z.string(),
        // The page under /docs/; empty for /docs/ itself.
        slug: z.string(),
      }),
    }),
  },
});

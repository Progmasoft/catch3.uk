// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import { localePrefixes, localeTags, sitePages, siteUrl } from "../../app/utils/site";

/** The address of a page in a language: English has no prefix, and the home page no slash. */
function address(prefix: (typeof localePrefixes)[number], page: string) {
  return siteUrl + (prefix && page === "/" ? prefix : prefix + page);
}

/** Every page, each with its address in every language. */
export default defineEventHandler((event) => {
  const entries = sitePages.flatMap((page) =>
    localePrefixes.map((prefix) => {
      const alternates = localePrefixes
        .map(
          (other) =>
            `    <xhtml:link rel="alternate" hreflang="${localeTags[other]}" href="${address(other, page)}"/>`,
        )
        .join("\n");
      return `  <url>\n    <loc>${address(prefix, page)}</loc>\n${alternates}\n  </url>`;
    }),
  );
  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;
});

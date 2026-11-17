// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Release } from "./releases.ts";
import { repository, siteUrl } from "./site.ts";

/**
 * The schema.org data of the home page, as JSON-LD: Catch3 is open-source software with a public
 * repository, so it is `SoftwareSourceCode`, published by Progmasoft. Files from Catch2 keep the
 * Boost Software License; Progmasoft's own files are LGPL-3.0-or-later.
 */
export function catch3Data(language: string, path: string, description: string, latest?: Release) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "@id": "https://catch3.uk/#software",
    name: "Catch3",
    alternateName: "Progmasoft Catch3",
    description,
    url: siteUrl + (path === "/" ? "/" : path),
    sameAs: ["https://product.progmasoft.com/catch3"],
    codeRepository: repository,
    discussionUrl: `${repository}/issues`,
    programmingLanguage: "C++",
    license: [
      "https://spdx.org/licenses/BSL-1.0.html",
      "https://spdx.org/licenses/LGPL-3.0-or-later.html",
    ],
    creativeWorkStatus: "Released",
    ...(latest ? { version: latest.version, dateModified: latest.date } : {}),
    keywords:
      "C++17, test framework, Catch2, unit testing, property-based testing, mocking, snapshot testing, test runner, JUnit XML",
    inLanguage: language,
    publisher: {
      "@type": "Organization",
      "@id": "https://progmasoft.com/#organization",
      name: "Progmasoft",
      url: "https://progmasoft.com/",
    },
  };
}

/** The text of a JSON-LD script element; `<` is escaped so that no value can close it. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

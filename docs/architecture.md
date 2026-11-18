<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

# Architecture

catch3.uk is a Nuxt site generated to static files.

| Path                             | What it holds                                                                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/pages/`                     | The pages: the home page, `download`, `releases/`, `docs/`                                                                                          |
| `app/components/`                | The header, the footer, the theme switch, the logo and the hero                                                                                     |
| `app/composables/useReleases.ts` | The releases, read from the content                                                                                                                 |
| `app/utils/`                     | Release files and their sums (`releases.ts`), the documentation (`docs.ts`), the structured data (`structured.ts`), the site's settings (`site.ts`) |
| `content/`                       | The release notes, one file per release                                                                                                             |
| `i18n/locales/`                  | The texts in en-US, de-DE, ru-RU and fr-FR                                                                                                          |
| `server/routes/`                 | `sitemap.xml`, generated with the site                                                                                                              |
| `tools/docs.mjs`                 | Copies the documentation of Progmasoft/catch3 into `content/docs`, the pages of `/docs/`; the copy is not committed                                 |

A release is one row of `/releases/`: the library and the catch3 command share one version.

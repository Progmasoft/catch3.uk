// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import { localePrefixes, sitePages } from "./app/utils/site";

// Every page in every language, so the generated site holds them all even before a link is found.
const routes = localePrefixes.flatMap((prefix) =>
  sitePages.map((page) => (prefix + page).replace(/(.)\/$/, "$1")),
);

export default defineNuxtConfig({
  compatibilityDate: "2026-10-15",
  devtools: { enabled: false },
  telemetry: false,
  modules: ["@nuxt/content", "@nuxtjs/i18n"],
  css: ["~/assets/site.css"],
  content: {
    experimental: { sqliteConnector: "native" },
    build: {
      markdown: {
        highlight: {
          // Code is set on a dark ground in both themes.
          theme: "github-dark",
          langs: ["cpp", "cmake", "python", "bash", "powershell", "batch"],
        },
      },
    },
  },
  i18n: {
    baseUrl: "https://catch3.uk",
    defaultLocale: "en",
    strategy: "prefix_except_default",
    // The site is static: a visitor chooses the language; nothing redirects by browser language.
    detectBrowserLanguage: false,
    locales: [
      { code: "en", language: "en-US", name: "English", file: "en-US.json" },
      { code: "de", language: "de-DE", name: "Deutsch", file: "de-DE.json" },
      { code: "ru", language: "ru-RU", name: "Русский", file: "ru-RU.json" },
      { code: "fr", language: "fr-FR", name: "Français", file: "fr-FR.json" },
    ],
  },
  app: {
    head: {
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#ffffff", media: "(prefers-color-scheme: light)" },
        { name: "theme-color", content: "#0b0d10", media: "(prefers-color-scheme: dark)" },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [...routes, "/sitemap.xml"],
      failOnError: true,
    },
  },
  typescript: { strict: true },
});

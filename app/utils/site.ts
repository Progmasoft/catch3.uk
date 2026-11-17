// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

/** The address of the site, without a trailing slash. */
export const siteUrl = "https://catch3.uk";

/** The source of Catch3 and of this site. */
export const repository = "https://github.com/Progmasoft/catch3";
export const siteRepository = "https://github.com/Progmasoft/catch3.uk";

/** The documentation of Catch3, which lives with its source. */
export const docs = `${repository}/blob/devel/docs`;

/** The path prefix of each language; English, the default, has none. */
export const localePrefixes = ["", "/de", "/ru", "/fr"] as const;

/** The language tag of each prefix, for hreflang. */
export const localeTags = { "": "en-US", "/de": "de-DE", "/ru": "ru-RU", "/fr": "fr-FR" } as const;

/** Every page of the site, as its path in English. */
export const sitePages = ["/", "/download", "/releases/"] as const;

/** The operating systems of the download page, in the order it lists them. */
export const systems = ["macos", "windows", "linux"] as const;
export type System = (typeof systems)[number];

/** Whether a value of the `os` query parameter names one of the systems. */
export function isSystem(value: unknown): value is System {
  return typeof value === "string" && (systems as readonly string[]).includes(value);
}

/**
 * The system a browser runs on, from its user-agent data when the browser has it and from its
 * user-agent string otherwise. Android and ChromeOS count as Linux; iOS and iPadOS, which run no
 * installer, give undefined, and so does anything unknown.
 */
export function detectSystem(platform: string | undefined, userAgent: string): System | undefined {
  const text = `${platform ?? ""} ${userAgent}`.toLowerCase();
  if (/iphone|ipad|ipod/.test(text)) return undefined;
  if (/windows|win32|win64/.test(text)) return "windows";
  if (/mac ?os|macintosh|macintel/.test(text)) return "macos";
  if (/linux|android|cros|x11/.test(text)) return "linux";
  return undefined;
}

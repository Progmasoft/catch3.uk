// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

/** Where the documentation of Catch3 comes from: the docs folder of its source on devel. */
export const docsSource = "https://github.com/Progmasoft/catch3/blob/devel/";

/** The page of a document: Readme.md is /docs/ itself, release-notes.md is /docs/changelog/. */
export function docSlug(fileName: string): string {
  const name = fileName.replace(/\.md$/, "");
  if (name === "Readme") return "";
  if (name === "release-notes") return "changelog";
  return name.toLowerCase();
}

/** The path of a document's page on the site, in English. */
export function docPath(slug: string): string {
  return slug ? `/docs/${slug}/` : "/docs/";
}

/** Where a link of a document goes on the site. */
export function rewriteLink(target: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("#")) return target;
  const hash = target.indexOf("#");
  const path = hash < 0 ? target : target.slice(0, hash);
  const anchor = hash < 0 ? "" : target.slice(hash);
  // Another document of the docs folder.
  if (!path.includes("/") && path.endsWith(".md")) {
    const slug = docSlug(path);
    return docPath(slug) + (anchor === "#top" ? "" : anchor);
  }
  // A file elsewhere in the repository, such as ../examples/010-TestCase.cpp.
  if (path.startsWith("../")) return docsSource + path.slice(3) + anchor;
  return docsSource + "docs/" + path + anchor;
}

/**
 * A document as the site shows it: its title (its first heading) and its text with the links
 * rewritten, without the top anchor and the "Home" link the documents carry for GitHub.
 */
export function rewriteDoc(text: string): { title: string; body: string } {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const kept = lines.filter(
    (line) =>
      line.trim() !== '<a id="top"></a>' && !/^\[Home\]\(Readme\.md(#top)?\)\s*$/.test(line),
  );
  let fenced = false;
  const body = kept
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
      if (fenced) return line;
      return line
        .replace(/\]\(([^)\s]+)\)/g, (_, target: string) => `](${rewriteLink(target)})`)
        .replace(/href="([^"]+)"/g, (_, target: string) => `href="${rewriteLink(target)}"`);
    })
    .join("\n")
    .replace(/\n---\s*\n*$/, "\n")
    .replace(/^\n+/, "");
  const heading = body.match(/^# (.+)$/m);
  return { title: heading ? heading[1]!.trim() : "Catch3", body };
}

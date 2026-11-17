// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

// Every page of the site in every language: the generated sitemap lists them.
// Playwright runs from the repository root.
const sitemap = readFileSync(".output/public/sitemap.xml", "utf8");
const pages = [...sitemap.matchAll(/<loc>https:\/\/catch3\.uk([^<]*)<\/loc>/g)].map(
  (match) => match[1],
);

async function open(page, path) {
  const response = await page.goto(`http://catch3.uk${path}`);
  expect(response?.status(), `status of ${path}`).toBeLessThan(400);
}

/**
 * Elements that reach past either edge of the viewport, outside any box that
 * scrolls or clips them. One such element is enough for a phone to scroll
 * sideways or to cut text off.
 */
function elementsPastTheEdges(page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const clipped = (element) => {
      for (let p = element.parentElement; p && p !== document.body; p = p.parentElement) {
        if (getComputedStyle(p).overflowX !== "visible") return true;
      }
      return false;
    };
    const found = [];
    for (const element of document.body.querySelectorAll("*")) {
      const box = element.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) continue;
      if (box.right <= width + 1 && box.left >= -1) continue;
      if (clipped(element)) continue;
      found.push(
        `${element.tagName.toLowerCase()}.${String(element.className)} ${Math.round(box.left)}..${Math.round(box.right)}`,
      );
    }
    return found;
  });
}

/**
 * Controls smaller than 24 by 24 CSS pixels, the minimum target size of WCAG
 * 2.2 (2.5.8). Links inside running text are exempt, as WCAG exempts them.
 */
function smallControls(page) {
  return page.evaluate(() => {
    const controls = document.querySelectorAll(
      "button, summary, select, input:not([type=hidden]), .button, .icon-button, header a, footer a, nav a",
    );
    const found = [];
    for (const control of controls) {
      const box = control.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) continue;
      if (box.width < 24 || box.height < 24) {
        found.push(
          `${control.tagName.toLowerCase()} "${control.textContent?.trim().slice(0, 24)}" ${Math.round(box.width)}x${Math.round(box.height)}`,
        );
      }
    }
    return found;
  });
}

test("the sitemap lists the pages", () => {
  expect(pages.length).toBeGreaterThan(8);
});

for (const path of pages) {
  test(`${path} fits the screen`, async ({ page }) => {
    await open(page, path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, "horizontal scroll").toBe(0);
    expect(await elementsPastTheEdges(page)).toEqual([]);
    expect(await smallControls(page)).toEqual([]);
    const header = await page.locator("header.header").boundingBox();
    expect(header?.height ?? 0, "header height").toBeLessThanOrEqual(80);
  });
}

test("the menu of a phone opens inside the screen", async ({ page }) => {
  const menu = page.locator("details.dropdown.mobile > summary");
  await open(page, "/");
  test.skip(!(await menu.isVisible()), "wide screens show the links in the header");
  await menu.click();
  await expect(page.locator("details.dropdown.mobile a").first()).toBeVisible();
  expect(await elementsPastTheEdges(page)).toEqual([]);
});

// The page of each system is drawn in the browser from ?os=, so the sitemap does not list them.
for (const system of ["macos", "windows", "linux"]) {
  test(`/download?os=${system} fits the screen`, async ({ page }) => {
    await open(page, `/download?os=${system}`);
    await expect(page.locator(".system[aria-current=page]")).toHaveCount(1);
    await expect(page.locator(".system-page h2")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, "horizontal scroll").toBe(0);
    expect(await elementsPastTheEdges(page)).toEqual([]);
    expect(await smallControls(page)).toEqual([]);
  });
}

test("/download without a system shows the three systems", async ({ page }) => {
  await open(page, "/download");
  await expect(page.locator(".system")).toHaveCount(3);
});

// Nuxt Content builds the site even when a file of content/releases does not match its schema, so
// the releases are checked as the pages show them.
test("every release has a version, a date, its notes and its source files", async ({ page }) => {
  await open(page, "/releases/");
  const rows = await page.locator(".rows > details").evaluateAll((items) =>
    items.map((item) => ({
      id: item.id,
      open: item.open,
      version: item.querySelector(".version")?.textContent?.trim() ?? "",
      date: item.querySelector("time")?.getAttribute("datetime") ?? "",
      notes: item.querySelector(".notes")?.textContent?.trim() ?? "",
      files: [...item.querySelectorAll("a.file")].map((a) => a.getAttribute("href")),
    })),
  );
  expect(rows.length).toBeGreaterThan(0);
  expect(rows.map((row) => row.open)).toEqual(rows.map((_, index) => index === 0));
  for (const row of rows) {
    expect(row.version).toMatch(/^\d+\.\d+\.\d+(?:\.\d+)?$/);
    expect(row.id).toBe(`v${row.version}`);
    expect(row.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(`${row.date}T00:00:00Z`))).toBe(false);
    expect(row.notes.length).toBeGreaterThan(40);
    const base = `https://storage.catch3.uk/${row.version}/source/catch3-${row.version}`;
    expect(row.files).toEqual([`${base}.tar.xz`, `${base}.zip`]);
  }
});

test("an address naming a release opens its row", async ({ page }) => {
  await open(page, "/releases/");
  const last = (await page.locator(".rows .version").allTextContents()).at(-1)?.trim();
  // A new load: going to the same page with another anchor would not load it again.
  await page.goto("about:blank");
  await open(page, `/releases/#v${last}`);
  await expect(page.locator(`[id="v${last}"]`)).toHaveJSProperty("open", true);
});

test("the theme switch changes the theme and the page remembers it", async ({ page }) => {
  await open(page, "/");
  const theme = () => page.evaluate(() => document.documentElement.dataset.theme ?? "");
  const ground = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const before = await ground();
  await page.locator("button.theme").click();
  const chosen = await theme();
  expect(["light", "dark"]).toContain(chosen);
  expect(await ground()).not.toBe(before);
  await page.reload();
  expect(await theme()).toBe(chosen);
  await page.locator("button.theme").click();
  expect(await theme()).not.toBe(chosen);
});

test("the systems of the download page are macOS, Windows and Linux, in that order", async ({
  page,
}) => {
  await open(page, "/download");
  await expect(page.locator(".system")).toHaveText(["macOS", "Windows", "Linux"]);
});

// nginx answers every unknown address with /404.html; the file server of these tests has its own
// 404, so the page is opened by its name.
test("the page of an unknown address has the site around it and fits the screen", async ({
  page,
}) => {
  await open(page, "/404.html");
  await expect(page.locator("h1")).toHaveText("Page not caught");
  await expect(page.locator(".status")).toHaveText("404");
  await expect(page).toHaveTitle("Page not caught · Catch3");
  await expect(page.locator("header.header")).toBeVisible();
  await expect(page.locator("footer.footer")).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
  expect(await elementsPastTheEdges(page)).toEqual([]);
});

test("the language control is a small pill with a compact menu", async ({ page }) => {
  await open(page, "/");
  const pill = page.locator("summary.language");
  await expect(pill).toHaveText("EN");
  const box = await pill.boundingBox();
  expect(box?.height ?? 0).toBeLessThanOrEqual(36);
  await pill.click();
  const item = page.locator("details.dropdown:not(.mobile) li a").first();
  await expect(item).toBeVisible();
  const itemBox = await item.boundingBox();
  expect(itemBox?.height ?? 0).toBeLessThanOrEqual(40);
  expect(itemBox?.height ?? 0).toBeGreaterThanOrEqual(24);
});

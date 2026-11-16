// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

// Every page of the site in every language: the generated sitemap lists them.
const sitemap = readFileSync(
  join(import.meta.dirname, "..", ".output", "public", "sitemap.xml"),
  "utf8",
);
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
for (const system of ["linux", "macos", "windows"]) {
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

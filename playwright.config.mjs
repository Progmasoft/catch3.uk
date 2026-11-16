// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

import { defineConfig } from "@playwright/test";

/**
 * Layout tests of the generated site in Chromium, at the widths of phones, a
 * tablet and a desktop. catch3.uk resolves to the local server of
 * e2e/serve.mjs, so the pages keep their real addresses and no request
 * leaves the machine.
 */
const port = 3300;
const phone = { isMobile: true, hasTouch: true, deviceScaleFactor: 2 };

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : "list",
  use: {
    browserName: "chromium",
    launchOptions: {
      args: [`--host-resolver-rules=MAP catch3.uk 127.0.0.1:${port}`],
    },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "phone-360",
      use: { ...phone, viewport: { width: 360, height: 780 } },
    },
    {
      name: "phone-390",
      use: { ...phone, viewport: { width: 390, height: 844 } },
    },
    {
      name: "tablet-768",
      use: { ...phone, viewport: { width: 768, height: 1024 } },
    },
    { name: "desktop-1280", use: { viewport: { width: 1280, height: 800 } } },
  ],
  webServer: {
    command: `node e2e/serve.mjs ${port}`,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: !process.env.CI,
  },
});

<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

# Development

```sh
npm ci
npm run dev             # the site on a local server
npm run check           # the type check
npm test                # the unit tests, in tests/
npm run test:layout     # Playwright at 360, 390, 768 and 1280 pixels
npm run format:check
npm run generate        # the static output, in .output/public
```

The layout tests check that no page scrolls sideways, that targets are at least 24 pixels and that the header stays
on one line. CI runs all of these; the site is deployed from a green `main`.

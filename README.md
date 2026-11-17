<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

# catch3.uk

The site of [Catch3](https://github.com/Progmasoft/catch3), the C++17 test framework that keeps Catch2's way of
writing tests and adds property testing, snapshots and a runner of its own, at [catch3.uk](https://catch3.uk/).
It is built with Nuxt 4, Nuxt Content and Nuxt i18n, in English, German, Russian and French.

## What it serves

| Address                                                   | What                                                             |
| --------------------------------------------------------- | ---------------------------------------------------------------- |
| `catch3.uk/`                                              | the home page                                                    |
| `catch3.uk/download`                                      | sends the visitor to the download page of their operating system |
| `catch3.uk/download?os=macos`, `?os=windows`, `?os=linux` | how to install Catch3 on that system                             |
| `catch3.uk/releases/`                                     | every release with its notes and files                           |
| `catch3.uk/docs/`, `catch3.uk/docs/<page>/`               | the documentation of Catch3; `/docs/changelog/` its changelog    |
| `storage.catch3.uk/<version>/…`                           | the installers of each release                                   |
| `survey.catch3.uk`                                        | the user survey, a Nitro server of its own                       |

## Installing Catch3

Catch3 is the library and the `catch3` command, which runs test binaries, reads their results and reports them,
and imports the results of other test frameworks. The command links the C++ standard library statically.

| System  | With                                                 | Requires                    |
| ------- | ---------------------------------------------------- | --------------------------- |
| Linux   | the Linux package repositories of Progmasoft (below) | glibc 2.28 or later         |
| macOS   | `install.zsh`                                        | macOS 13 or later           |
| Windows | `Install-Catch3.ps1` (PowerShell 7) or `install.cmd` | Windows 10 or later, 64-bit |

A script downloads the archive of its system and processor with curl, together with its `.sha256sums` file, and
checks the archive against it; when the system has `b3sum`, it also downloads the `.b3sums` file and checks that.
A mismatch stops it before anything is extracted. It then extracts the archive into a temporary directory and
installs from there. Without arguments it installs for the current user.

|                          | `install.zsh`                         | `Install-Catch3.ps1`                     | `install.cmd`                                           |
| ------------------------ | ------------------------------------- | ---------------------------------------- | ------------------------------------------------------- |
| for every user           | `-g`                                  | `-Global`                                | `/global`                                               |
| language of the messages | `-l en-us`, `de-de`, `ru-ru`, `fr-fr` | `-Language EnUs`, `DeDe`, `RuRu`, `FrFr` | `/langenus` or `/lang:enus`, and `dede`, `ruru`, `frfr` |
| help                     | `-h`                                  | `-Help`                                  | `/?`, `/HELP`                                           |
| upper and lower case     | told apart                            | not told apart                           | told apart, but `/HELP` in any case                     |

### The Linux package repositories of Progmasoft

| Package manager | Repository                                                                                                |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| APT             | `apt.progmasoft.com`                                                                                      |
| DNF             | `dnf.progmasoft.com`                                                                                      |
| Zypper          | `zypp.progmasoft.com`                                                                                     |
| Nix             | `nix.progmasoft.com/flakes`, a Git repository of flakes, and `nix.progmasoft.com/cache`, its binary cache |
| pacman          | `pacman.progmasoft.com`                                                                                   |

### storage.catch3.uk

```text
<version>/darwin/arm64/catch3-<version>-darwin-arm64.zip
<version>/darwin/x86_64/catch3-<version>-darwin-x86_64.zip
<version>/darwin/install.zsh
<version>/windows/arm64/catch3-<version>-windows-arm64.zip
<version>/windows/x64/catch3-<version>-windows-x64.zip
<version>/windows/Install-Catch3.ps1
<version>/windows/install.cmd
<version>/doxygen/catch3_doxygen-<version>.zip
<version>/doxygen/catch3_doxygen-<version>.tar.xz
```

Beside each archive are `<archive>.sha256sums`, `<archive>.b3sums` and `<archive>.cdx.json`, its CycloneDX SBOM.

## Development

The pages of `/docs/` are made from the `docs` folder of a checkout of
[Progmasoft/catch3](https://github.com/Progmasoft/catch3), where the documentation lives with the source and keeps
its licenses; `tools/docs.mjs` copies it into `content/docs`, which is not committed. CI uses the devel branch.

```bash
node tools/docs.mjs ../catch3   # before anything else
npm ci
npm run dev           # http://localhost:3000
npm run generate      # .output/public: every page in every language, and sitemap.xml
npm run check         # types
npm test              # system detection, release order, translations
npm run format:check
npx playwright install chromium
npm run test:layout   # after generate
```

The messages of each language are in `i18n/locales`; a test fails when a language lacks a message of en-US or
changes its placeholders. Each release of Catch3 is a file in `content/releases`. The hero animation is
`app/components/HeroField.vue`, drawn on a canvas.

`npm run test:layout` serves `.output/public` locally with Python's `http.server` and opens every page of the sitemap, and the download page of
each system, in Chromium at 360, 390, 768 and 1280 pixels; catch3.uk resolves to that local server. It fails when
anything reaches past the edge of the screen, the header takes more than one line, a control is smaller than 24 by
24 pixels, or the phone menu opens outside the screen. CI runs it after `generate`.

## Licence

[AGPL-3.0-or-later](LICENSE.txt). Progmasoft's own code is also covered by the
[Progmasoft Patent Grant 1.1](PATENTS.md). Participation follows the [Code of Conduct](CODE_OF_CONDUCT.md).

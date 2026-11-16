<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

# catch3.uk

The site of [Catch3](https://github.com/Progmasoft/catch3), the C++17 test framework that keeps Catch2's way of
writing tests and adds property testing, snapshots and a runner of its own, at [catch3.uk](https://catch3.uk/).
It is built with Nuxt 4, Nuxt Content and Nuxt i18n, in English, German, Russian and French.

## What it serves

| Address | What |
| --- | --- |
| `catch3.uk/` | the home page |
| `catch3.uk/download` | sends the visitor to the download page of their operating system |
| `catch3.uk/download?os=linux`, `?os=macos`, `?os=windows` | how to install Catch3 on that system |
| `catch3.uk/releases/` | every release with its notes and files |
| `storage.catch3.uk/<version>/…` | the installers of each release |
| `survey.catch3.uk` | the user survey, a Nitro server of its own |

## Installing Catch3

| System | From | Requires |
| --- | --- | --- |
| Linux | the Linux package repositories of Progmasoft | glibc 2.28 or later, libstdc++ with `GLIBCXX_3.4.34` or later |
| macOS | `storage.catch3.uk/<version>/darwin-x86_64/Catch3-<version>-x86_64.dmg`, `storage.catch3.uk/<version>/darwin-arm64/Catch3-<version>-arm64.dmg` | macOS 13 or later |
| Windows | `storage.catch3.uk/<version>/windows-x64/Catch3-<version>-x64.exe`, `storage.catch3.uk/<version>/windows-arm64/Catch3-<version>-ARM64.exe` | Windows 10 or later, 64-bit |

The Windows installer installs for the current user, or for every user of the machine when that is chosen.

## Licence

[AGPL-3.0-or-later](LICENSE.txt). Progmasoft's own code is also covered by the
[Progmasoft Patent Grant 1.1](PATENTS.md). Participation follows the [Code of Conduct](CODE_OF_CONDUCT.md).

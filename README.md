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

Catch3 is the library and the `catch3` command, which runs test binaries, reads their results and reports them,
and imports the results of other test frameworks. The command links the C++ standard library statically.

| System | With | Requires |
| --- | --- | --- |
| Linux | the Linux package repositories of Progmasoft | glibc 2.28 or later |
| macOS | `install.zsh` | macOS 13 or later |
| Windows | `Install-Catch3.ps1` (PowerShell 7) or `install.cmd` | Windows 10 or later, 64-bit |

A script downloads the archive of its system and processor with curl, extracts it into a temporary directory and
installs from there. Without arguments it installs for the current user.

| | `install.zsh` | `Install-Catch3.ps1` | `install.cmd` |
| --- | --- | --- | --- |
| for every user | `-g` | `-Global` | `/global` |
| language of the messages | `-l en-us`, `de-de`, `ru-ru`, `fr-fr` | `-Language EnUs`, `DeDe`, `RuRu`, `FrFr` | `/langenus` or `/lang:enus`, and `dede`, `ruru`, `frfr` |
| help | `-h` | `-Help` | `/?`, `/HELP` |
| upper and lower case | told apart | not told apart | told apart, but `/HELP` in any case |

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

Each archive has its SHA-256, its BLAKE3 and its CycloneDX SBOM beside it.

## Licence

[AGPL-3.0-or-later](LICENSE.txt). Progmasoft's own code is also covered by the
[Progmasoft Patent Grant 1.1](PATENTS.md). Participation follows the [Code of Conduct](CODE_OF_CONDUCT.md).

<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<script setup lang="ts">
// /download picks the visitor's system and moves to /download?os=<system>; ?os=linux, ?os=macos
// and ?os=windows are the pages of each system. The generated page has no query, so the page of a
// system appears once the page has started in the browser; before that, and without a script, it
// shows the three systems to choose from.
import {
  computed,
  onMounted,
  ref,
  useI18n,
  useLocalePath,
  useRoute,
  useRouter,
  useSeoMeta,
} from "#imports";
import { useReleases } from "~/composables/useReleases";
import { detectSystem, isSystem, systems, type System } from "~/utils/site";
import { majorMinor, sourceFiles } from "~/utils/releases";

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const router = useRouter();
const { data: releases } = await useReleases();
const latest = computed(() => releases.value?.[0]);

useSeoMeta({
  title: () => `${t("download.title")} · Catch3`,
  description: () => t("download.description"),
});

const started = ref(false);
const system = computed<System | undefined>(() =>
  started.value && isSystem(route.query.os) ? route.query.os : undefined,
);

onMounted(() => {
  started.value = true;
  if (isSystem(route.query.os)) return;
  const agent = navigator as Navigator & { userAgentData?: { platform?: string } };
  const found = detectSystem(agent.userAgentData?.platform, navigator.userAgent);
  if (found) void router.replace({ query: { ...route.query, os: found } });
});

const storage = "https://storage.catch3.uk/<version>";

const repositories = [
  { host: "apt.progmasoft.com", manager: "APT", systems: "Debian, Ubuntu" },
  { host: "dnf.progmasoft.com", manager: "DNF", systems: "Fedora, RHEL, AlmaLinux, Rocky Linux" },
  { host: "zypp.progmasoft.com", manager: "Zypper", systems: "openSUSE, SUSE Linux Enterprise" },
  { host: "pacman.progmasoft.com", manager: "pacman", systems: "Arch Linux" },
  { host: "nix.progmasoft.com/flakes", manager: "Nix", systems: "NixOS, Nix: flakes (Git)" },
  { host: "nix.progmasoft.com/cache", manager: "Nix", systems: "NixOS, Nix: binary cache" },
];

const options = {
  macos: [
    ["-g", "optionGlobal"],
    ["-l en-us|de-de|ru-ru|fr-fr", "optionLanguage"],
    ["-h", "optionHelp"],
  ],
  windows: [
    ["-Global", "optionGlobal"],
    ["-Language EnUs|DeDe|RuRu|FrFr", "optionLanguage"],
    ["-Help", "optionHelp"],
    ["/global", "optionGlobal"],
    ["/lang:enus|dede|ruru|frfr", "optionLanguage"],
    ["/langenus|langdede|langruru|langfrfr", "optionLanguage"],
    ["/? /HELP", "optionHelp"],
  ],
} as const;
</script>

<template>
  <section class="section-tight">
    <div class="shell">
      <h1>{{ t("download.title") }}</h1>
      <p class="lede">{{ t("download.lede") }}</p>

      <nav class="systems" :aria-label="t('download.title')">
        <NuxtLink
          v-for="item in systems"
          :key="item"
          :to="{ query: { os: item } }"
          class="system"
          :aria-current="item === system ? 'page' : undefined"
          >{{ t(`download.systems.${item}`) }}</NuxtLink
        >
      </nav>

      <p v-if="latest" class="note">{{ t("download.notice", { version: latest.version }) }}</p>
    </div>
  </section>

  <section v-if="system" class="section-tight system-page">
    <div class="shell stack">
      <div>
        <h2>{{ t(`download.systems.${system}`) }}</h2>
        <p class="lede">{{ t(`download.requirements.${system}`) }}</p>
      </div>

      <div class="card">
        <h3>{{ t("download.commandTitle") }}</h3>
        <p>{{ t("download.commandText") }}</p>
      </div>

      <template v-if="system === 'linux'">
        <div>
          <h3>{{ t("download.repositoriesTitle") }}</h3>
          <p>{{ t("download.repositoriesText") }}</p>
          <div class="table-wrap">
            <table class="stacked">
              <tbody>
                <tr v-for="repository in repositories" :key="repository.host">
                  <td>
                    <code>{{ repository.host }}</code>
                  </td>
                  <td>{{ repository.manager }}</td>
                  <td>{{ repository.systems }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <template v-else>
        <div>
          <h3>{{ t("download.scriptTitle") }}</h3>
          <template v-if="system === 'macos'">
            <p>{{ t("download.macosRun") }}</p>
            <pre class="code" dir="ltr"><code>curl -fsSLO {{ storage }}/darwin/install.zsh
zsh install.zsh</code></pre>
          </template>
          <template v-else>
            <p>{{ t("download.windowsPowerShell") }}</p>
            <pre
              class="code"
              dir="ltr"
            ><code>Invoke-WebRequest {{ storage }}/windows/Install-Catch3.ps1 -OutFile Install-Catch3.ps1
./Install-Catch3.ps1</code></pre>
            <p>{{ t("download.windowsCmd") }}</p>
            <pre class="code" dir="ltr"><code>curl -fsSLO {{ storage }}/windows/install.cmd
install.cmd</code></pre>
          </template>
        </div>

        <div>
          <h3>{{ t("download.optionsTitle") }}</h3>
          <p>{{ t("download.optionUser") }}</p>
          <div class="table-wrap">
            <table class="stacked">
              <thead>
                <tr>
                  <th scope="col">{{ t("download.option") }}</th>
                  <th scope="col">{{ t("download.effect") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="[option, effect] in options[system]" :key="option">
                  <td dir="ltr">
                    <code>{{ option }}</code>
                  </td>
                  <td>{{ t(`download.${effect}`) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="system === 'macos'" class="small">{{ t("download.caseZsh") }}</p>
          <template v-else>
            <p class="small">{{ t("download.casePowerShell") }}</p>
            <p class="small">{{ t("download.caseCmd") }}</p>
          </template>
        </div>

        <p>{{ t("download.verify") }}</p>
      </template>
    </div>
  </section>

  <section class="section-tight library">
    <div class="shell stack">
      <div>
        <h2>{{ t("download.libraryTitle") }}</h2>
        <p class="lede">{{ t("download.libraryText") }}</p>
      </div>
      <pre
        v-if="latest"
        class="code"
        dir="ltr"
      ><code>find_package(Catch3 {{ majorMinor(latest.version) }} CONFIG REQUIRED)
target_link_libraries(MyTests PRIVATE Catch3::Catch3WithMain)</code></pre>
      <div v-if="latest" class="actions">
        <a class="button button-primary" :href="sourceFiles(latest.version)[0]?.url" download>{{
          t("download.sourceArchive", { version: latest.version })
        }}</a>
        <NuxtLink class="button button-secondary" :to="localePath('/releases/')">{{
          t("download.allFiles")
        }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.systems {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 36px 0 28px;
  padding: 6px;
  border-radius: 999px;
  background: var(--surface);
}

.system {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 22px;
  border-radius: 999px;
  color: var(--ink-soft);
  font-weight: 600;
  text-decoration: none;
}

.system:hover {
  color: var(--ink);
}

.system[aria-current="page"] {
  background: var(--ground);
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
  color: var(--ink);
}

.stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 36px;
}

.stack h3 + p,
.stack p + .code,
.stack .code + p {
  margin-top: 12px;
}

.stack p {
  margin: 0 0 12px;
}

.stack .lede {
  margin-top: 12px;
}

.small {
  margin-top: 12px;
  color: var(--ink-faint);
  font-size: 0.95rem;
}

.system-page {
  padding-top: 0;
}

.library {
  border-top: 1px solid var(--line);
}

@media (width <= 640px) {
  .systems {
    display: flex;
  }

  .system {
    flex: 1 1 0;
    justify-content: center;
    padding: 0 12px;
  }
}
</style>

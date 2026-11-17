<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<script setup lang="ts">
// Every release with its notes and files, newest first: the library's source archives, and the
// archives of the catch3 command for each system once a release has it. A release is a row that
// opens, with the anchor #v<version>; the newest is open, and so is the one the address names.
// ?view=command shows the command; without a script the page shows the library.
import {
  releaseAnchor,
  commandFiles,
  installerUrls,
  sourceFiles,
  type ReleaseFile,
} from "~/utils/releases";

const { t, locale, locales } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const { data: releases } = await useReleases();
const { data: notes } = await useReleaseNotes();
const notesOf = (version: string) => notes.value?.find((release) => release.version === version);

useSeoMeta({
  title: () => `${t("releases.title")} · Catch3`,
  description: () => t("releases.description"),
});

const started = ref(false);
onMounted(async () => {
  started.value = true;
  // The row the address names opens, and the page goes to it; after the update that the start of
  // the page causes, which would otherwise close it again.
  await nextTick();
  requestAnimationFrame(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    const row = id ? document.getElementById(id) : null;
    if (row instanceof HTMLDetailsElement) {
      row.open = true;
      row.scrollIntoView();
    }
  });
});
const view = computed(() =>
  started.value && route.query.view === "command" ? "command" : "library",
);
const withCommand = computed(() => (releases.value ?? []).filter((release) => release.command));

const language = computed(
  () => locales.value.find((item) => item.code === locale.value)?.language ?? "en-US",
);
function day(date: string) {
  return new Intl.DateTimeFormat(language.value, { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}
function fileName(file: ReleaseFile) {
  return file.url.slice(file.url.lastIndexOf("/") + 1);
}
</script>

<template>
  <section class="section-tight">
    <div class="shell">
      <div class="top">
        <div>
          <h1>
            Catch3<br />
            {{ t("releases.title") }}
          </h1>
          <p class="lede">{{ t("releases.lede") }}</p>
        </div>
      </div>

      <nav class="tabs" :aria-label="t('releases.title')">
        <NuxtLink
          :to="{ query: {} }"
          class="tab"
          :aria-current="view === 'library' ? 'page' : undefined"
          >{{ t("releases.library") }}</NuxtLink
        >
        <NuxtLink
          :to="{ query: { view: 'command' } }"
          class="tab"
          :aria-current="view === 'command' ? 'page' : undefined"
          >{{ t("releases.command") }}</NuxtLink
        >
      </nav>

      <div v-if="view === 'library'" class="rows">
        <details
          v-for="(release, index) in releases"
          :key="release.version"
          :id="releaseAnchor(release.version)"
          class="row"
          :open="index === 0"
        >
          <summary>
            <span class="label">{{ t("releases.version") }}</span>
            <span class="version">{{ release.version }}</span>
            <span v-if="index === 0" class="latest">{{ t("releases.latest") }}</span>
            <time class="date" :datetime="release.date">{{ day(release.date) }}</time>
            <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div class="body">
            <div class="column notes" lang="en">
              <ContentRenderer v-if="notesOf(release.version)" :value="notesOf(release.version)!" />
            </div>
            <div class="column">
              <h3>{{ t("releases.source") }}</h3>
              <ul class="files">
                <li v-for="file in sourceFiles(release.version)" :key="file.url">
                  <a :href="file.url" class="file" download>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" />
                    </svg>
                    {{ t(`releases.files.${file.label}`) }}
                  </a>
                  <span class="sums">
                    <a :href="file.sha256" :aria-label="`SHA-256 · ${fileName(file)}`">SHA-256</a>
                    <a :href="file.blake3" :aria-label="`BLAKE3 · ${fileName(file)}`">BLAKE3</a>
                    <a :href="file.sbom" :aria-label="`CycloneDX · ${fileName(file)}`">CycloneDX</a>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </details>
      </div>

      <div v-else class="rows">
        <p v-if="withCommand.length === 0" class="note">{{ t("releases.noCommand") }}</p>
        <details
          v-for="(release, index) in withCommand"
          :key="release.version"
          class="row"
          :open="index === 0"
        >
          <summary>
            <span class="label">{{ t("releases.version") }}</span>
            <span class="version">{{ release.version }}</span>
            <time class="date" :datetime="release.date">{{ day(release.date) }}</time>
            <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div class="body systems">
            <div v-for="system in ['macos', 'windows'] as const" :key="system" class="column">
              <h3>{{ t(`download.systems.${system}`) }}</h3>
              <ul class="files">
                <li v-for="file in commandFiles(release.version)[system]" :key="file.url">
                  <a :href="file.url" class="file" download>{{
                    t(`releases.files.${file.label}`)
                  }}</a>
                  <span class="sums">
                    <a :href="file.sha256">SHA-256</a>
                    <a :href="file.blake3">BLAKE3</a>
                    <a :href="file.sbom">CycloneDX</a>
                  </span>
                </li>
                <li v-if="system === 'macos'">
                  <a :href="installerUrls(release.version).zsh" class="file">install.zsh</a>
                </li>
                <template v-else>
                  <li>
                    <a :href="installerUrls(release.version).powershell" class="file"
                      >Install-Catch3.ps1</a
                    >
                  </li>
                  <li>
                    <a :href="installerUrls(release.version).cmd" class="file">install.cmd</a>
                  </li>
                </template>
              </ul>
            </div>
            <div class="column">
              <h3>{{ t("download.systems.linux") }}</h3>
              <NuxtLink :to="localePath('/download') + '?os=linux'" class="file">{{
                t("releases.linuxRepositories")
              }}</NuxtLink>
            </div>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.tabs {
  display: flex;
  gap: 32px;
  margin-top: 72px;
  border-bottom: 1px solid var(--line);
}

.tab {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  margin-bottom: -1px;
  border-bottom: 2px solid transparent;
  color: var(--ink-faint);
  font-size: 1.15rem;
  font-weight: 500;
  text-decoration: none;
}

.tab:hover {
  color: var(--ink);
}

.tab[aria-current="page"] {
  border-bottom-color: var(--ink);
  color: var(--ink);
}

.rows {
  margin-top: 40px;
}

.row {
  border-bottom: 1px solid var(--line);
}

.row:first-child {
  border-top: 1px solid var(--line);
}

summary {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 64px;
  cursor: pointer;
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

.label {
  width: 112px;
  color: var(--ink-faint);
}

.version {
  font-weight: 600;
}

.latest {
  padding: 3px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--green) 16%, var(--ground));
  color: var(--green);
  font-size: 0.8rem;
  font-weight: 700;
}

.date {
  margin-inline-start: auto;
  color: var(--ink-faint);
  font-size: 0.95rem;
}

.chevron {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  transition: transform 0.15s;
}

.row[open] .chevron {
  transform: rotate(180deg);
}

.body {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  padding-bottom: 28px;
}

.body.systems {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.column {
  padding: 4px 24px;
  border-inline-start: 1px solid var(--line);
}

.column:first-child {
  padding-inline-start: 128px;
  border-inline-start: 0;
}

.column h3 {
  margin-bottom: 14px;
  font-size: 1.05rem;
}

.notes {
  color: var(--ink-soft);
  overflow-wrap: anywhere;
}

.notes :deep(h3) {
  margin: 22px 0 8px;
  color: var(--ink);
  font-size: 1.05rem;
}

.notes :deep(:first-child) {
  margin-top: 0;
}

.notes :deep(p) {
  margin: 0 0 12px;
}

.notes :deep(ul) {
  margin: 0 0 12px;
  padding-inline-start: 20px;
}

.notes :deep(li + li) {
  margin-top: 6px;
}

.notes :deep(a) {
  color: var(--red-ink);
}

/* Headings of the notes carry an anchor link of their own; they read as headings. */
.notes :deep(h3 a) {
  color: inherit;
  text-decoration: none;
}

.notes :deep(pre) {
  overflow-x: auto;
  border-radius: var(--radius-small);
  padding: 14px 16px;
  background: var(--code-ground);
  color: var(--code-ink);
  font-size: 0.86rem;
}

.notes :deep(pre code) {
  padding: 0;
  background: none;
}

.row {
  scroll-margin-top: 84px;
}

.files {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.file {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 32px;
  color: var(--ink);
  text-decoration: none;
}

.file:hover {
  text-decoration: underline;
}

.file svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sums {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  padding-inline-start: 28px;
  font-size: 0.85rem;
}

.sums a {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  color: var(--ink-faint);
}

.note {
  margin-top: 0;
}

@media (width <= 760px) {
  .tabs {
    gap: 20px;
    margin-top: 40px;
  }

  .label {
    width: auto;
  }

  .date {
    display: none;
  }

  .body,
  .body.systems {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }

  .column,
  .column:first-child {
    padding: 0;
    border: 0;
  }
}
</style>

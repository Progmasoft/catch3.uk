<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<script setup lang="ts">
import { releaseUrl } from "~/utils/releases";

const { t, locale, locales } = useI18n();
const { data: releases } = await useReleases();

useSeoMeta({
  title: () => `${t("releases.title")} · Catch3`,
  description: () => t("releases.description"),
});

const language = computed(
  () => locales.value.find((item) => item.code === locale.value)?.language ?? "en-US",
);
function day(date: string) {
  return new Intl.DateTimeFormat(language.value, { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}
</script>

<template>
  <section class="section-tight">
    <div class="shell">
      <h1>{{ t("releases.title") }}</h1>
      <p class="lede">{{ t("releases.lede") }}</p>
      <p class="small">{{ t("releases.summaryLanguage") }}</p>

      <ol class="list">
        <li v-for="(release, index) in releases" :key="release.version" class="card">
          <div class="top">
            <h2>Catch3 {{ release.version }}</h2>
            <span v-if="index === 0" class="latest">{{ t("releases.latest") }}</span>
          </div>
          <p class="date">
            <time :datetime="release.date">{{ day(release.date) }}</time>
          </p>
          <p lang="en">{{ release.summary }}</p>
          <a :href="releaseUrl(release)">{{ t("releases.notes") }}</a>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.small {
  margin: 12px 0 0;
  color: var(--ink-faint);
  font-size: 0.95rem;
}

.list {
  display: grid;
  gap: 16px;
  margin: 48px 0 0;
  padding: 0;
  list-style: none;
}

.top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
}

.top h2 {
  font-size: 1.6rem;
}

.latest {
  padding: 4px 12px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--green) 16%, var(--ground));
  color: var(--green);
  font-size: 0.85rem;
  font-weight: 700;
}

.date {
  margin: 6px 0 0;
  color: var(--ink-faint);
  font-size: 0.95rem;
}

.card p:not(.date) {
  margin: 14px 0 0;
  color: var(--ink-soft);
}

.card a {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  margin-top: 10px;
  color: var(--red-ink);
  font-weight: 600;
}
</style>

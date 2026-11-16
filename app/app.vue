<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<script setup lang="ts">
// Each page sets its title and description; this adds the language, the canonical address and
// the address of the page in every other language.
const { t } = useI18n();
const head = useLocaleHead({ seo: true });
useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs?.lang, dir: "ltr" },
  link: head.value.link ?? [],
  meta: head.value.meta ?? [],
  titleTemplate: (title) => title ?? "Catch3",
}));
</script>

<template>
  <a class="skip" href="#main">{{ t("nav.skip") }}</a>
  <SiteHeader />
  <main id="main">
    <NuxtPage />
  </main>
  <SiteFooter />
</template>

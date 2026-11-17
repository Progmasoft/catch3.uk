<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<script setup lang="ts">
// The page of an address the site has none for (404), and of any other error: the header and the
// footer of the site around the status, one sentence and the way back, on a field of dots like the
// spheres of the home page. nginx serves the generated /404.html for every unknown address.
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const { t } = useI18n();
const localePath = useLocalePath();

const notFound = computed(() => props.error.statusCode === 404);
useHead(() => ({
  title: `${notFound.value ? t("error.notFoundTitle") : t("error.otherTitle")} · Catch3`,
  meta: [{ name: "robots", content: "noindex" }],
}));
</script>

<template>
  <a class="skip" href="#main">{{ t("nav.skip") }}</a>
  <SiteHeader />
  <main id="main" class="lost">
    <div class="shell inner">
      <p class="status" aria-hidden="true">{{ error.statusCode }}</p>
      <h1>{{ notFound ? t("error.notFoundTitle") : t("error.otherTitle") }}</h1>
      <p class="lede">{{ notFound ? t("error.notFoundText") : t("error.otherText") }}</p>
      <div class="actions">
        <a class="button button-primary" :href="localePath('/')">{{ t("error.home") }}</a>
        <a class="button button-secondary" :href="localePath('/releases/')">{{
          t("error.releases")
        }}</a>
      </div>
    </div>
  </main>
  <SiteFooter />
</template>

<style scoped>
.lost {
  display: grid;
  align-items: center;
  min-height: 72vh;
  padding-block: 96px;
  background-image:
    radial-gradient(circle, color-mix(in srgb, var(--ink) 34%, transparent) 1px, transparent 1.5px),
    radial-gradient(
      circle,
      color-mix(in srgb, var(--green) 45%, transparent) 1.2px,
      transparent 1.8px
    );
  background-position:
    0 0,
    37px 23px;
  background-size:
    46px 46px,
    97px 89px;
  text-align: center;
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.status {
  margin: 0;
  background: linear-gradient(120deg, var(--ink) 20%, var(--red) 75%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: clamp(5rem, 14vw, 9rem);
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 1;
}

h1 {
  margin-top: 18px;
  font-size: clamp(2.2rem, 6vw, 4.2rem);
}

.lede {
  margin-inline: auto;
}

.actions {
  justify-content: center;
  margin-top: 32px;
}
</style>

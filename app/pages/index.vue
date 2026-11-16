<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<script setup lang="ts">
import { docs } from "~/utils/site";

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t("home.title"),
  description: () => t("home.description"),
  ogTitle: () => t("home.title"),
  ogDescription: () => t("home.description"),
});

const features = ["authoring", "runner", "history", "properties", "mocks", "snapshots"] as const;
const builds = ["Bazel", "CMake", "Meson", "Xmake", "Premake"];
</script>

<template>
  <section class="hero">
    <div class="shell intro">
      <p class="eyebrow">{{ t("home.eyebrow") }}</p>
      <h1>{{ t("home.headline") }}</h1>
      <p class="lede">{{ t("home.lede") }}</p>
      <div class="actions">
        <NuxtLink class="button button-primary" :to="localePath('/download')">{{
          t("home.download")
        }}</NuxtLink>
        <a class="button button-secondary" :href="docs">{{ t("home.docs") }}</a>
      </div>
    </div>
    <div class="shell">
      <HeroField :label="t('home.field')" />
    </div>
  </section>

  <section id="features" class="section">
    <div class="shell">
      <div class="heading">
        <h2>{{ t("home.featuresTitle") }}</h2>
        <p>{{ t("home.featuresLede") }}</p>
      </div>
      <div class="grid-3">
        <article v-for="feature in features" :key="feature" class="card">
          <h3>{{ t(`home.features.${feature}.title`) }}</h3>
          <p>{{ t(`home.features.${feature}.text`) }}</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section example">
    <div class="shell split">
      <div>
        <h2>{{ t("home.exampleTitle") }}</h2>
        <p class="lede">{{ t("home.exampleText") }}</p>
      </div>
      <pre
        class="code"
        dir="ltr"
      ><code><span class="keyword">#include</span> <span class="string">&lt;Progmasoft/Catch3.hpp&gt;</span>

TEST_CASE(<span class="string">"integers stay in their domain"</span>, <span class="string">"[property]"</span>) {
    CATCH3_CHECK_PROPERTY(
        Progmasoft::Catch3::Integer&lt;<span class="keyword">int</span>&gt;(1, 100),
        [](<span class="keyword">int</span> value) { <span class="keyword">return</span> value &gt; 0; },
        Progmasoft::Catch3::PropertyOptions{
            .Trials = 250,
            .Seed = 0xC0FFEE,
            .MaxShrinkSteps = 200});
}</code></pre>
    </div>
  </section>

  <section class="section-tight">
    <div class="shell grid-2">
      <article class="card">
        <h3>{{ t("home.buildsTitle") }}</h3>
        <p>{{ t("home.buildsText") }}</p>
        <ul class="chips" dir="ltr">
          <li v-for="build in builds" :key="build">{{ build }}</li>
        </ul>
      </article>
      <article class="card">
        <h3>{{ t("home.licenseTitle") }}</h3>
        <p>{{ t("home.licenseText") }}</p>
      </article>
    </div>
  </section>

  <section class="section cta">
    <div class="shell">
      <h2>{{ t("home.ctaTitle") }}</h2>
      <p class="lede">{{ t("home.ctaText") }}</p>
      <div class="actions">
        <NuxtLink class="button button-primary" :to="localePath('/download')">{{
          t("home.download")
        }}</NuxtLink>
        <NuxtLink class="button button-secondary" :to="localePath('/releases/')">{{
          t("home.releases")
        }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-block: 96px 24px;
}

.intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 64px;
  text-align: center;
}

.intro h1 {
  max-width: 980px;
}

.intro .lede {
  margin-inline: auto;
}

.intro .actions {
  justify-content: center;
  margin-top: 36px;
}

.split {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 56px;
  align-items: center;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.chips li {
  padding: 6px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--ground);
  font-size: 0.92rem;
  font-weight: 500;
}

.cta {
  text-align: center;
}

.cta .lede {
  margin-inline: auto;
}

.cta .actions {
  justify-content: center;
  margin-top: 32px;
}

@media (width <= 960px) {
  .split {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }
}

@media (width <= 640px) {
  .hero {
    padding-block: 56px 8px;
  }

  .intro {
    align-items: stretch;
    margin-bottom: 40px;
    text-align: start;
  }

  .intro .lede {
    margin-inline: 0;
  }

  .intro .actions {
    justify-content: stretch;
    margin-top: 28px;
  }
}
</style>

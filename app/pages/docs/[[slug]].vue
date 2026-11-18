<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<script setup lang="ts">
// One document of Catch3: /docs/ is the index of the documentation (docs/Readme.md), and
// /docs/<name>/ a document of the docs folder of Catch3's source. The text is in English, as in
// the repository; the page around it is in the visitor's language and links the document's source.
import {
  computed,
  createError,
  queryCollection,
  useAsyncData,
  useI18n,
  useLocalePath,
  useRoute,
  useSeoMeta,
} from "#imports";
import { docsSource } from "~/utils/docs";

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const slug = computed(() => String(route.params.slug ?? ""));

const { data: doc } = await useAsyncData(`doc-${slug.value}`, () =>
  queryCollection("docs").where("slug", "=", slug.value).first(),
);
if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: "Not Found", fatal: true });
}

useSeoMeta({
  title: () => `${doc.value?.title ?? t("nav.docs")} · Catch3`,
  description: () => doc.value?.description || t("docs.description"),
});
</script>

<template>
  <section class="section-tight">
    <div class="shell page">
      <nav v-if="slug" class="crumbs" :aria-label="t('nav.docs')">
        <NuxtLink :to="localePath('/docs/')">{{ t("nav.docs") }}</NuxtLink>
      </nav>
      <article v-if="doc" class="text" lang="en">
        <ContentRenderer :value="doc" />
      </article>
      <p v-if="doc" class="source">
        <a :href="docsSource + doc.source">{{ t("docs.source") }}</a>
        <a :href="docsSource + 'LICENSES/README.md'">{{ t("docs.license") }}</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.page {
  max-width: 860px;
}

.crumbs {
  margin-bottom: 18px;
  font-size: 0.95rem;
}

.crumbs a,
.source a {
  display: inline-block;
  min-height: 24px;
  line-height: 24px;
  color: var(--red-ink);
}

.text {
  color: var(--ink-soft);
  overflow-wrap: anywhere;
  line-height: 1.65;
}

.text :deep(h1),
.text :deep(h2),
.text :deep(h3),
.text :deep(h4) {
  color: var(--ink);
  line-height: 1.25;
  scroll-margin-top: 84px;
}

.text :deep(h1) {
  margin: 0 0 20px;
  font-size: clamp(2rem, 5vw, 2.8rem);
}

.text :deep(h2) {
  margin: 40px 0 12px;
  font-size: 1.5rem;
}

.text :deep(h3) {
  margin: 28px 0 10px;
  font-size: 1.15rem;
}

.text :deep(h4) {
  margin: 22px 0 8px;
  font-size: 1rem;
}

/* Headings carry an anchor link of their own; they read as headings. */
.text :deep(:is(h1, h2, h3, h4) a) {
  color: inherit;
  text-decoration: none;
}

.text :deep(p),
.text :deep(ul),
.text :deep(ol),
.text :deep(blockquote),
.text :deep(table) {
  margin: 0 0 14px;
}

.text :deep(ul),
.text :deep(ol) {
  padding-inline-start: 22px;
}

.text :deep(li + li) {
  margin-top: 4px;
}

.text :deep(a) {
  color: var(--red-ink);
}

.text :deep(blockquote) {
  border-inline-start: 3px solid var(--line);
  padding: 4px 0 4px 16px;
}

.text :deep(table) {
  display: block;
  overflow-x: auto;
  border-collapse: collapse;
}

.text :deep(th),
.text :deep(td) {
  border: 1px solid var(--line);
  padding: 6px 10px;
  text-align: start;
  vertical-align: top;
}

.text :deep(:not(pre) > code) {
  border-radius: 6px;
  padding: 0.1em 0.35em;
  background: var(--surface-strong);
  color: var(--ink);
  font-size: 0.9em;
}

.text :deep(pre) {
  overflow-x: auto;
  margin: 0 0 16px;
  border-radius: var(--radius-small);
  padding: 14px 16px;
  background: var(--code-ground);
  color: var(--code-ink);
  font-size: 0.86rem;
  line-height: 1.5;
}

.text :deep(pre code) {
  padding: 0;
  background: none;
}

.text :deep(img) {
  max-width: 100%;
}

.source {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin: 36px 0 0;
  border-top: 1px solid var(--line);
  padding-top: 18px;
  font-size: 0.95rem;
}
</style>

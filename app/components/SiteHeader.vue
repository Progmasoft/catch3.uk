<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<script setup lang="ts">
// The header: the logo, the pages, the language and the download button (the one link to the
// download page on a wide screen). A phone keeps the logo
// and one menu that holds the rest. Both menus are <details>, so they work without a script; a
// link followed in one closes it.
import { docs, repository } from "~/utils/site";

const { t, locale, locales } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const route = useRoute();

const links = computed(() => [
  { to: localePath("/") + "#features", label: t("nav.features") },
  { to: localePath("/releases/"), label: t("nav.releases") },
]);

const languages = ref<HTMLDetailsElement>();
const menu = ref<HTMLDetailsElement>();
watch(
  () => route.fullPath,
  () => {
    if (languages.value) languages.value.open = false;
    if (menu.value) menu.value.open = false;
  },
);
</script>

<template>
  <header class="header">
    <div class="shell bar">
      <NuxtLink :to="localePath('/')" class="brand" :aria-label="'Catch3'">
        <Catch3Logo class="logo" />
      </NuxtLink>

      <nav class="links" :aria-label="t('nav.label')">
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
        <a :href="docs">{{ t("nav.docs") }}</a>
      </nav>

      <div class="tools">
        <details ref="languages" class="dropdown">
          <summary class="icon-button" :aria-label="t('nav.language')" :title="t('nav.language')">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path
                d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"
              />
            </svg>
          </summary>
          <ul>
            <li v-for="item in locales" :key="item.code">
              <NuxtLink
                :to="switchLocalePath(item.code)"
                :hreflang="item.language"
                :lang="item.language"
                :aria-current="item.code === locale ? 'true' : undefined"
                >{{ item.name }}</NuxtLink
              >
            </li>
          </ul>
        </details>
        <a
          class="icon-button source"
          :href="repository"
          :aria-label="t('nav.source')"
          :title="t('nav.source')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" class="filled">
            <path
              d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"
            />
          </svg>
        </a>
        <NuxtLink
          class="button button-primary button-small download"
          :to="localePath('/download')"
          >{{ t("nav.download") }}</NuxtLink
        >
        <details ref="menu" class="dropdown mobile">
          <summary class="icon-button" :aria-label="t('nav.menu')" :title="t('nav.menu')">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </summary>
          <ul>
            <li>
              <NuxtLink :to="localePath('/download')">{{ t("nav.download") }}</NuxtLink>
            </li>
            <li v-for="link in links" :key="link.to">
              <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
            </li>
            <li>
              <a :href="docs">{{ t("nav.docs") }}</a>
            </li>
            <li>
              <a :href="repository">{{ t("nav.source") }}</a>
            </li>
          </ul>
        </details>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid var(--line);
  background: var(--header);
  backdrop-filter: saturate(1.4) blur(14px);
}

.bar {
  display: flex;
  align-items: center;
  gap: 28px;
  min-height: 68px;
}

.brand {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--ink);
}

.logo {
  width: auto;
  height: 34px;
}

.links {
  display: flex;
  gap: 4px;
  margin-inline-end: auto;
}

.links a {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  color: var(--ink-soft);
  font-size: 0.97rem;
  font-weight: 500;
  text-decoration: none;
}

/* A link to a part of a page (#features) is never the current page. */
.links a:hover,
.links a.router-link-exact-active:not([href*="#"]) {
  background: var(--surface);
  color: var(--ink);
}

.tools {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-button {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  color: var(--ink-soft);
  cursor: pointer;
  list-style: none;
}

.icon-button::-webkit-details-marker {
  display: none;
}

.icon-button:hover {
  background: var(--surface);
  color: var(--ink);
}

.icon-button svg {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
}

.icon-button svg.filled {
  fill: currentColor;
  stroke: none;
}

.download {
  margin-inline-start: 6px;
}

.dropdown {
  position: relative;
}

.dropdown ul {
  position: absolute;
  inset-inline-end: 0;
  top: calc(100% + 8px);
  min-width: 200px;
  margin: 0;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--ground);
  box-shadow: 0 18px 50px rgb(0 0 0 / 14%);
  list-style: none;
}

.dropdown li a {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  color: var(--ink);
  text-decoration: none;
}

.dropdown li a:hover,
.dropdown li a[aria-current="true"] {
  background: var(--surface);
}

.mobile {
  display: none;
}

@media (width <= 860px) {
  .links,
  .source,
  .download {
    display: none;
  }

  .tools {
    margin-inline-start: auto;
  }

  .mobile {
    display: block;
  }
}

@media (width <= 640px) {
  .bar {
    gap: 12px;
    min-height: 60px;
  }

  .logo {
    height: 30px;
  }
}
</style>

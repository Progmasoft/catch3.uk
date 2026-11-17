<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<!-- Switches between the light and the dark theme and remembers the choice in this browser. Until
     the visitor chooses, the page follows the theme of the system. -->
<script setup lang="ts">
const { t } = useI18n();
const dark = ref(false);

function current() {
  const chosen = document.documentElement.dataset.theme;
  return chosen ? chosen === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
}

onMounted(() => {
  dark.value = current();
});

function toggle() {
  dark.value = !current();
  const theme = dark.value ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("catch3-theme", theme);
  } catch {
    // Without storage the choice lasts until the page is left.
  }
}
</script>

<template>
  <button
    type="button"
    class="icon-button theme"
    :aria-label="dark ? t('nav.toLight') : t('nav.toDark')"
    :title="dark ? t('nav.toLight') : t('nav.toDark')"
    @click="toggle"
  >
    <svg class="sun" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path
        d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"
      />
    </svg>
    <svg class="moon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  </button>
</template>

<style scoped>
/* A button of the header: no frame of its own, the same size and icon strokes as the others. */
.theme {
  border: 0;
  padding: 0;
  background: none;
  font: inherit;
}

.theme svg {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* The page starts in its theme before any script of the page runs, so the icon follows it from
   CSS: a sun on a dark page, a moon on a light one. */
.sun {
  display: none;
}

:root[data-theme="dark"] .sun {
  display: block;
}

:root[data-theme="dark"] .moon {
  display: none;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .sun {
    display: block;
  }

  :root:not([data-theme="light"]) .moon {
    display: none;
  }
}
</style>

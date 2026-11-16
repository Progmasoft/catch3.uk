<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<script setup lang="ts">
import { docs, repository, siteRepository } from "~/utils/site";

const { t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <footer class="footer">
    <div class="shell grid">
      <div class="about">
        <Catch3Logo class="logo" />
        <p>{{ t("footer.summary") }}</p>
      </div>
      <div>
        <h2>{{ t("footer.project") }}</h2>
        <ul>
          <li>
            <NuxtLink :to="localePath('/download')">{{ t("nav.download") }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/releases/')">{{ t("nav.releases") }}</NuxtLink>
          </li>
          <li>
            <a :href="docs">{{ t("nav.docs") }}</a>
          </li>
        </ul>
      </div>
      <div>
        <h2>{{ t("footer.source") }}</h2>
        <ul>
          <li><a :href="repository">GitHub</a></li>
          <li>
            <a :href="`${repository}/issues`">{{ t("footer.issues") }}</a>
          </li>
          <li>
            <a :href="siteRepository">{{ t("footer.siteSource") }}</a>
          </li>
        </ul>
      </div>
      <div>
        <h2>{{ t("footer.progmasoft") }}</h2>
        <ul>
          <li><a href="https://progmasoft.com/">progmasoft.com</a></li>
          <li><a href="https://product.progmasoft.com/catch3">product.progmasoft.com</a></li>
        </ul>
      </div>
    </div>
    <div class="shell legal">
      <p>{{ t("footer.site") }}</p>
      <p>© 2026 Progmasoft</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding-block: 64px 32px;
  border-top: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink-soft);
}

.grid {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 32px;
}

.logo {
  width: auto;
  height: 36px;
  color: var(--ink);
}

.about p {
  max-width: 300px;
  margin: 14px 0 0;
}

h2 {
  margin: 0 0 10px;
  color: var(--ink);
  font-size: 0.95rem;
  letter-spacing: 0;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Each link is a target of 32px or more. */
a {
  display: inline-block;
  padding-block: 5px;
  color: var(--ink-soft);
  text-decoration: none;
}

a:hover {
  color: var(--ink);
  text-decoration: underline;
}

.legal {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 24px;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
  color: var(--ink-faint);
  font-size: 0.9rem;
}

.legal p {
  margin: 0;
}

@media (width <= 760px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about {
    grid-column: 1 / -1;
  }
}
</style>

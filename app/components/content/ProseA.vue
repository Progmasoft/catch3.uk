<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<script setup lang="ts">
// A link in a document or in release notes. A link to a page of the site stays in the visitor's
// language; any other link leaves as written.
import { computed, useLocalePath } from "#imports";

const props = defineProps<{ href?: string; target?: string }>();
const localePath = useLocalePath();
const internal = computed(() => !!props.href && props.href.startsWith("/") && !props.href.startsWith("//"));
const to = computed(() => {
  const href = props.href ?? "";
  const hash = href.indexOf("#");
  if (hash < 0) return localePath(href);
  return localePath(href.slice(0, hash)) + href.slice(hash);
});
</script>

<template>
  <NuxtLink v-if="internal" :to="to"><slot /></NuxtLink>
  <a v-else :href="href" :target="target"><slot /></a>
</template>

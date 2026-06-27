<script setup lang="ts">
const props = defineProps<{
  link: {
    target: string,
    label: string
  }
}>();
</script>

<template>
<NuxtLink
  class="main-menu-link text-shadow--sm font-sans--base-bold"
  :to="link.target"
  @click="(event) => (event.target as HTMLElement).blur()">
  {{ link.label }}
</NuxtLink>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/atoms/main-menu-link' as *;
</style>
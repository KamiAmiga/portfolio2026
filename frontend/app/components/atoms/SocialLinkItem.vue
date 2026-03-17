<script setup lang="ts">
import type { AboutCollectionItem } from '@nuxt/content';

const props = defineProps<{
  socialLink: AboutCollectionItem["social_links"][number]
}>();
</script>

<template>
  <li class="social-link-item">
    <a 
      :href="socialLink.url"
      target="_blank"
      :aria-label="`${socialLink.name} - nouvel onglet`"
      class="social-link-item__link">
      <Icon :name="socialLink.icon_name" class="social-link-item__link__icon" />
      <div class="social-link-item__link__label">{{ socialLink.name }}</div>
    </a>
  </li>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/atoms/social-link-item' as *;
</style>
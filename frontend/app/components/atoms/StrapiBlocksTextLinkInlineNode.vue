<script setup lang="ts">
const props = defineProps<{
  url: string;
}>();
</script>

<template>
  <a :href="props.url" class="link">
    <slot />
  </a>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/atoms/link";
</style>

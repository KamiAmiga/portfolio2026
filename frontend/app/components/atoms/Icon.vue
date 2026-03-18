<script setup lang="ts">
interface Props {
  name: string,
  size?: 'sm' | 'base' | 'md' | 'lg',
  ariaLabel?: string,
}

const props = withDefaults(defineProps<Props>(), {
  size: 'base' 
})
</script>

<template>
<nuxt-icon
  :name="name"
  :class="`nuxt-icon--${size}`"
  :aria-label="ariaLabel ?? null"
  :aria-hidden="ariaLabel ? null : true"
  focusable="false" />
</template>

<style lang="scss">
@use '~/assets/styles/components/atoms/icon' as *;
</style>
<script setup lang="ts">
interface Props {
  name: string,
  size?: 'sm' | 'base' | 'md' | 'lg',
}

const props = withDefaults(defineProps<Props>(), {
  size: 'base' 
})
</script>

<template>
<nuxt-icon
  :name="name"
  :class="`nuxt-icon--${size}`" />
</template>

<style lang="scss">
@use '~/assets/styles/components/atoms/icon' as *;
</style>
<script setup lang="ts">
interface Props {
  splitting?: 'full' | 'halves' | 'thirds',
  tag?: string
}

const props = withDefaults(defineProps<Props>(), {
  splitting: 'full',
  tag: 'div'
})
</script>

<template>
<component :is="tag" class="grid" :class="`grid--${splitting}`">
  <slot></slot>
</component>
</template>

<style lang="scss">
@use '~/assets/styles/components/organisms/grid' as *;
</style>
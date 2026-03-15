<script setup lang="ts">
interface Props {
  splitting?: 'full' | 'halves' | 'thirds'
  tag?: string,
  withTopPadding?: boolean,
  withBottomPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  splitting: 'full',
  tag: 'div',
  withTopPadding: true,
  withBottomPadding: true
})
</script>

<template>
<component
  :is="tag"
  class="grid"
  :class="[
    {
      'grid--padding-top': withTopPadding,
      'grid--padding-bottom': withBottomPadding
    },
    `grid--${splitting}`
  ]">
  <slot></slot>
</component>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/organisms/grid' as *;
</style>
<script setup lang="ts">
interface Props {
  splitting?: 'full' | 'halves' | 'thirds'
  tag?: string,
  withTopPadding?: boolean,
  withBottomPadding?: boolean,
  noGap?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  splitting: 'full',
  tag: 'div',
  withTopPadding: true,
  withBottomPadding: true,
  noGap: false
})
</script>

<template>
<component
  :is="tag"
  class="grid"
  :class="[
    {
      'grid--padding-top': withTopPadding,
      'grid--padding-bottom': withBottomPadding,
      'grid--no-gap': noGap
    },
    `grid--${splitting}`
  ]">
  <slot></slot>
</component>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/organisms/grid' as *;
</style>
<script setup lang="ts">
interface Props {
  title: string
  titleTag?: 'div' | 'h1' | 'h2' | 'h3' | 'h4'
  size?: 'small' | 'full-screen'
}

const props = withDefaults(defineProps<Props>(), {
  titleTag: 'h1',
  size: 'full-screen'
})
</script>

<template>
  <header class="header" :class="`header--${size}`">
    <div class="header__background">
      <slot name="background"></slot>
    </div>
    <Grid :withTopPadding="false" :withBottomPadding="false">
      <CustomTitle :content="title" level="main" :tag="titleTag" :animSelfTrigger="true" />
    </Grid>
  </header>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/organisms/custom-header" as *;
</style>
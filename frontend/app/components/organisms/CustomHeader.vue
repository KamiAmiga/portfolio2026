<script setup lang="ts">
interface Props {
  title: string
  titleTag?: 'div' | 'h1' | 'h2' | 'h3' | 'h4'
}

const props = withDefaults(defineProps<Props>(), {
  titleTag: 'h1' 
})
</script>

<template>
  <section class="header">
    <slot name="background"></slot>
    <custom-title :content="title" level="main" :tag="titleTag" />
  </section>
</template>

<style lang="scss">
.header {
  padding-top: 50vh;
}
</style>
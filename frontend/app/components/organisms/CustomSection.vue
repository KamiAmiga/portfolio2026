<script setup lang="ts">
interface Props {
  title: string
  titleTag?: 'div' | 'h1' | 'h2' | 'h3' | 'h4'
}

const props = withDefaults(defineProps<Props>(), {
  titleTag: 'h2' 
})
</script>

<template>
  <section>
    <custom-title :content="title" level="second" :tag="titleTag" />
    <slot name="content"></slot>
  </section>
</template>
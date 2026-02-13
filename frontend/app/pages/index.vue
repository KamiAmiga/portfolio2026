<script lang="ts" setup>
definePageMeta({
  layout: 'no-smooth-scroll',
})

const { data: homeData } = await useAsyncData(() => queryCollection('home').first())

if (!homeData.value) {
  throw createError({
    status: 404,
    statusText: 'Page Not Found',
  })
}

const seoMeta = homeData?.value?.seo

if (seoMeta) {  
  useSeoMeta({
    title: seoMeta.metaTitle,
    description: seoMeta.metaDescription,
    ogTitle: seoMeta.metaTitle ?? '',
    ogDescription: seoMeta.metaDescription ?? '',
  })
}
</script>

<template>
  <template v-if="homeData">
    {{ homeData.title }}
  </template>
</template>

<style lang="scss">
</style>
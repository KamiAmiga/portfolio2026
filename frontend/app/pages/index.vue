<script lang="ts" setup>
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
    ogImage: seoMeta.metaImage.data?.attributes?.url ? `https://www.cgicquel.fr${seoMeta.metaImage.data.attributes.url}`:'',
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
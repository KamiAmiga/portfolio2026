<script setup lang="ts">
const { data: aboutData } = await useAsyncData('about', () => queryCollection('about').first())

if (!aboutData.value) {
  throw createError({
    status: 404,
    statusText: `Oups, cette page n'existe pas !`,
  })
}

const seoMeta = aboutData?.value?.seo

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
  <AboutPageTemplate v-if="aboutData" :data="aboutData"/>
</template>
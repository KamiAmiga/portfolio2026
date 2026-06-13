<script setup lang="ts">
const { data: aboutData } = await useAsyncData('about', () => queryCollection('about').first())

if (!aboutData.value) {
  throw createError({
    status: 404,
    statusText: `Oups, cette page n'existe pas !`,
  })
}

useSeoFromPageData(aboutData?.value?.seo)
</script>

<template>
  <AboutPageTemplate v-if="aboutData" :data="aboutData"/>
</template>
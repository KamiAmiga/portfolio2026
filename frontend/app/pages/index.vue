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
  <div v-if="homeData">
    <Grid splitting="full" class="title-wrapper">
      <h1 class="title">
        <div class="title__small font-sans--md-capitalized">{{ homeData.title }}</div>
        <div class="title__large font-sans--2xl">
          {{ homeData.subtitle }}</div>
      </h1>
    </Grid>

    <div class="illustration">
      <div class="illustration__cityscape">
        <div class="illustration__cityscape__shape illustration__cityscape__shape--back-1" />
        <div class="illustration__cityscape__shape illustration__cityscape__shape--back-2" />
        <div class="illustration__cityscape__shape illustration__cityscape__shape--back-3" />
        <div class="illustration__cityscape__shape illustration__cityscape__shape--back-4" />
        <div class="illustration__cityscape__shape illustration__cityscape__shape--back-5" />
        <div class="illustration__cityscape__shape illustration__cityscape__shape--back-6" />
      </div>

      <div class="illustration__ground">
        <div class="illustration__ground__shape"></div>
      </div>

      <div class="illustration__logo-wrapper">
        <Logo />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/pages/homepage' as *;
</style>
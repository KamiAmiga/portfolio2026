<script lang="ts" setup>
const { data: homeData } = await useAsyncData('home-data', () => queryCollection('home').first())
const { data: projectsData } = await useAsyncData(
  'home-projects-data',
  () => queryCollection('projects')
    .select('title', 'slug', 'cover_image_portrait')
    .all()
)

if (!homeData.value) {
  throw createError({
    status: 404,
    statusText: `Oups, cette page n'existe pas !`,
  })
}

definePageMeta({ layout: 'no-smooth-scroll' })


useSeoFromPageData(homeData?.value?.seo)
</script>

<template>
  <HomepageTemplate v-if="homeData" :data="homeData" :projectsData="projectsData" />
</template>
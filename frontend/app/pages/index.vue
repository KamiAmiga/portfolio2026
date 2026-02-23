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

useSeoFromPageData(homeData?.value?.seo)
</script>

<template>
  <HomepageTemplate v-if="homeData" :data="homeData" />
</template>
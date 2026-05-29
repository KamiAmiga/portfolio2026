<script setup lang="ts">
const { data: shopsData } = await useAsyncData('shops', () => queryCollection('shops').first())

if (!shopsData.value) {
  throw createError({
    status: 404,
    statusText: `Oups, cette page n'existe pas !`,
  })
}

useSeoFromPageData(shopsData?.value?.seo)
</script>

<template>
  <ShopsPageTemplate v-if="shopsData" :data="shopsData" />
</template>
<script setup lang="ts">
const props = defineProps<{ 
  id: string
}>()

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
<main role="main" :id="id">
  <ShopsPageTemplate v-if="shopsData" :data="shopsData" />
</main>
</template>
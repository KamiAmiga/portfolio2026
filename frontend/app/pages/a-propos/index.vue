<script setup lang="ts">
import transitionConfig from '../../helpers/pageTransitionConfig';

const props = defineProps<{ 
  id: string
}>()

const { data: aboutData } = await useAsyncData('about', () => queryCollection('about').first())

if (!aboutData.value) {
  throw createError({
    status: 404,
    statusText: `Oups, cette page n'existe pas !`,
  })
}

definePageMeta({ 
  pageTransition: transitionConfig
})

useSeoFromPageData(aboutData?.value?.seo)
</script>

<template>
  <main role="main" :id="id">
    <AboutPageTemplate v-if="aboutData" :data="aboutData"/>
  </main>
</template>
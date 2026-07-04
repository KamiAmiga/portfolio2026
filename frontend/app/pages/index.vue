<script lang="ts" setup>
import transitionConfig from '../helpers/pageTransitionConfig';

const props = defineProps<{ 
  id: string
}>()

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

definePageMeta({ 
  pageTransition: transitionConfig
})

useSeoFromPageData(homeData?.value?.seo)
</script>

<template >
  <main role="main" :id="id">
    <HomepageTemplate v-if="homeData" :data="homeData" :projectsData="projectsData" />
  </main>
</template>
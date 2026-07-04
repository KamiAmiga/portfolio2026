<script setup lang="ts">
import transitionConfig from '../../helpers/pageTransitionConfig';

const props = defineProps<{ 
  id: string
}>()

const { data: projectsListPageData } = await useAsyncData('projects-list-page', () => queryCollection('projectsList').first())
const { data: projectsData } = await useAsyncData(
  'projects-data',
  () => queryCollection('projects')
    .order('year', 'DESC')
    .select('title', 'slug', 'cover_image_landscape', 'cover_image_portrait')
    .all()
)

if (!projectsListPageData.value) {
  throw createError({
    status: 404,
    statusText: `Oups, cette page n'existe pas !`,
  })
}

definePageMeta({ 
  pageTransition: transitionConfig
})

useSeoFromPageData(projectsListPageData?.value?.seo)
</script>

<template>
  <main role="main" :id="id">
    <ProjectsListPageTemplate v-if="projectsListPageData" :data="projectsListPageData" :projectsData="projectsData" />
  </main>
</template>


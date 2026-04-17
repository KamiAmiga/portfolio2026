<script setup lang="ts">
const { data: projectsListPageData } = await useAsyncData('projects-list-page', () => queryCollection('projectsList').first())
const { data: projectsData } = await useAsyncData(
  'projects-data',
  () => queryCollection('projects')
    .order('year', 'DESC')
    .select('name', 'year', 'slug', 'cover_image_landscape', 'cover_image_portrait')
    .all()
)

if (!projectsListPageData.value) {
  throw createError({
    status: 404,
    statusText: 'Page Not Found',
  })
}

useSeoFromPageData(projectsListPageData?.value?.seo)
</script>

<template>
  <ProjectsListPageTemplate v-if="projectsListPageData" :data="projectsListPageData" :projectsData="projectsData" />
</template>


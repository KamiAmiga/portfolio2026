<script setup>
const route = useRoute()
const { data: projectData } = await useAsyncData(route.path, () => {
  return queryCollection('projects').path(route.path).first()
})

if (!projectData.value) {
  throw createError({
    status: 404,
    statusText: 'Page Not Found',
  })
}

const { data: surroundings } = await useAsyncData('surround', () => {
  return queryCollectionItemSurroundings(
      'projects',
      route.path,
      { 
        fields: [
          'title',
          'slug',
          'cover_image_landscape',
        ]
      }
    )
    .order('year', 'DESC')
})

useSeoFromPageData(projectData?.value?.seo)
</script>


<template>
<ProjectPageTemplate v-if="projectData" :data="projectData" :surroundings="surroundings" />
</template>
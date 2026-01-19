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
          'name',
          'cover_image_landscape',
          'cover_image_portrait'
        ]
      }
    )
    .order('year', 'DESC')
})
</script>


<template>
  <template v-if="projectData">
    <div class="test">{{ projectData.name }}</div>
    <div v-if="surroundings?.[0]">
      {{ surroundings[0]?.title }}
    </div>
    <div v-if="surroundings?.[1]">
      {{ surroundings[1]?.title }}
    </div>
  </template>
</template>

<style lang="scss">
</style>
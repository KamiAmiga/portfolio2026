<script setup lang="ts">
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
  <div v-if="projectData" class="test-rgb">
    <CustomHeader :title="projectData.name">
      <template v-slot:background>
        <CustomPicture 
          v-if="projectData.cover_image_landscape"
          :picture-data-default="projectData.cover_image_landscape"
          :picture-data-portrait="projectData.cover_image_portrait" />
      </template>
    </CustomHeader>

    <div v-if="projectData.main_images" class="test-rgb__scrollable">
      <div class="test-rgb__scrollable__container">
        <div 
          v-for="mainImage in projectData.main_images"
          :key="mainImage.id"
          class="test-rgb__img-container">
          <CustomPicture v-if="mainImage.images?.at(0)" :picture-data-default="mainImage.images[0]" />
        </div>
      </div>
    </div>

    <div v-if="surroundings?.[0]">
      {{ surroundings[0]?.title }}
    </div>
    <div v-if="surroundings?.[1]">
      {{ surroundings[1]?.title }}
    </div>
  </div>
</template>

<style lang="scss">
</style>
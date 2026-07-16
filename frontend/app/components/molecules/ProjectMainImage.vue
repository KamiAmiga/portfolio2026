<script setup lang="ts">
import { gsap } from "gsap";
import type { ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{
  images: ProjectsCollectionItem["main_images"][number]['images'];
  type: ProjectsCollectionItem["main_images"][number]['type'];
  index: number
}>()

let gridAnimTimeline: gsap.core.Timeline;

const reorderedImages = computed(() => {
  return props.images.sort((a,b) => {
    if (a.width > a.height && a.width > b.width) {
      return -1
    }

    if (a.height > a.width && a.height > b.height) {
      return 1
    }

    return 0
  })
})

const imageFormat = (index: number) => {
  if(props.images.length < 2) return 'full_grid'

  switch (props.type) {
    case 'design-print':
      return props.images.length < 2
        ? 'full_grid'
        : 'half_grid'
    case 'ui-mobile':
      return 'third_grid'
    case 'ui-mobile_desktop':
      return index === 0 
        ? 'full_grid'
        : 'third_grid'
    case 'drawing':
    case 'design-visual_id':
    case 'ui-desktop':
    default:
      return 'full_grid'
  }
}

const onGridAnimTimeline = (payload: gsap.core.Timeline) => {
  gridAnimTimeline = payload;
};

const projectMainImage = useTemplateRef('projectMainImage')
const loadAssets = useAssetsLoading(projectMainImage)

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: projectMainImage.value,
      once: true,
    },
    onStart: () => {
      gridAnimTimeline.play(0)
    }
  })

  timeline
    .from(projectMainImage.value, {
      autoAlpha: 0
    })
}, projectMainImage)
</script>

<template>  
  <div
    ref="projectMainImage"
    class="project-main-image autoalpha"
    :class="`project-main-image--${type}`">

    <GridAnimWrapper
      :index="index"
      class="autoalpha"
      @gridAnimTimeline="onGridAnimTimeline">
      <div 
        v-for="(image, nestedIndex) in reorderedImages"
        :key="image.id"
        class="project-main-image__image-wrapper">
        <CustomPicture 
          :pictureDataDefault="image"
          :loading="index < 3 ? 'eager' : loadAssets"
          :format="imageFormat(nestedIndex)"
          class="project-main-image__image" />
      </div>
    </GridAnimWrapper>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/molecules/project-main-image" as *;
</style>
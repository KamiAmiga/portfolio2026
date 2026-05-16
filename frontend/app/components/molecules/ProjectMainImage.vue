<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{
  images: ProjectsCollectionItem["main_images"][number]['images'];
  type: ProjectsCollectionItem["main_images"][number]['type'];
  index: number
}>()

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
        ? 'half_grid'
        : 'third_grid'
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

const projectMainImage = useTemplateRef('projectMainImage')
let ctx: gsap.Context;


onMounted(() => {
  if (!projectMainImage.value) return

  ctx = gsap.context((self) => {
    const timeline = gsap.timeline()

    timeline    
      .from(projectMainImage.value, {
        autoAlpha: 0
      })
      .from(self.selector?.('.project-main-image__image-wrapper'), {
        clipPath: 'inset(0 0 100% 0)',
        duration: .5,
        ease: 'circ.inOut',
        stagger: .1
      })
      .from(self.selector?.('.project-main-image__image'), {
        opacity: 0,
        clipPath: 'inset(0 0 100% 0)',
        duration: .4,
        ease: 'circ.inOut',
        stagger: .1
      }, '-=100%')
      .set(self.selector?.('.project-main-image__image-wrapper'), {
        backgroundColor: 'transparent'
      })

    ScrollTrigger.create({
      trigger: projectMainImage.value,
      once: true,
      animation: timeline,
    });
  }, projectMainImage.value)
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<template>
  <div
    ref="projectMainImage"
    class="project-main-image autoalpha"
    :class="`project-main-image--${type}`">
    <div 
      v-for="(image, index) in reorderedImages"
      :key="image.id"
      class="project-main-image__image-wrapper">
      <CustomPicture 
        :pictureDataDefault="image"
        :loading="index < 3 ? 'eager' : 'lazy'"
        :format="imageFormat(index)"
        :isCover="true"
        class="project-main-image__image" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/molecules/project-main-image" as *;
</style>
<script setup lang="ts">
import { gsap } from "gsap";
import type { ProjectsCollectionItem } from "@nuxt/content";

defineProps<{
  secondaryImgs: ProjectsCollectionItem["secondary_images"]
}>();

const projectSecondaryImages = useTemplateRef('projectSecondaryImages')
const loadAssets = useAssetsLoading(projectSecondaryImages)

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }
  
  const timeline = gsap.timeline({
    defaults: {
      stagger: .1,
      ease: 'circ.inOut'
    },
    scrollTrigger: {
      trigger: projectSecondaryImages.value,
      once: true,
    }
  })

  timeline    
    .from(projectSecondaryImages.value, {
      autoAlpha: 0
    })
    .from(context.selector?.('.project-secondary-image-wrapper'), {
      clipPath: 'inset(0 0 100% 0)',
      duration: .5,
    })
    .from(context.selector?.('.project-secondary-image'), {
      opacity: 0,
      clipPath: 'inset(0 0 100% 0)',
      duration: .4,
    }, '-=100%')
}, projectSecondaryImages)
</script>

<template>
<div ref="projectSecondaryImages" class="autoalpha">
  <Grid splitting="halves" :noGap="true">
    <div
      v-for="secondaryImg in secondaryImgs"
      :key="secondaryImg.id"
      class="project-secondary-image-wrapper">
      <CustomPicture 
        class="project-secondary-image"
        format="half_grid"
        :is-cover="true"
        :picture-data-default="secondaryImg"
        :loading="loadAssets" />
    </div>
  </Grid>
</div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/organisms/project-secondary-images" as *;
</style>
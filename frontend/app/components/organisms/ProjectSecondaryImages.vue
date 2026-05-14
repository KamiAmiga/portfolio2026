<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ProjectsCollectionItem } from "@nuxt/content";

defineProps<{
  secondaryImgs: ProjectsCollectionItem["secondary_images"]
}>();

const projectSecondaryImages = useTemplateRef('projectSecondaryImages')
let ctx: gsap.Context;

onMounted(() => {
  if (!projectSecondaryImages.value) return

  ctx = gsap.context((self) => {
    const timeline = gsap.timeline()

    timeline    
      .from(projectSecondaryImages.value, {
        autoAlpha: 0
      })
      .from(self.selector?.('.project-secondary-images__image-wrapper'), {
        clipPath: 'inset(0 0 100% 0)',
        duration: .5,
        ease: 'circ.inOut',
        stagger: .1
      })
      .from(self.selector?.('.project-secondary-images__image'), {
        opacity: 0,
        clipPath: 'inset(0 0 100% 0)',
        duration: .4,
        ease: 'circ.inOut',
        stagger: .1
      }, '-=100%')

    ScrollTrigger.create({
      trigger: projectSecondaryImages.value,
      once: false,
      animation: timeline,
    });
  }, projectSecondaryImages.value)
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<template>
<div ref="projectSecondaryImages" class="project-secondary-images">
  <Grid splitting="halves" :noGap="true">
    <div
      v-for="secondaryImg in secondaryImgs"
      :key="secondaryImg.id"
      class="project-secondary-images__image-wrapper">
      <CustomPicture 
        class="project-secondary-images__image"
        :picture-data-default="secondaryImg" />
    </div>
  </Grid>
</div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/organisms/project-secondary-images" as *;
</style>
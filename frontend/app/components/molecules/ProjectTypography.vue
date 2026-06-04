<script setup lang="ts">
import { gsap } from "gsap";
import type { ProjectsCollectionItem } from "@nuxt/content";

defineProps<{
  fonts: ProjectsCollectionItem["typography"]
}>();

const projectTypography = useTemplateRef('projectTypography')

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }
  
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: projectTypography.value,
      once: true,
    }
  })

  timeline    
    .from(projectTypography.value, {
      autoAlpha: 0
    })
    .from(context.selector?.('.project-typography__item'), {
      opacity: 0,
      clipPath: 'inset(0 100% 0 0)',
      duration: .2,
      ease: 'circ.inOut',
      stagger: .1
    })
    .from(context.selector?.('.project-typography__item__visual'), {
      opacity: 0,
      y: '100%',
      duration: .3,
      ease: 'power2.inOut',
      stagger: .1
    })
}, projectTypography)
</script>

<template>
<ul class="project-typography autoalpha" ref="projectTypography">
  <li
    v-for="font in fonts"
    :key="font.id"
    class="project-typography__item">
    <img
      :src="`${font.typo_visual?.url}`"
      :alt="font.typo_name"
      class="project-typography__item__visual"
      loading="lazy" >
  </li>
</ul>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/molecules/project-typography" as *;
</style>
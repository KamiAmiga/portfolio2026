<script setup lang="ts">
import { gsap } from "gsap";
import type { ProjectsCollectionItem } from "@nuxt/content";

defineProps<{
  colors: ProjectsCollectionItem["colors"]
}>();

const projectColors = useTemplateRef('projectColors')

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }
  
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: projectColors.value,
      once: true,
    }
  })
  
  timeline    
    .from(projectColors.value, {
      autoAlpha: 0
    })
    .from(context.selector?.('.project-colors__item__swatch'), {
      opacity: 0,
      scale: 0,
      duration: .25,
      ease: 'sine.out',
      stagger: .08
    })
    .from(context.selector?.('.project-colors__item__name'), {
      opacity: 0,
      duration: .4,
      ease: 'power2.inOut',
      stagger: .05
    }, '-=75%')
}, projectColors)
</script>

<template>
<ul class="project-colors autoalpha" ref="projectColors">
  <li
    v-for="color in colors"
    :key="color.id"
    class="project-colors__item">
    <span
      class="project-colors__item__swatch"
      :style="{ '--swatch-color': `#${color.color_code}` }" />
    <span class="project-colors__item__name">{{ color.color_name }}</span>
  </li>
</ul>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/molecules/project-colors" as *;
</style>
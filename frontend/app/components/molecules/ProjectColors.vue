<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ProjectsCollectionItem } from "@nuxt/content";

defineProps<{
  colors: ProjectsCollectionItem["colors"]
}>();

const projectColors = useTemplateRef('projectColors')
let ctx: gsap.Context;

onMounted(() => {
  if (!projectColors.value) return

  ctx = gsap.context((self) => {
    const timeline = gsap.timeline()

    timeline    
      .from(projectColors.value, {
        autoAlpha: 0
      })
      .from(self.selector?.('.project-colors__item__swatch'), {
        opacity: 0,
        scale: 0,
        duration: .25,
        ease: 'sine.out',
        stagger: .08
      })
      .from(self.selector?.('.project-colors__item__name'), {
        opacity: 0,
        duration: .4,
        ease: 'power2.inOut',
        stagger: .05
      }, '-=75%')

    ScrollTrigger.create({
      trigger: projectColors.value,
      once: true,
      animation: timeline,
    });
  }, projectColors.value)
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<template>
<ul class="project-colors" ref="projectColors">
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
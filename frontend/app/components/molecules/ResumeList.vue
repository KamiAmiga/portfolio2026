<script lang="ts" setup>
import { gsap } from "gsap";
import type { AboutCollectionItem } from '@nuxt/content';

defineProps<{
  resume: AboutCollectionItem["resume"]
}>();

const resumeList = useTemplateRef('resumeList')

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }
  
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: resumeList.value,
      once: true,
    }
  })

  timeline
    .from(resumeList.value, {
      autoAlpha: 0
    })
    .from(context.selector?.('.resume-list__link'), {
      '--focus-shape-scale': 0,
      opacity: 0,
      duration: .3,
      ease: 'power2.inOut',
      stagger: .05
    })
}, resumeList)
</script>

<template>
<ul class="resume-list" ref="resumeList">
  <li v-for="resumeItem in resume" :key="resumeItem.id">
    <a
      class="resume-list__link font-sans--base-capitalized"
      target="_blank"
      :href="resumeItem.file.url">
      {{ resumeItem.name }}
    </a>
  </li>
</ul>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/molecules/resume-list' as *;
</style>
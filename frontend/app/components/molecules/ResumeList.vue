<script lang="ts" setup>
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AboutCollectionItem } from '@nuxt/content';

const resumeList = ref()
let ctx: gsap.Context;

const props = defineProps<{
  resume: AboutCollectionItem["resume"]
}>();

onMounted(() => {
  ctx = gsap.context((self) => {
    const timeline = gsap.timeline()

    timeline    
      .from(resumeList.value, {
        autoAlpha: 0
      })
      .from(self.selector?.('.skill-item'), {
        '--focus-shape-scale': 0,
        opacity: 0,
        duration: .3,
        ease: 'power2.inOut',
        stagger: .05
      })

    ScrollTrigger.create({
      trigger: resumeList.value,
      once: true,
      animation: timeline,
    });
  }, resumeList.value)
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<template>
<ul class="resume-list" ref="resumeList">
  <li v-for="resumeItem in resume" :key="resumeItem.id">
    <a class="resume-list__link font-sans--base-capitalized" :href="resumeItem.file.url">
      {{ resumeItem.name }}
    </a>
  </li>
</ul>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/molecules/resume-list' as *;
</style>
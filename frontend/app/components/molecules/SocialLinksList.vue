<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AboutCollectionItem } from '@nuxt/content';

const props = defineProps<{
  socialLinks: AboutCollectionItem["social_links"]
}>();

const socialLinksList = ref()
let ctx: gsap.Context;

onMounted(() => {
  const initTimeline = () => {
    const timeline = gsap.timeline()

    timeline
      .from(socialLinksList.value, {
        autoAlpha: 0
      })

    return timeline
  }

  ctx = gsap.context((self) => {
    const timeline = gsap.timeline({defaults: {stagger: .1, ease: 'power2.inOut'}})

    timeline    
      .add(initTimeline())
      .from(self.selector?.('.social-link-item'), {
        opacity: 0,
        duration: .55,
      }) 
      .from(self.selector?.('.social-link-item'), {
        x: 24,
        duration: .53,
        delay: .02,
      }, '<')  

    ScrollTrigger.create({
      trigger: socialLinksList.value,
      once: true,
      animation: timeline,
    });
  }, socialLinksList.value)
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<template>
  <ul class="social-links-list" ref="socialLinksList">
    <SocialLinkItem v-for="link in socialLinks" :key="link.id" :socialLink="link" />
  </ul>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/molecules/social-links-list' as *;
</style>
<script setup lang="ts">
import { gsap } from "gsap";
import type { AboutCollectionItem } from '@nuxt/content';

const props = defineProps<{
  socialLinks: AboutCollectionItem["social_links"]
}>();

const socialLinksList = useTemplateRef('socialLinksList')

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }
  
  const timeline = gsap.timeline({
    defaults: {
      stagger: .1,
      ease: 'power2.inOut'
    },
    scrollTrigger: {
      trigger: socialLinksList.value,
      once: true,
    }
  })

  timeline    
    .from(socialLinksList.value, {
      autoAlpha: 0
    })
    .from(context.selector?.('.social-link-item'), {
      opacity: 0,
      duration: .55,
    }) 
    .from(context.selector?.('.social-link-item'), {
      x: 24,
      duration: .53,
      delay: .02,
    }, '<')
}, socialLinksList)
</script>

<template>
  <ul class="social-links-list" ref="socialLinksList">
    <SocialLinkItem v-for="link in socialLinks" :key="link.id" :socialLink="link" />
  </ul>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/molecules/social-links-list' as *;
</style>
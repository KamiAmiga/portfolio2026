<script setup lang="ts">
import { gsap } from "gsap";
import type { AboutCollectionItem } from '@nuxt/content';

const props = defineProps<{ 
  data: AboutCollectionItem,
}>()

const headerBackground = useTemplateRef('headerBackground')
const menuVisible = ref(false)

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }

  const logoWrapper = context.selector?.('.about-header__background__logo-wrapper')
  
  const timeline = gsap.timeline({
    onComplete: () => {
      menuVisible.value = true
    }
  })

  timeline
    .set(logoWrapper, {
      rotation: '+=180deg',
    })
    .from(headerBackground.value, {
      autoAlpha: 0
    })
    .to(logoWrapper, {
      keyframes: [
        {scale: 1, duration: .25, ease: "power2.in"},
        {rotation: '+=180deg', duration: .5, ease: "logoSpinEase", delay: -.2},
        {opacity: 1, duration: .4, ease: "power2.inOut", delay: -.5}
      ],
    })

}, headerBackground, false)
</script>

<template>
<CustomHeader
  title="A propos"
  size="small"
  class="about-header">
  <template v-slot:background>
    <div class="about-header__background autoalpha" ref="headerBackground" :data-menu-visible="menuVisible">
      <div class="about-header__background__skylines about-header__background__skylines--1"/>
      <div class="about-header__background__skylines about-header__background__skylines--2"/>
      <div class="about-header__background__skylines about-header__background__skylines--3"/>
      <div class="about-header__background__logo-wrapper">
        <Logo 
          v-if="headerBackground"
          :hasParallaxAnim="true"
          :mouseParallaxBoundaries="headerBackground"
          class="about-header__background__logo"/>
      </div>
    </div>
  </template>
</CustomHeader>

<Grid>
  <RichtextWrapper :withFocus="true">
    <StrapiBlocksText v-if="data?.intro" :nodes="data.intro" />
  </RichtextWrapper>
</Grid>

<Grid>
  <CustomSection v-if="data?.experience" title="Parcours">
    <template v-slot:content>
      <HistoryList :history="data.experience" />
    </template>
  </CustomSection>
</Grid>

<Grid>
  <CustomSection v-if="data?.skills" title="Compétences">
    <template v-slot:content>
      <SkillsList :skills="data.skills" />
    </template>
  </CustomSection>
</Grid>

<Grid splitting="halves">
  <CustomSection v-if="data?.interests" title="Intérêts">
    <template v-slot:content>
      <InterestsList :interests="data.interests" />
    </template>
  </CustomSection>
  
  <CustomSection v-if="data?.social_links" title="Contacts">
    <template v-slot:content>
      <SocialLinksList :social-links="data.social_links"/>
    </template>
  </CustomSection>
</Grid>

<Grid>
  <CustomSection v-if="data?.resume" title="CV">
    <template v-slot:content>
      <ResumeList :resume="data.resume" />
    </template>
  </CustomSection>
</Grid>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/templates/about" as *;
</style>
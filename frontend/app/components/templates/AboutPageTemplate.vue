<script setup lang="ts">
import { gsap } from "gsap";
import type { AboutCollectionItem } from '@nuxt/content';

const props = defineProps<{ 
  data: AboutCollectionItem,
}>()

const headerBackground = useTemplateRef('headerBackground')
const menuVisible = ref(false)
let ctx: gsap.Context;

onMounted(() => {
  if (!headerBackground.value) return

  const initTimeline = () => {
    const timeline = gsap.timeline()

    timeline
      .from(headerBackground.value, {
        autoAlpha: 0
      })

    return timeline
  }

  ctx = gsap.context((self) => {
    const timeline = gsap.timeline({
      onComplete: () => {
        menuVisible.value = true
      }
    })

    timeline    
      .add(initTimeline())
      .from(self.selector?.('.about-header__background__logo'), {
        scale: 0,
        duration: .25,
        ease: 'back.out(2.5)',
      }, '+=.2')
  }, headerBackground.value)
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<template>
<CustomHeader title="A propos" size="small" class="about-header">
  <template v-slot:background>
    <div class="about-header__background" ref="headerBackground" :data-menu-visible="menuVisible">
      <div class="about-header__background__skylines about-header__background__skylines--1"/>
      <div class="about-header__background__skylines about-header__background__skylines--2"/>
      <div class="about-header__background__skylines about-header__background__skylines--3"/>
      <Logo class="about-header__background__logo"/>
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
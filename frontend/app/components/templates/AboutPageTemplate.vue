<script setup lang="ts">
import type { AboutCollectionItem } from '@nuxt/content';

const props = defineProps<{ 
  data: AboutCollectionItem,
}>()
</script>

<template>
<CustomHeader title="A propos" size="small" class="about-header">
  <template v-slot:background>
    <div class="about-header__background">
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
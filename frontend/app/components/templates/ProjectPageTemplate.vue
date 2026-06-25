<script lang="ts" setup>
import { gsap } from "gsap";
import type { ProjectsCollectionItem } from "@nuxt/content";
import ProjectMainImagesCanvas from "../organisms/ProjectMainImagesCanvas.vue";

// https://tympanus.net/codrops/2024/02/07/on-scroll-revealing-webgl-image-explorations/
// https://tympanus.net/codrops/2024/08/27/grid-displacement-texture-with-rgb-shift-using-three-js-gpgpu-and-shaders/

const props = defineProps<{ 
  data: ProjectsCollectionItem
  surroundings?: Pick<ProjectsCollectionItem, 'title' | 'slug' | 'cover_image_landscape'>
}>()

const headerWrapper = useTemplateRef('headerWrapper')
const menuVisible = ref(false)
let titleTimeline: gsap.core.Timeline;

const onTitleTimeline = (payload: gsap.core.Timeline) => {
  titleTimeline = payload;
};

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }
  
  const timeline = gsap.timeline({
    onComplete: () => {
      titleTimeline.play()
      menuVisible.value = true
    }
  })

  const scrollTimeline = gsap.timeline({
    paused: true,
    scrollTrigger: {
      trigger: headerWrapper.value,
      scrub: true,
      once: false,
      start: '15% top',
      end: 'bottom top',
    }
  })

  const lastTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: headerWrapper.value,
      scrub: true,
      once: false,
      start: '50% top',
      end: 'bottom top',
    }
  })

  const titleWrapperTimeline = gsap.timeline({
    paused: true,
    scrollTrigger: {
      trigger: headerWrapper.value,
      once: false,
      start: 'top -50%',
      onEnter: () => titleWrapperTimeline.play(),
      onLeaveBack: () => titleWrapperTimeline.reverse()
    }
  })

  timeline
    .from(headerWrapper.value, {
      autoAlpha: 0
    })
    .set(context.selector?.('.project-header__title'), {
      '--displacement-factor': -1,
    })

  scrollTimeline
    .from(context.selector?.('.project-header img'), {
      scale: 1.1,
      ease: 'none'
    }, 0)
    .to(context.selector?.('.project-header img'), {
      opacity: .25,
      ease: 'none'
    }, '<')
    .to(context.selector?.('.project-header__bg'), {
      '--overlay-opacity': 1,
      ease: 'none'
    }, '<')

  lastTimeline
    .to(context.selector?.('.project-header img'), {
      y: '50%',
      ease: 'none'
    })

  titleWrapperTimeline
    .fromTo(context.selector?.('.project-header__title'), {
      '--displacement-factor': -1
    }, {
      '--displacement-factor': 0,
      duration: .5,
      ease: 'circ.inOut'
    })
}, headerWrapper)
</script>

<template>
<div>
  <div ref="headerWrapper" class="project-header autoalpha" :data-menu-visible="menuVisible">
    <div class="project-header__sticky-wrapper">
      <div class="project-header__bg">
        <CustomPicture 
          v-if="data.cover_image_landscape"
          :picture-data-default="data.cover_image_landscape"
          :picture-data-portrait="data.cover_image_portrait"
          format="full_screen"
          :is-cover="true" />
      </div>
  
      <div class="project-header__title-wrapper">
        <CustomTitle 
          :content="data.title"
          class="project-header__title"
          level="main"
          enforceVisibility
          @title-timeline="onTitleTimeline" />
      </div>
    </div>
  </div>
  
  <Grid :withTopPadding="false">
    <div class="project-intro">
      <ProjectStats 
        v-if="data.year || data.skills?.at(0)"
        :year="data.year"
        :skills="data.skills" />
    
      <div class="project-intro__desc" v-if="data?.description">
        <RichtextWrapper>
          <StrapiBlocksText :nodes="data.description" />
        </RichtextWrapper>
      </div>
    </div>
  </Grid>

  <!-- <section 
    v-if="data?.main_images?.at(0)"
    class="project-main-imgs">
    <ProjectMainImage 
      v-for="(mainImage, index) in data.main_images"
      :key="mainImage.id"
      :images="mainImage.images"
      :type="mainImage.type"
      :index="index" />
  </section> -->
  <ProjectMainImagesCanvas :images="data.main_images" />
</div>

<Grid v-if="data?.typography?.at(0) || data?.colors?.at(0)" splitting="halves">
  <CustomSection v-if="data?.typography?.at(0)" title="Typographie">
    <template v-slot:content>
      <ProjectTypography :fonts="data.typography" />
    </template>
  </CustomSection>
  
  <CustomSection v-if="data?.colors?.at(0)" title="Couleurs">
    <template v-slot:content>
      <ProjectColors :colors="data.colors" />
    </template>
  </CustomSection>
</Grid>

<ProjectSecondaryImages v-if="data?.secondary_images?.at(0)" :secondaryImgs="data?.secondary_images" />

<ProjectNextLink
  v-if="surroundings"
  :title="surroundings.title"
  :slug="surroundings.slug"
  :coverImg="surroundings.cover_image_landscape" />
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/templates/project" as *;
</style>
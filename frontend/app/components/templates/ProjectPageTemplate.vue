<script lang="ts" setup>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{ 
  data: ProjectsCollectionItem
  surroundings?: Pick<ProjectsCollectionItem, 'title' | 'slug' | 'cover_image_landscape'>[]
}>()

const lenisRef = ref()
const headerWrapper = useTemplateRef('headerWrapper')
const menuVisible = ref(false)
let ctx: gsap.Context;
let titleTimeline: gsap.core.Timeline;

const onTitleTimeline = (payload: gsap.core.Timeline) => {
  titleTimeline = payload;
};

watchEffect((onInvalidate) => {
  if (!lenisRef.value?.lenis) return

  lenisRef.value.lenis.on('scroll', ScrollTrigger.update)

  function update(time:number) {
    lenisRef.value.lenis.raf(time * 1000)
  }
  gsap.ticker.add(update)

  gsap.ticker.lagSmoothing(0)

  onInvalidate(() => {
    gsap.ticker.remove(update)
  })
})

onMounted(() => {
  if (!headerWrapper.value) return

  const initTimeline = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline({
      onComplete: () => {
        titleTimeline.play()
        menuVisible.value = true
      }
    })

    timeline
      .from(headerWrapper.value, {
        autoAlpha: 0
      })
      .set(gsapContext.selector?.('.project-header__title'), {
        '--displacement-factor': -1,
      })

    return timeline
  }

  ctx = gsap.context((self) => {
    const timeline = gsap.timeline()

    const scrollTimeline = gsap.timeline()
    const titleWrapperTimeline = gsap.timeline({paused: true})
    const lastTimeline = gsap.timeline()

    timeline
      .add(initTimeline(self))

    scrollTimeline
      .from('.project-header img', {
        scale: 1.1,
        ease: 'none'
      }, 0)
      .to('.project-header img', {
        opacity: .25,
        ease: 'none'
      }, '<')
      .to('.project-header__bg', {
        '--overlay-opacity': 1,
        ease: 'none'
      }, '<')

    lastTimeline
      .to('.project-header img', {
        y: '50%',
        ease: 'none'
      })

    titleWrapperTimeline
      .fromTo('.project-header__title', {
        '--displacement-factor': -1
      }, {
        '--displacement-factor': 0,
        duration: .5,
        ease: 'circ.inOut'
      })

    ScrollTrigger.create({
      trigger: headerWrapper.value,
      scrub: true,
      once: false,
      start: '15% top',
      end: 'bottom top',
      animation: scrollTimeline
    });

    ScrollTrigger.create({
      trigger: headerWrapper.value,
      scrub: true,
      once: false,
      start: '50% top',
      end: 'bottom top',
      animation: lastTimeline
    });

    ScrollTrigger.create({
      trigger: headerWrapper.value,
      once: false,
      start: 'top -50%',
      onEnter: () => titleWrapperTimeline.play(),
      onLeaveBack: () => titleWrapperTimeline.reverse()
    });
  }, headerWrapper.value);
})

onUnmounted(() => { 
  if (!headerWrapper.value) return
  
  ctx.revert();
});
</script>

<template>
<VueLenis root ref="lenisRef" :options="{ autoRaf: false }" />

<div>
  <div ref="headerWrapper" class="project-header autoalpha" :data-menu-visible="menuVisible">
    <div class="project-header__sticky-wrapper">
      <div class="project-header__bg">
        <CustomPicture 
          v-if="data.cover_image_landscape"
          :picture-data-default="data.cover_image_landscape"
          :picture-data-portrait="data.cover_image_portrait"
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

  <section 
    v-if="data?.main_images?.at(0)"
    class="project-main-imgs">
    <ProjectMainImage 
      v-for="(mainImage, index) in data.main_images"
      :key="mainImage.id"
      :images="mainImage.images"
      :type="mainImage.type"
      :index="index" />
  </section>
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
  v-if="surroundings?.[1]"
  :title="surroundings[1].title"
  :slug="surroundings[1].slug"
  :coverImg="surroundings[1].cover_image_landscape" />
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/templates/project" as *;
</style>
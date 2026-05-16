<script lang="ts" setup>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{ 
  data: ProjectsCollectionItem
  surroundings?: Pick<ProjectsCollectionItem, 'title' | 'slug' | 'cover_image_landscape'>[]
}>()

const lenisRef = ref()
const globalWrapper = useTemplateRef('globalWrapper')
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
  if (!globalWrapper.value) return

  const initTimeline = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline({
      onComplete: () => {
        titleTimeline.play()
        menuVisible.value = true
      }
    })

    timeline
      .from(gsapContext.selector?.('.header'), {
        autoAlpha: 0
      })
      .set(gsapContext.selector?.('.title'), {
        '--xDisplacement': -1,
      })

    return timeline
  }

  ctx = gsap.context((self) => {
    const timeline = gsap.timeline()

    const scrollTimeline = gsap.timeline()

    timeline
      .add(initTimeline(self))

    scrollTimeline.from('.header img', {
        scale: 1.1,
        ease: 'none'
      }, 0)
      .to('.header img', {
        opacity: .4
      }, '50%')
      .fromTo('.title', {
        '--xDisplacement': -1
      }, {
        '--xDisplacement': 0
      }, '50%')

    ScrollTrigger.create({
      trigger: headerWrapper.value,
      scrub: true,
      once: false,
      animation: scrollTimeline
    });
  }, globalWrapper.value);
})

onUnmounted(() => {
  ctx.revert();
});
</script>

<template>
<VueLenis root ref="lenisRef" :options="{ autoRaf: false }" />

<div ref="globalWrapper">
  <div ref="headerWrapper" class="header" :data-menu-visible="menuVisible">
    <div class="header-sticky">
      <CustomPicture 
        v-if="data.cover_image_landscape"
        :picture-data-default="data.cover_image_landscape"
        :picture-data-portrait="data.cover_image_portrait"
        :is-cover="true" />
  
      <Grid class="title-wrapper" :withTopPadding="false" :withBottomPadding="false">
        <CustomTitle 
          :content="data.title"
          class="title"
          level="main"
          enforceVisibility
          @title-timeline="onTitleTimeline" />
      </Grid>
    </div>
  </div>
  
  <Grid :withTopPadding="false">
    <div class="intro">
      <ProjectStats 
        v-if="data.year || data.skills?.at(0)"
        :year="data.year"
        :skills="data.skills" />
    
      <div class="desc" v-if="data?.description">
        <RichtextWrapper>
          <StrapiBlocksText :nodes="data.description" />
        </RichtextWrapper>
      </div>
    </div>
  </Grid>

  <section 
    v-if="data?.main_images?.at(0)"
    class="main-imgs">
    <div 
      v-for="mainImage in data.main_images"
      :key="mainImage.id"
      class="main-img">
      <CustomPicture v-if="mainImage.images[0]" :picture-data-default="mainImage.images[0]" />
    </div>
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
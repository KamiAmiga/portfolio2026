<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Props {
  title: string
  titleTag?: 'div' | 'h1' | 'h2' | 'h3' | 'h4'
}

const props = withDefaults(defineProps<Props>(), {
  titleTag: 'h2' 
})
const section = useTemplateRef('section')
let titleTimeline: gsap.core.Timeline;

const onTitleTimeline = (payload: gsap.core.Timeline) => {
  titleTimeline = payload;
};

useGSAP((isReducedMotion) => {
  if (isReducedMotion) {
    return
  }
  
  ScrollTrigger.create({
    trigger: section.value,
    start: '-100px bottom',
    once: true,
    onEnter: () =>{
      titleTimeline.play()
    }
  });
}, section)
</script>

<template>
  <section class="section" ref="section">
    <CustomTitle
      :content="title"
      level="second"
      :tag="titleTag"
      @title-timeline="onTitleTimeline" />

    <div class="section__content">
      <slot name="content"></slot>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/components/organisms/custom-section' as *;
</style>
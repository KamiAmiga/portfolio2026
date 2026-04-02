<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Props {
  title: string
  titleTag?: 'div' | 'h1' | 'h2' | 'h3' | 'h4'
}

const props = withDefaults(defineProps<Props>(), {
  titleTag: 'h2' 
})
const section = ref()
let ctx: gsap.Context;
let titleTimeline: gsap.core.Timeline;

const onTitleTimeline = (payload: gsap.core.Timeline) => {
  titleTimeline = payload;
};

onMounted(() => {
  ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: section.value,
      start: '-100px bottom',
      once: true,
      onEnter: () =>{
        titleTimeline.play()
      }
    });
  }, section.value);
});

onUnmounted(() => {
  ctx.revert();
});
</script>

<template>
  <section class="section" ref="section">
    <custom-title
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
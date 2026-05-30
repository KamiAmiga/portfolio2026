<script lang="ts" setup>
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const props = withDefaults(
  defineProps<{
    withFocus?: boolean
  }>(), {
    withFocus: false
  })

const wrapper = ref()
let ctx: gsap.Context

onMounted(() => { 
  ctx = gsap.context((self) => {
    const timeline = gsap.timeline()

    timeline
      .from(wrapper.value, {
        autoAlpha: 0
      })
      .from(self.selector?.('.richtext-wrapper__content'), {
        y: 20,
        duration: .6,
        ease: 'expo.out'
      })
      .from(self.selector?.('.richtext-wrapper__content'), {
        opacity: 0,
        duration: .4,
        ease: 'power3.out'
      }, '<')
    
    if (props.withFocus) {[
      timeline
        .from(wrapper.value, {
          '--focus-shape-scale': 0,
          duration: .3,
          ease: "power3.inOut"
        }, '<')
    ]}

    ScrollTrigger.create({
      trigger: wrapper.value,
      once: true,
      animation: timeline
    });
  }, wrapper.value);
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<template>
  <div 
    class="richtext-wrapper font-sans--base"
    :class="`${withFocus ? 'richtext-wrapper--with-focus' : ''}`"
    ref="wrapper">
    <div class="richtext-wrapper__content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/molecules/richtext-wrapper' as *;
</style>
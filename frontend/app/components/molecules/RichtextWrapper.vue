<script lang="ts" setup>
import { gsap } from "gsap";

const props = withDefaults(
  defineProps<{
    withFocus?: boolean
  }>(), {
    withFocus: false
  })

const wrapper = useTemplateRef('wrapper')
const { transitionState } = useTransitionComposable();

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }
  
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper.value,
      once: true,
    }
  })
  
  watchEffect(() => {
    if(transitionState.transitionComplete) {
      timeline
        .from(wrapper.value, {
          autoAlpha: 0
        })
        .from(context.selector?.('.richtext-wrapper__content'), {
          y: 20,
          duration: .6,
          ease: 'expo.out'
        })
        .from(context.selector?.('.richtext-wrapper__content'), {
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
    }
  })
}, wrapper)
</script>

<template>
  <div 
    class="autoalpha richtext-wrapper font-sans--base"
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
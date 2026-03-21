<script lang="ts" setup>
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

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

    const splitText = SplitText.create(self.selector?.('.richtext-wrapper__content'), {
      type: "words,lines",
      mask: "lines",
      autoSplit: true,
      aria: "hidden"
    });

    timeline
      .from(wrapper.value, {
        autoAlpha: 0
      })
      .from(splitText.lines, {
        opacity: 0,
        y: '1.5em',
        duration: .6,
        ease: "power3.out",
        stagger: .1
      })
    
    if (props.withFocus) {[
      timeline
        .from(wrapper.value, {
          '--focus-shape-scale': 0,
          duration: .3,
          ease: "power3.inOut"
        }, '<')
    ]}
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
    <div class="sr-only">
      <slot />
    </div>

    <div class="richtext-wrapper__content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/molecules/richtext-wrapper' as *;
</style>
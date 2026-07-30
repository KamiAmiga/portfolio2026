<script setup lang="ts">
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

const props = defineProps<{
  link: {
    target: string,
    label: string
  }
}>();

const mainMenuLink = useTemplateRef('mainMenuLink')

const handleHoverFocus = () => {
  if (!splittedLinkTimeline) return

  splittedLinkTimeline().play(0)
}

let splittedLinkTimeline: () => gsap.core.Timeline

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }

  const splitLinkText = SplitText.create(context.selector?.('.main-menu-link__label'), {
    type: "chars,words",
    mask: "lines",
    aria: "hidden"
  });

  splittedLinkTimeline = () => {
    const timeline = gsap.timeline()

    timeline
      .set(splitLinkText.chars, { y: '100%', opacity: 0 })
      .to(splitLinkText.chars, {
        opacity: 1,
        y: 0,
        duration: .3,
        ease: "power2.inOut",
        stagger: .02
      }, '<')

    return timeline
  }
}, mainMenuLink)
</script>

<template>
<div ref="mainMenuLink">
  <NuxtLink
    class="main-menu-link"
    :to="link.target"
    @click="(event) => (event.target as HTMLElement).blur()"
    @mouseenter="handleHoverFocus"
    @focus="handleHoverFocus">
    <span class="main-menu-link__label text-shadow--sm font-sans--base-bold">
      {{ link.label }}
    </span>
  </NuxtLink>
</div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/atoms/main-menu-link' as *;
</style>
<script setup lang="ts">
import { gsap } from "gsap";
import type { NuxtError } from "#app";
import { SplitText } from "gsap/SplitText";

const props = defineProps<{ 
  error: NuxtError,
}>()

const errorWrapper = useTemplateRef('errorWrapper')
const menuVisible = ref(false)
let ctx: gsap.Context;

onMounted(() => {
  if (!errorWrapper.value) return

  const initTimeline = () => {
    const timeline = gsap.timeline()

    timeline
      .from(errorWrapper.value, {
        autoAlpha: 0
      })

    return timeline
  }

  ctx = gsap.context((self) => {
    const timeline = gsap.timeline()

    const splitText = SplitText.create(self.selector?.('.error__text__status'), {
      type: "words,lines",
      mask: "lines",
      autoSplit: true,
      aria: "hidden"
    });

    timeline    
      .add(initTimeline())
      .from(self.selector?.('.error__visual'), {
        scale: 0,
        duration: .25,
        ease: 'back.out(2.5)',
        onComplete: () => {
          menuVisible.value = true
        }
      })
      .from(self.selector?.('.error__visual__status'), {
        opacity: 0,
        duration: .4,
        ease: "power2.inOut",
      })
      .from(splitText.lines, {
        opacity: 0,
        y: '1.5em',
        duration: .5,
        ease: "power3.out",
        stagger: .1
      }, '-=50%')
      .from(self.selector?.('.link'), {
        opacity: 0,
        duration: .5,
        ease: "power2.inOut",
      }, '-=50%')
  }, errorWrapper.value)
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<template>
<div 
  class="autoalpha"
  :data-menu-visible="menuVisible"
  ref="errorWrapper">
  <Grid
    splitting="thirds"
    class="error">
    <div class="error__visual">
      <div class="error__visual__shape"></div>
      <div class="error__visual__status font-sans--2xl">{{ error.status }} ?</div>
    </div>
  
    <div class="error__text">
      <div>
        <h1 class="error__text__status font-sans--xl">
          {{ error.statusText }}
        </h1>
      </div>
      <NuxtLink to="/" class="link">Retour à l'accueil</NuxtLink>
    </div>
  </Grid>
</div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/templates/error" as *;
</style>
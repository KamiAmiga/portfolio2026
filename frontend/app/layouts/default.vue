<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger);

const nuxtApp = useNuxtApp()
const lenisRef = ref()

watchEffect((onInvalidate) => {
  if (!lenisRef.value?.lenis) return

  lenisRef.value.lenis.on('scroll', ScrollTrigger.update)

  function update(time: number) {
    lenisRef.value.lenis.raf(time * 1000)
  }
  gsap.ticker.add(update)

  gsap.ticker.lagSmoothing(0)

  onInvalidate(() => {
    gsap.ticker.remove(update)
  })
})

nuxtApp.hook("page:start", () => {
  if (!lenisRef.value) return
  
  lenisRef.value.lenis.scrollTo(0, {immediate: true})
})
</script>

<template>
  <VueLenis
    root
    ref="lenisRef"
    :options="{ 
      autoRaf: false,
      stopInertiaOnNavigate: true,
      lerp: .06
    }" />

  <slot />
</template>

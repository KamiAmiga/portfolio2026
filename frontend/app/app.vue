<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger, CustomEase);

const mainID = "main"
const menuLinks = [
  {
    target: '/projets',
    label: 'Projets'
  },
    {
    target: '/a-propos',
    label: 'À propos'
  }
]

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
</script>

<template>
  <VueLenis root ref="lenisRef" :options="{ autoRaf: false, stopInertiaOnNavigate: true }" />

  <CrtFilter />
  
  <SkipLink :targetID="mainID" />
  
  <MainMenu :links="menuLinks" />

  <main role="main" :id="mainID">
    <NuxtPage />
  </main>
</template>

<style lang="scss">
@use "~/assets/styles/base";
@use "~/assets/styles/utilities";
</style>


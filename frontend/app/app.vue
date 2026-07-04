<script setup lang="ts">
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import 'lenis/dist/lenis.css'

gsap.registerPlugin(CustomEase, ScrollTrigger);

const lenisRef = ref()
const { toggleTransitionComplete } = useTransitionComposable();

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

onMounted(() => {
  toggleTransitionComplete(true);
});

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
  <VueLenis
    root
    ref="lenisRef"
    :options="{ 
      autoRaf: false,
      stopInertiaOnNavigate: true,
      lerp: .06
    }" />

  <CrtFilter />

  <SkipLink :targetID="mainID" />

  <MainMenu :links="menuLinks" />

  <Curtains />

  <NuxtPage :id="mainID" />
</template>

<style lang="scss">
@use "~/assets/styles/base";
@use "~/assets/styles/utilities";
</style>


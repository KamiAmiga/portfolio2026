<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

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

const main = ref();
const smoothContent = ref()
let ctx: gsap.Context;

onMounted(() => {
  ctx = gsap.context(() => {
    ScrollSmoother.create({
      smooth: 1,
      normalizeScroll: true,
      wrapper: main.value,
      content: smoothContent.value
    });
  }, main.value);
});

onUnmounted(() => {
  ctx.revert();
});
</script>

<template>
  <CrtFilter />
  <SkipLink :targetID="mainID" />
  
  <MainMenu :links="menuLinks" />

  <main role="main" :id="mainID" ref="main">
    <div ref="smoothContent">
      <NuxtPage />
    </div>
  </main>
</template>

<style lang="scss">
@use "~/assets/styles/base";
@use "~/assets/styles/utilities";
</style>


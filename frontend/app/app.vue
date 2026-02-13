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
</script>

<template>
  <CrtFilter />
  <SkipLink :targetID="mainID" />
  
  <MainMenu :links="menuLinks" />

  <main role="main" :id="mainID">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </main>
</template>

<style lang="scss">
@use "~/assets/styles/base";
@use "~/assets/styles/utilities";
</style>


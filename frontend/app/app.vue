<script setup lang="ts">
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import 'lenis/dist/lenis.css'

gsap.registerPlugin(CustomEase);

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
  <NuxtLayout>
    <CrtFilter />
    
    <SkipLink :targetID="mainID" />
    
    <MainMenu :links="menuLinks" />
  
    <main role="main" :id="mainID">
      <NuxtPage />
    </main>
  </NuxtLayout>
</template>

<style lang="scss">
@use "~/assets/styles/base";
@use "~/assets/styles/utilities";
</style>


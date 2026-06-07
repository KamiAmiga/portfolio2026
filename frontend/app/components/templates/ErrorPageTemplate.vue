<script setup lang="ts">
import { gsap } from "gsap";
import type { NuxtError } from "#app";

const props = defineProps<{ 
  error: NuxtError,
}>()

const errorWrapper = useTemplateRef('errorWrapper')
const menuVisible = ref(false)

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }
  
  const timeline = gsap.timeline()

  timeline    
    .from(errorWrapper.value, {
      autoAlpha: 0
    })
    .from(context.selector?.('.error__visual'), {
      scale: 0,
      duration: .25,
      ease: 'back.out(2.5)',
      onComplete: () => {
        menuVisible.value = true
      }
    })
    .from(context.selector?.('.error__visual__status'), {
      opacity: 0,
      duration: .4,
      ease: "power2.inOut",
    })
    .from(context.selector?.('.error__text__status'), {
      y: 20,
      duration: .6,
      ease: 'expo.out'
    }, '-=50%')
    .from(context.selector?.('.error__text__status'), {
      opacity: 0,
      duration: .4,
      ease: 'power3.out'
    }, '<')
    .from(context.selector?.('.link'), {
      opacity: 0,
      duration: .5,
      ease: "power2.inOut",
    }, '-=50%')
}, errorWrapper, false)
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
      <div class="error__visual__status font-sans--3xl">{{ error.status }} ?</div>
    </div>
  
    <div class="error__text">
      <div>
        <h1 class="error__text__status font-sans--xl">
          {{ error.status === 404 ? `Oups, cette page n'existe pas !` : error.statusText }}
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
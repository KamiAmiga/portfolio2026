<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

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
  <NuxtLayout name="no-smooth-scroll">
    <CrtFilter />
    
    <SkipLink :targetID="mainID" />
    
    <MainMenu :links="menuLinks" />
    
    <main role="main">
      <ErrorPageTemplate :error="error" />
    </main>
  </NuxtLayout>
</template>

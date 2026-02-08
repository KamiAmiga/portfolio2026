<script setup lang="ts">
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
    <NuxtPage />
  </main>
</template>

<style lang="scss">
@use "~/assets/styles/base";
@use "~/assets/styles/utilities";
</style>


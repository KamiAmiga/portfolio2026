<script setup lang="ts">
const mainID = "main"
const menuLinks = [
  {
    target: 'projets',
    label: 'Projets'
  },
    {
    target: 'a-propos',
    label: 'À propos'
  }
]

const testImg = {
  id: 0,
  attributes: {
    alternativeText: 'test',
    caption: '',
    ext: '',
    name: '',
    url: '/uploads/cat_Elite_3_ff269ab618.jpg',
    width: 100,
    height: 100
  }
}

const testPicture = {
  landscape: {
    id: 0,
    attributes: {
      alternativeText: '',
      caption: '',
      ext: '',
      name: '',
      url: '/uploads/cat_Elite_cover_Landscape_a59a8a81b6.jpg',
      width: 100,
      height: 100
    }
  },
  portrait: {
    id: 0,
    attributes: {
      alternativeText: '',
      caption: '',
      ext: '',
      name: '',
      url: '/uploads/cat_Elite_cover_Portrait_7d03803253.jpg',
      width: 100,
      height: 100
    }
  }
}
</script>

<template>
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


<script setup lang="ts">
const props = defineProps<{
  links: {
    target: string,
    label: string
  }[]
}>();
</script>

<template>
<nav role="navigation" aria-label="Menu principal" class="main-menu">
  <Grid splitting="full">
    <ul class="main-menu__list">
      <li class="main-menu__list__item main-menu__list__item--home">
        <NuxtLink to="/">
          <span class="sr-only">Retour à l'accueil</span>
          <Logo />
        </NuxtLink>
      </li>

      <li v-for="link in links" :key="link.target">
        <MainMenuLink :link="link" />
      </li>
    </ul>
  </Grid>
</nav>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/molecules/main-menu' as *;
</style>
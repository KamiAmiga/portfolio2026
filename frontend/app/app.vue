<script setup lang="ts">
const mainID = "main"
</script>

<template>
  <SkipLink :targetID="mainID" />

  <main role="main" :id="mainID">
    <NuxtPage />
  </main>
</template>

<style lang="scss">
@use "~/assets/styles/base";
</style>


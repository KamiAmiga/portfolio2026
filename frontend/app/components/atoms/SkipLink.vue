<script setup lang="ts">
const props = defineProps<{
  targetID: string
}>();

const linkTarget = computed(() => `#${props.targetID}`)
</script>

<template>
  <div class="skip-link">
    <a class="skip-link__label" :href="linkTarget">Aller au contenu</a>
  </div>
</template>

<style lang="scss">
@use "~/assets/styles/components/atoms/skip-link";
</style>


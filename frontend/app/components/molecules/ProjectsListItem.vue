<script lang="ts" setup>
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{ 
  project: Pick<ProjectsCollectionItem, "name" | "slug" | "cover_image_portrait" | "cover_image_landscape">
}>()

// let ctx: gsap.Context;

// onMounted(() => {
//   ctx = gsap.context(() => {
//   });
// })

// onUnmounted(() => {
//   ctx.revert();
// });
</script>

<template>
<li class="project-item">
  <NuxtLink :to="`/projets/${project.slug}`" class="project-item__link">
    <div class="project-item__link__title">
      <div class="project-item__link__title__decorator" />

      <CustomTitle :content="project.name" level='main' tag="h2" />
    </div>


    <CustomPicture 
      v-if="project.cover_image_landscape"
      :pictureDataDefault="project.cover_image_landscape"
      :pictureDataPortrait="project.cover_image_portrait"
      :isCover="true"
      class="project-item__link__image" />
  </NuxtLink>
</li>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/components/molecules/projects-list-item' as *;
</style>
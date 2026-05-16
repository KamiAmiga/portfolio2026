<script lang="ts" setup>
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ProjectsCollectionItem } from "@nuxt/content";

defineProps<{
  title: ProjectsCollectionItem["title"],
  slug: ProjectsCollectionItem["slug"],
  coverImg: ProjectsCollectionItem["cover_image_landscape"]
}>();

const projectNextLink = useTemplateRef('projectNextLink')
let ctx: gsap.Context;

onMounted(() => {
  if (!projectNextLink.value) return

  ctx = gsap.context((self) => {
    const timeline = gsap.timeline()

    timeline    
      .from(projectNextLink.value, {
        autoAlpha: 0,
      })
      .from(self.selector?.('.project-next-link__label__line'), {
        y: '100%',
        duration: .4,
        ease: "power3.out",
        stagger: .1
      })

    ScrollTrigger.create({
      trigger: projectNextLink.value,
      once: false,
      animation: timeline,
    });
  }, projectNextLink.value)
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<template>
<div ref="projectNextLink" class="autoalpha">
  <NuxtLink
    :to="`/projets/${slug}`"
    class="project-next-link">
    <CustomPicture 
      class="project-next-link__image"
      :isCover="true"
      :pictureDataDefault="coverImg" />

    <div class="project-next-link__label">
      <div class="project-next-link__label__line-wrapper">
        <span class="project-next-link__label__line font-mono--base">Projet suivant</span>
      </div>

      <div class="project-next-link__label__line-wrapper">
        <span class="project-next-link__label__line font-sans--md-capitalized">{{ title }}</span>
      </div>
    </div>
  </NuxtLink>
</div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/molecules/project-next-link" as *;
</style>
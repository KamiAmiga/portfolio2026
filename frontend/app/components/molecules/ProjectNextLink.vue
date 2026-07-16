<script lang="ts" setup>
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import type { ProjectsCollectionItem } from "@nuxt/content";

defineProps<{
  title: ProjectsCollectionItem["title"],
  slug: ProjectsCollectionItem["slug"],
  coverImg: ProjectsCollectionItem["cover_image_landscape"]
}>();

const projectNextLink = useTemplateRef('projectNextLink')
const loadAssets = useAssetsLoading(projectNextLink)

const handleHoverFocus = () => {
  if (!splittedTitleTimeline || !splittedOvertitleTimeline) return

  splittedTitleTimeline().play(0)
  splittedOvertitleTimeline().play(0)
}

let splittedOvertitleTimeline: () => gsap.core.Timeline
let splittedTitleTimeline: () => gsap.core.Timeline

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }
  
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: projectNextLink.value,
      once: true,
    }
  })

  const splitOvertitle = SplitText.create(context.selector?.('.project-next-link__label__overtitle'), {
    type: "words",
    mask: "lines",
    aria: "hidden"
  });

  const splitTitle = SplitText.create(context.selector?.('.project-next-link__label__title'), {
    type: "chars,words",
    mask: "lines",
    aria: "hidden"
  });

  splittedOvertitleTimeline = () => {
    const timeline = gsap.timeline()

    timeline
      .from(splitOvertitle.words, {
        y: '100%',
        duration: .4,
        ease: "power3.inOut",
        stagger: .05
      })

    return timeline
  }

  splittedTitleTimeline = () => {
    const timeline = gsap.timeline()

    timeline
      .from(splitTitle.chars, {
        opacity: 0,
        y: '100%',
        duration: .3,
        ease: "power2.inOut",
        stagger: .02
      })

    return timeline
  }
  
  timeline    
    .from(projectNextLink.value, {
      autoAlpha: 0,
    })
    .add(splittedOvertitleTimeline)
    .add(splittedTitleTimeline, '<+=.1')
}, projectNextLink)
</script>

<template>
<div ref="projectNextLink" class="project-next-link-wrapper autoalpha">
  <NuxtLink
    @mouseenter="handleHoverFocus"
    @focus="handleHoverFocus"
    :to="`/projets/${slug}`"
    class="project-next-link">
    <CustomPicture 
      class="project-next-link__image"
      format="full_screen"
      :isCover="true"
      :pictureDataDefault="coverImg"
      :loading="loadAssets" />

    <div class="project-next-link__label">    
      <span class="sr-only">Projet suivant {{ title }}</span>
      
      <div class="project-next-link__label__overtitle font-mono--base">Projet suivant</div>
      <div class="project-next-link__label__title font-sans--md-capitalized">{{ title }}</div>
    </div>
  </NuxtLink>
</div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/molecules/project-next-link" as *;
</style>
<script lang="ts" setup>
import { gsap } from "gsap";
import type { ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{ 
  project: Pick<ProjectsCollectionItem, "title" | "slug" | "cover_image_portrait" | "cover_image_landscape">
  visibilityStatus?: {visible: boolean, preload: boolean}
}>()

const projectItem = useTemplateRef('projectItem')
let ctx: gsap.Context;
let titleTimeline: gsap.core.Timeline;

const onTitleTimeline = (payload: gsap.core.Timeline) => {
  titleTimeline = payload;
};

watchEffect(() => {
  if (!projectItem.value || !props.visibilityStatus?.visible) return

  ctx.onVisible()
})

onMounted(() => {
  if (!projectItem.value) return

  ctx = gsap.context((self) => {
    const timeline = gsap.timeline()

    const initTimeline = () => {
      const timeline = gsap.timeline({
        onComplete: () => {
          titleTimeline.play()
        }
      })
  
      timeline
        .from(projectItem.value, {
          autoAlpha: 0
        })
  
      return timeline
    }
    
  
    const titleWrapperTimeline = (gsapContext: gsap.Context) => {
      const timeline = gsap.timeline({
        onStart: () => {
          titleTimeline.play()
        }
      })
  
      timeline
        .fromTo(
          gsapContext.selector?.('.project-item__link__title'),
          {
            '--dashes-opacity': 0,
            '--dashes-y': '100%'
          },
          {
            '--dashes-opacity': 1,
            '--dashes-y': '0',
            duration: .3,
            ease: 'power2.in',
          }
        )
  
      return timeline
    }
  
    const imageTimeline = (gsapContext: gsap.Context) => {
      const timeline = gsap.timeline()
  
      timeline
        .from(
          gsapContext.selector?.('.project-item__link__image'),
          {
            opacity: 0,
            duration: .6,
            ease: 'circ.in'
          }
        )
        .from(
          gsapContext.selector?.('.project-item__link__image'),
          {
            x: 80,
            duration: .5,
            delay: .1,
            ease: 'back.out(2)'
          },
          0
        )
  
      return timeline
    }

    self.add("onVisible", () => {
      if (window?.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return
      }

      timeline
        .add(initTimeline())
        .fromTo(
          self.selector?.('.project-item__link__title__decorator'),
          {
            opacity: 0,
            rotate: '180deg',
            x: '100%',
            y: '50%',
          }, {
            opacity: 1,
            rotate: '45deg',
            x: '-50%',
            y: '50%',
            duration: .2,
            ease: 'power3'
          })
        .add(titleWrapperTimeline(self))
        .add(imageTimeline(self), '<')
    });
  }, projectItem.value);
})

onUnmounted(() => {
  ctx.revert();
});
</script>

<template>
<li class="project-item autoalpha" ref="projectItem">
  <NuxtLink :to="`/projets/${project.slug}`" class="project-item__link">
    <div class="project-item__link__title">
      <div class="project-item__link__title__decorator" />

      <CustomTitle
        :content="project.title"
        level='main'
        tag="h2"
        enforceVisibility
        @title-timeline="onTitleTimeline" />
    </div>


    <CustomPicture 
      v-if="project.cover_image_landscape"
      :pictureDataDefault="project.cover_image_landscape"
      :pictureDataPortrait="project.cover_image_portrait"
      :isCover="true"
      :loading="visibilityStatus?.preload ? 'eager' : 'lazy'"
      format="full_grid"
      class="project-item__link__image" />
  </NuxtLink>
</li>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/components/molecules/projects-list-item' as *;
</style>
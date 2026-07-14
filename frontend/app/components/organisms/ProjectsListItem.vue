<script lang="ts" setup>
import { gsap } from "gsap";
import type { ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{ 
  project: Pick<ProjectsCollectionItem, "title" | "slug" | "cover_image_portrait" | "cover_image_landscape">
  index: number
  visibilityStatus?: {visible: boolean, preload: boolean}
}>()

let titleTimeline: gsap.core.Timeline;
let gridAnimTimeline: gsap.core.Timeline;

const projectsListItem = useTemplateRef('projectsListItem')
const emit = defineEmits(["endAnim"]);
const sendEndAnim = () => emit("endAnim");
const wasVisible = ref(false)
const menuVisible = ref(false)

const onTitleTimeline = (payload: gsap.core.Timeline) => {
  titleTimeline = payload;
};
const onGridAnimTimeline = (payload: gsap.core.Timeline) => {
  gridAnimTimeline = payload;
};

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }

  const enterTL = gsap.timeline({
    paused: true,
    onStart: () => {
      leaveTL.revert()
    },
    onComplete: () => {
      sendEndAnim()
    }
  })

  const leaveTL = gsap.timeline({
    paused: true,
    onComplete: () => {
      enterTL.revert()
      decoratorTimeline().revert()
      titleWrapperTimeline().revert()
      titleTimeline.revert()
      titleTimeline.time(0)
      imageTimeline().revert()
      gridAnimTimeline.revert()
      gridAnimTimeline.time(0)
    }
  })

  const decoratorTimeline = () => {
    const timeline = gsap.timeline({
      onComplete: () => {
        if (props.index === 0) {
          menuVisible.value = true
        }
      }
    })

    timeline
      .fromTo(
        context.selector?.('.projects-list-item__link__title__decorator'),
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
          duration: .3,
          ease: 'back.out(1.3)'
        })

    return timeline
  }

  const titleWrapperTimeline = () => {
    const timeline = gsap.timeline({
      onStart: () => {
        titleTimeline.play(0, false)
      }
    })

    timeline
      .set(context.selector?.('.projects-list-item__link__title'), {
        opacity: 1,
      })
      .fromTo(
        context.selector?.('.projects-list-item__link__title'),
        {
          '--dashes-opacity': 0,
          '--dashes-y': '100%'
        },
        {
          '--dashes-opacity': 1,
          '--dashes-y': '0',
          duration: .5,
          ease: 'circ.in',
        }
      )

    return timeline
  }

  const imageTimeline = () => {
    const timeline = gsap.timeline({
      onStart:() => {
        gridAnimTimeline.play(0, false)
      }
    })

    timeline
      .to(
        context.selector?.('.projects-list-item__link__image-wrapper'),
        {
          opacity: 1,
          duration: 1.2,
          ease: 'circ.in'
        }
      )
      .from(
        context.selector?.('.projects-list-item__link__image-wrapper'),
        {
          x: 150,
          duration: .6,
          ease: 'back.out(1.25)'
        },
        '<+=.4'
      )

    return timeline
  }

  enterTL
    .set(context.selector?.('.projects-list-item__link__image-wrapper'), {
      opacity: 0
    })
    .set(context.selector?.('.projects-list-item__link__title__decorator'), {
      opacity: 0
    })
    .set(
      context.selector?.('.projects-list-item__link__title'),
      {
        opacity: 0,
        '--dashes-opacity': 0,
        '--dashes-y': '100%'
      }
    )
    .to(projectsListItem.value, {
      autoAlpha: 1
    })
    .add(decoratorTimeline)
    .add(titleWrapperTimeline, '<')
    .add(imageTimeline, '<+=.1')

  leaveTL
    .to(projectsListItem.value, {
      opacity: 0,
      duration: .3,
      ease: 'sine.inOut'
    })

  watchEffect(() => {
    if (!props.visibilityStatus) return

    if (props.visibilityStatus.visible) {
      wasVisible.value = true
      enterTL.play(0, false)
    } else {
      if (wasVisible.value) {
        leaveTL.play(0, false)
        wasVisible.value = false
      }
    }
  })
}, projectsListItem)
</script>

<template>
<li
  ref="projectsListItem"
  class="projects-list-item autoalpha"
  :data-menu-visible="index === 0 ? menuVisible : undefined">
  <NuxtLink :to="`/projets/${project.slug}`" class="projects-list-item__link">
    <div class="projects-list-item__link__title">
      <div class="projects-list-item__link__title__decorator" />

      <CustomTitle
        :content="project.title"
        level='main'
        tag="h2"
        enforceVisibility
        @titleTimeline="onTitleTimeline" />
    </div>

    <GridAnimWrapper
      :index="index"
      class="projects-list-item__link__image-wrapper"
      @gridAnimTimeline="onGridAnimTimeline">
      <CustomPicture 
        v-if="project.cover_image_landscape"
        :pictureDataDefault="project.cover_image_landscape"
        :pictureDataPortrait="project.cover_image_portrait"
        :isCover="true"
        :loading="visibilityStatus?.preload ? 'eager' : 'lazy'"
        format="full_grid"
        class="projects-list-item__link__image" />
    </GridAnimWrapper>
  </NuxtLink>
</li>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/components/organisms/projects-list-item.scss' as *;
</style>
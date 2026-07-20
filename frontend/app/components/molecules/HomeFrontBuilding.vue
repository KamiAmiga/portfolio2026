<script setup lang="ts">
import { gsap } from "gsap";
import type { ProjectsCollectionItem } from "@nuxt/content";
import GridAnimWrapper from "./GridAnimWrapper.vue";
import { context } from "three/tsl";

const props = defineProps<{
  index: number
  side: 'left' | 'right'
  canStartAnim: boolean
  projectsList: Pick<ProjectsCollectionItem, "title" | "slug" | "cover_image_portrait">[]
  projectsAnimSettings: {duration: number, delay: number}
}>()

interface BuildingNameAnim {
  x: gsap.QuickToFunc
  y: gsap.QuickToFunc
}

const homeFrontBuilding = useTemplateRef('homeFrontBuilding')
const buildingName = useTemplateRef('buildingName')
const currentProjectIndex = ref(0)

let gridAnimTimeline: gsap.core.Timeline;

const buildingAnimSettings = {
  delay: 0.1,
  ease: "power3.out",
}

let buildingNameAnim: BuildingNameAnim | undefined = undefined

const onGridAnimTimeline = (payload: gsap.core.Timeline) => {
  gridAnimTimeline = payload;
};

const randomProjectIndex = () => Math.floor(Math.random() * props.projectsList.length);

const getNewRandomIndex = (oldValue: number) => {
  while (true) {
    const newRandom = randomProjectIndex();

    if (oldValue !== newRandom) {
      return newRandom;
    }
  }
}

const handleMouseMove = (event: MouseEvent) => {
  if (!props.canStartAnim || !buildingNameAnim) return

  const currentShapeBoundingBox = (event.target as HTMLElement).getBoundingClientRect()

  const newPos = {
    x: Math.max(
        Math.min(
          event.x - (currentShapeBoundingBox.left),
          currentShapeBoundingBox.right ?? 0
        ),
        0
      ),
    y: Math.max(
        Math.min(
          event.y - (currentShapeBoundingBox.top ?? 0),
          currentShapeBoundingBox.bottom ?? 0
        ),
        0
      ),
  }

  buildingNameAnim.x(newPos.x)
  buildingNameAnim.y(newPos.y)
}

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }

  const imgsList: HTMLImageElement[] = context.selector?.('.home-front-building__inner__img')

  const toggleImgsVisibility = () => {
    imgsList?.forEach((img, index) => {
      if (index === currentProjectIndex.value) {
        gsap.set(img, {visibility: 'initial'})
      } else {
        gsap.set(img, {visibility: 'hidden'})
      }
    })
  }

  currentProjectIndex.value = getNewRandomIndex(currentProjectIndex.value)
  toggleImgsVisibility()

  watchEffect(() => {
    if (props.canStartAnim) {
      gridAnimTimeline.eventCallback(
        'onComplete',
        () => {
          gsap.delayedCall(
            props.projectsAnimSettings.duration,
            () => {
              gridAnimTimeline.reverse()
            }
          )
        }
      )

      gridAnimTimeline.eventCallback(
        'onReverseComplete',
        () => {
          currentProjectIndex.value = getNewRandomIndex(currentProjectIndex.value)
          toggleImgsVisibility()
          gridAnimTimeline.play(0, false)
        }
      )

      gsap.delayedCall(
        props.projectsAnimSettings.delay,
        () => gridAnimTimeline.play(0, false)
      )
    }
  })

  buildingNameAnim = {
    x: gsap.quickTo(buildingName.value, "x", buildingAnimSettings),
    y: gsap.quickTo(buildingName.value, "y", buildingAnimSettings),
  }
}, homeFrontBuilding, false)
</script>

<template>
<div
  ref="homeFrontBuilding"
  class="home-front-building"
  :class="`home-front-building--${side}`"
  >
  <NuxtLink
    v-if="projectsList[currentProjectIndex]"
    @mousemove="handleMouseMove"
    :to="`/projets/${projectsList[currentProjectIndex]?.slug}`"
    class="home-front-building__inner">
    <span class="sr-only">Voir le projet : {{ projectsList[currentProjectIndex]?.title }}</span>

    <GridAnimWrapper
      v-if="projectsList[currentProjectIndex]?.cover_image_portrait"
      :index="index"
      :customCellsSize="{ min: 16, max: 32, windowRatio: 80 }"
      :customGridAppearDuration=".4"
      class="home-front-building__inner__img-wrapper"
      @gridAnimTimeline="onGridAnimTimeline">
      <CustomPicture
        v-for="project in projectsList"
        class="home-front-building__inner__img"
        :pictureDataDefault="project.cover_image_portrait"
        :loading="'eager'"
        format="fourth_grid"
        :isCover="true" />
    </GridAnimWrapper>
  </NuxtLink>

  <span
    v-if="projectsList[currentProjectIndex]?.title"
    ref="buildingName"
    aria-hidden="true"
    class="home-front-building__name font-mono--sm">
    {{ projectsList[currentProjectIndex]?.title }}
  </span>
</div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/molecules/home-front-building' as *;
</style>
<script lang="ts" setup>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectsListCollectionItem, ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{ 
  data: ProjectsListCollectionItem,
  projectsData?: Pick<ProjectsCollectionItem, "title" | "slug" | "cover_image_portrait" | "cover_image_landscape">[]
}>()

const slideToProject = (index: number) => {
  animating.value = true;
  currentIndex.value = index;
}

const handleKeydown = (event: KeyboardEvent) => {
  if (animating.value) return

  if (
    (event.code === "ArrowUp" || event.code === "ArrowLeft")
    && currentIndex.value > 0
  ) {
    slideToProject(currentIndex.value - 1);
  }

  if (
    (event.code === "ArrowDown" ||event.code === "ArrowRight")
    && currentIndex.value < (props.projectsData?.length ?? 0) -1
  ) {
    slideToProject(currentIndex.value + 1);
  }
}

const setAnimEnded = () => {
  animating.value = false
};

const projectsList = useTemplateRef('projectsList')
const animating = ref(false)
const currentIndex = ref(0)

useGSAP((isReducedMotion) => {
  if (isReducedMotion) {
    return
  }

  const timeline = gsap.timeline()

  timeline
    .from(projectsList.value, {
      autoAlpha: 0
    })

  ScrollTrigger.observe({
    target: window,
    type: "wheel,touch,pointer",
    preventDefault: true,
    wheelSpeed: -1,
    onUp: () => {
      if (animating.value || currentIndex.value === (props.projectsData ?? []).length - 1) return;
      slideToProject(currentIndex.value + 1);
    },
    onDown: () => {
      if (animating.value || currentIndex.value === 0) return;
      slideToProject(currentIndex.value - 1);
    },
    tolerance: 16,
  });
}, projectsList)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
<h1 class="sr-only">{{ data?.title }}</h1>

<div
  ref="projectsList"
  class="autoalpha">
  <ul class="projects-list">
    <ProjectsListItem 
      v-for="(project, index) in projectsData"
      :key="project?.slug"
      :project="project"
      :index="index"
      :visibilityStatus="{
        visible : index === currentIndex,
        preload: index <= currentIndex + 1
      }"
      @endAnim="setAnimEnded" />
  </ul>
  
  <button
    v-if="currentIndex > 0"
    class="projects-list-control projects-list-control--prev"
    @click="() => slideToProject(currentIndex - 1)">
    <span class="sr-only">Projet précédent</span>
    <Icon name="arrow-left" class="projects-list-control__icon" />
  </button>
  <button
    v-if="currentIndex < (projectsData?.length ?? 0) -1"
    class="projects-list-control projects-list-control--next"
    @click="() => slideToProject(currentIndex + 1)">
    <span class="sr-only">Projet suivant</span>
    <Icon name="arrow-right" class="projects-list-control__icon" />
  </button>
</div>
</template>

<style lang="scss" scoped>
@use '/assets/styles/components/templates/projects-list' as *;
</style>
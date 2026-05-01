<script lang="ts" setup>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectsListCollectionItem, ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{ 
  data: ProjectsListCollectionItem,
  projectsData?: Pick<ProjectsCollectionItem, "name" | "slug" | "year" | "cover_image_portrait" | "cover_image_landscape">[]
}>()

const lenisRef = ref()
const projectsListWrapper = useTemplateRef('projectsListWrapper');
const projectsListScroller = useTemplateRef('projectsListScroller');
let ctx: gsap.Context;

watchEffect((onInvalidate) => {
  if (!lenisRef.value?.lenis) return

  lenisRef.value.lenis.on('scroll', ScrollTrigger.update)

  function update(time:number) {
    lenisRef.value.lenis.raf(time * 1000)
  }
  gsap.ticker.add(update)

  gsap.ticker.lagSmoothing(0)

  onInvalidate(() => {
    gsap.ticker.remove(update)
  })
})

onMounted(() => {
  if (!projectsListWrapper.value || !projectsListScroller.value) return

  ctx = gsap.context(() => {
    let pinWrapWidth: number;
    let horizontalScrollLength:number;

    const refresh = () => {
      if (!projectsListWrapper.value || !projectsListScroller.value) return
      
      pinWrapWidth = projectsListScroller.value.scrollWidth;
      horizontalScrollLength = pinWrapWidth - window.innerWidth;
    }

    refresh();

    gsap.to(projectsListScroller.value, {
      scrollTrigger: {
        scrub: true,
        trigger: projectsListWrapper.value,
        pin: projectsListWrapper.value,
        start: "center center",
        end: () => `+=${pinWrapWidth}`,
        invalidateOnRefresh: true
      },
      x: () => -horizontalScrollLength,
      ease: "none"
    });

    ScrollTrigger.addEventListener("refreshInit", refresh);
  }, projectsListWrapper.value);
})

onUnmounted(() => {
  ctx.revert();
});
</script>

<template>
<VueLenis root ref="lenisRef" :options="{ autoRaf: false }" />

<h1 class="sr-only">{{ data?.title }}</h1>

<section v-if="projectsData" class="projects-list-viewport">
  <div ref="projectsListWrapper" class="projects-list-wrapper">          
    <ul ref="projectsListScroller" v-if="projectsData" class="projects-list">
      <ProjectsListItem 
        v-for="project in projectsData"
        :key="project?.slug"
        :project="project" />
    </ul>
  </div>
</section>
</template>

<style lang="scss" scoped>
@use '/assets/styles/components/templates/projects-list' as *;
</style>
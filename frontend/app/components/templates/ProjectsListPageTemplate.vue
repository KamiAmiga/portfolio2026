<script lang="ts" setup>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectsListCollectionItem, ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{ 
  data: ProjectsListCollectionItem,
  projectsData?: Pick<ProjectsCollectionItem, "title" | "slug" | "cover_image_portrait" | "cover_image_landscape">[]
}>()

const projectsList = useTemplateRef('projectsList')
const projectsListWrapper = useTemplateRef('projectsListWrapper')
const projectsListScroller = useTemplateRef('projectsListScroller')
const menuVisible = ref(false)
const projectsItemsScrollStatus = ref(props.projectsData?.map((_, index) => ({visible: index === 0, preload: index <= 1})) ?? [])
let ctx: gsap.Context;


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

    const scrollTween = gsap.to(projectsListScroller.value, {
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

    const projectItems = projectsListWrapper.value?.querySelectorAll('.project-item');

    projectItems?.forEach((projectItem, index) => {
      gsap.from(projectItem, {
        scrollTrigger: {
          trigger: projectItem,
          start: 'left 75%',
          end: 'right end',
          containerAnimation: scrollTween,
          onEnter: () => {
            const currentItem = projectsItemsScrollStatus.value[index]
            const nextItem = projectsItemsScrollStatus.value[index + 1]

            if (currentItem) {
              currentItem.visible = true
            }
            
            if (nextItem) {
              nextItem.preload = true
            }
          },
        },
      });
    });

    gsap.from(projectsList.value, {
      autoAlpha: 0,
      onComplete: (() => {
        menuVisible.value = true
      })
    })

    refresh();

    ScrollTrigger.addEventListener("refreshInit", refresh);
  }, projectsListWrapper.value);
})

onUnmounted(() => {
  ctx.revert();
});
</script>

<template>
<h1 class="sr-only">{{ data?.title }}</h1>

<section
  v-if="projectsData"
  ref="projectsList"
  class="projects-list-viewport"
  :data-menu-visible="menuVisible">
  <div ref="projectsListWrapper" class="projects-list-wrapper">          
    <ul ref="projectsListScroller" v-if="projectsData" class="projects-list">
      <ProjectsListItem 
        v-for="(project, index) in projectsData"
        :key="project?.slug"
        :project="project"
        :visibilityStatus="projectsItemsScrollStatus[index]" />
    </ul>
  </div>
</section>
</template>

<style lang="scss" scoped>
@use '/assets/styles/components/templates/projects-list' as *;
</style>
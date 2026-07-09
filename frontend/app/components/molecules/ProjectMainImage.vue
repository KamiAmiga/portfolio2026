<script setup lang="ts">
import { gsap } from "gsap";
import type { ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{
  images: ProjectsCollectionItem["main_images"][number]['images'];
  type: ProjectsCollectionItem["main_images"][number]['type'];
  index: number
}>()

const reorderedImages = computed(() => {
  return props.images.sort((a,b) => {
    if (a.width > a.height && a.width > b.width) {
      return -1
    }

    if (a.height > a.width && a.height > b.height) {
      return 1
    }

    return 0
  })
})

const imageFormat = (index: number) => {
  if(props.images.length < 2) return 'full_grid'

  switch (props.type) {
    case 'design-print':
      return props.images.length < 2
        ? 'full_grid'
        : 'half_grid'
    case 'ui-mobile':
      return 'third_grid'
    case 'ui-mobile_desktop':
      return index === 0 
        ? 'full_grid'
        : 'third_grid'
    case 'drawing':
    case 'design-visual_id':
    case 'ui-desktop':
    default:
      return 'full_grid'
  }
}

const createCells = () => {
  if (!svgMaskGroup.value || !projectMainImage.value) return null;

  svgMaskGroup.value.innerHTML = '';

  const width = projectMainImage.value.getBoundingClientRect().width;
  const height = projectMainImage.value.getBoundingClientRect().height;
  const cellSize = Math.min(Math.max(window.innerWidth / 20, 25), 50)

  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);

  const cellW = width / cols;
  const cellH = height / rows;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

      rect.setAttribute('x', (x * cellW).toString());
      rect.setAttribute('y', (y * cellH).toString());
      rect.setAttribute('width', cellW.toString());
      rect.setAttribute('height', cellH.toString());
      rect.setAttribute('fill', 'white');
      rect.setAttribute('shape-rendering', 'crispEdges');
      rect.setAttribute('opacity', '0');

      svgMaskGroup.value.appendChild(rect);
      maskCells.value.push(rect);
    }
  }
}

const updateLayout = () => {
  if (!projectMainImage.value || !svgMaskElement.value || !svgMaskRect.value) return null;

  const width = projectMainImage.value.getBoundingClientRect().width;
  const height = projectMainImage.value.getBoundingClientRect().height;

  svgMaskElement.value.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svgMaskRect.value.setAttribute('width', width.toString());
  svgMaskRect.value.setAttribute('height', height.toString());
}

const projectMainImage = useTemplateRef('projectMainImage')
const svgMaskElement = useTemplateRef('svgMaskElement')
const svgMaskGroup = useTemplateRef('svgMaskGroup')
const svgMaskRect = useTemplateRef('svgMaskRect')
const maskCells = ref<SVGRectElement[]>([])
const loadAssets = useAssetsLoading(projectMainImage)

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: projectMainImage.value,
      once: true,
    },
  })

  timeline
    .from(projectMainImage.value, {
      autoAlpha: 0
    })

  watchEffect(() => {
    if (maskCells.value?.at(0)) {
      const shuffled = gsap.utils.shuffle(maskCells.value);
      
      timeline.to(shuffled, {
        opacity: 1,
        duration: .2,
        stagger: {
          ease: 'sine.inOut',
          amount: .6
        },
      })
    }
  })

  timeline
    .to(context.selector?.('.project-main-image__filter feOffset'), {
      attr: {
        dx: 0,
        dy: 0
      },
      duration: .5,
      ease: "back.in(2)",
    }, '<')
    .to(context.selector?.('.project-main-image__filter feColorMatrix'), {
      attr: {
        values: `1 0 0 0 0
              0 1 0 0 0 
              0 0 1 0 0 
              0 0 0 1 0`
      },
      duration: .33,
      ease: 'power2.out'
    }, '-=100%')
    .set(context.selector?.('.project-main-image__filter feBlend'), {
      attr: {
        mode: 'normal'
      }
    })
}, projectMainImage)

onMounted(() => {
  createCells()
  updateLayout()

  window.addEventListener('resize', updateLayout)
})

onUnmounted(() => {
  maskCells.value = []

  window.removeEventListener('resize', updateLayout)

  svgMaskElement.value?.setAttribute('viewBox', `0 0 100 100`);
  svgMaskRect.value?.querySelector('mask rect')?.setAttribute('width', '100');
  svgMaskRect.value?.querySelector('mask rect')?.setAttribute('height', '100');
})
</script>

<template>  
  <div
    ref="projectMainImage"
    class="project-main-image autoalpha"
    :class="`project-main-image--${type}`">
    <svg
      ref="svgMaskElement"
      class="project-main-image__mask"
      viewBox="0 0 100 100"
      preserveAspectRatio="none">
      <defs>
        <mask :id="`project-main-image-${index}-mask`" maskUnits="userSpaceOnUse">
          <rect
            ref="svgMaskRect"
            x="0"
            y="0"
            width="100"
            height="100"
            fill="black" />
          <g ref="svgMaskGroup"></g>
        </mask>
      </defs>
    </svg>

    <svg width="0" height="0" class="project-main-image__filter">
      <filter :id="`project-main-image-${index}-filter`">
        <feColorMatrix type="matrix" 
          result="red_"
          values="4 0 0 0 0
                  0 0 0 0 0 
                  0 0 1 0 0 
                  0 0 0 1 0"/>
        <feOffset in="red_" dx="4" dy="4" result="red"/>
        <feColorMatrix type="matrix" 
          in="SourceGraphic"
          result="blue_"
          values="0 0 0 0 0
                  0 3 0 0 0 
                  0 0 10 0 0 
                  0 0 0 1 0"/>
        <feOffset in="blue_" dx="-2" dy="-6" result="blue"/>    
        <feBlend mode="screen" in="red" in2="blue"/>
      </filter>
    </svg>

    <div 
      v-for="(image, nestedIndex) in reorderedImages"
      :key="image.id"
      class="project-main-image__image-wrapper"
      :mask="`url(#project-main-image-${index}-mask)`"
      :style="{
        'mask-image': `url(#project-main-image-${index}-mask)`,
        'filter': `url(#project-main-image-${index}-filter)`
      }">
      <CustomPicture 
        :pictureDataDefault="image"
        :loading="index < 3 ? 'eager' : loadAssets"
        :format="imageFormat(nestedIndex)"
        :isCover="true"
        class="project-main-image__image" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/molecules/project-main-image" as *;
</style>
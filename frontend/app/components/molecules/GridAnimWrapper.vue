<script lang="ts" setup>
import { gsap } from "gsap";

const props = defineProps<{ 
  index: number
}>()
const emit = defineEmits(["gridAnimTimeline"])

const createCells = () => {
  if (!svgMaskGroup.value || !gridAnimWrapper.value) return null;

  svgMaskGroup.value.innerHTML = '';

  const width = gridAnimWrapper.value.getBoundingClientRect().width;
  const height = gridAnimWrapper.value.getBoundingClientRect().height;
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
  if (!gridAnimWrapper.value || !svgMaskElement.value || !svgMaskRect.value) return null;

  const width = gridAnimWrapper.value.getBoundingClientRect().width;
  const height = gridAnimWrapper.value.getBoundingClientRect().height;

  svgMaskElement.value.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svgMaskRect.value.setAttribute('width', width.toString());
  svgMaskRect.value.setAttribute('height', height.toString());
}

const gridAnimWrapper = useTemplateRef('gridAnimWrapper')
const svgMaskElement = useTemplateRef('svgMaskElement')
const svgMaskGroup = useTemplateRef('svgMaskGroup')
const svgMaskRect = useTemplateRef('svgMaskRect')
const maskCells = ref<SVGRectElement[]>([])

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }

  const timeline = gsap.timeline({
    paused: true
  })

  timeline
    .from(gridAnimWrapper.value, {
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
    .to(context.selector?.('.grid-anim__filter feOffset'), {
      attr: {
        dx: 0,
        dy: 0
      },
      duration: .5,
      ease: "back.in(2)",
    }, '<')
    .to(context.selector?.('.grid-anim__filter feColorMatrix'), {
      attr: {
        values: `1 0 0 0 0
              0 1 0 0 0 
              0 0 1 0 0 
              0 0 0 1 0`
      },
      duration: .33,
      ease: 'sine.inOut'
    }, '-=100%')
    .set(context.selector?.('.grid-anim__filter feBlend'), {
      attr: {
        mode: 'normal'
      }
    })

  emit("gridAnimTimeline", timeline);
}, gridAnimWrapper)

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
    ref="gridAnimWrapper"
    class="grid-anim"
    :style="{
      'mask-image': `url(#grid-anim-${index}-mask)`,
      'filter': `url(#grid-anim-${index}-filter)`
    }">
    <svg
      ref="svgMaskElement"
      class="grid-anim__mask"
      viewBox="0 0 100 100"
      preserveAspectRatio="none">
      <defs>
        <mask :id="`grid-anim-${index}-mask`" maskUnits="userSpaceOnUse">
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
  
    <svg width="0" height="0" class="grid-anim__filter">
      <filter :id="`grid-anim-${index}-filter`">
        <feColorMatrix type="matrix" 
          result="red_"
          values="3 0 0 0 0
                  0 0 0 0 0 
                  0 0 1 0 0 
                  0 0 0 1 0"/>
        <feOffset in="red_" dx="4" dy="4" result="red"/>
        <feColorMatrix type="matrix" 
          in="SourceGraphic"
          result="blue_"
          values="0 0 0 0 0
                  0 2 0 0 0 
                  0 0 4 0 0 
                  0 0 0 1 0"/>
        <feOffset in="blue_" dx="-4" dy="-4" result="blue"/>    
        <feBlend mode="screen" in="red" in2="blue"/>
      </filter>
    </svg>
    
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/components/molecules/grid-anim.scss' as *;
</style>
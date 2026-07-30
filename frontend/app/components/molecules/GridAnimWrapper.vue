<script lang="ts" setup>
import { gsap } from "gsap";

const props = defineProps<{ 
  index: number
  customGridAppearDuration?: number
}>()
const emit = defineEmits(["gridAnimTimeline"])

const masksSettings = [
  {
    gradient: 'conic-gradient(at 3rem 3rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '0 0',
    size: '12rem 12rem'
  },
  {
    gradient: 'conic-gradient(at 6rem 6rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '0 6rem',
    size: '24rem 48rem'
  },
  {
    gradient: 'conic-gradient(at 3rem 3rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '3rem 3rem',
    size: '12rem 12rem'
  },
  {
    gradient: 'conic-gradient(at 9rem 3rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '3rem 12rem',
    size: '24rem 6rem'
  },
  {
    gradient: 'conic-gradient(at 6rem 6rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '6rem 0',
    size: '12rem 12rem'
  },
  {
    gradient: 'conic-gradient(at 3rem 3rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '3rem 12rem',
    size: '12rem 12rem'
  },
  {
    gradient: 'conic-gradient(at 3rem 3rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '6rem 6rem',
    size: '12rem 12rem'
  },
  {
    gradient: 'conic-gradient(at 6rem 6rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '6rem 0',
    size: '12rem 12rem'
  },
  {
    gradient: 'conic-gradient(at 6rem 6rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '3rem 3rem',
    size: '24rem 24rem'
  },
  {
    gradient: 'conic-gradient(at 6rem 3rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '6rem 3rem',
    size: '12rem 12rem'
  },
  {
    gradient: 'conic-gradient(at 3rem 6rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '0 0',
    size: '12rem 12rem'
  },
  {
    gradient: 'conic-gradient(at 6rem 6rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '0 0',
    size: '12rem 12rem'
  },
  {
    gradient: 'conic-gradient(at 3rem 3rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '3rem 3rem',
    size: '6rem 6rem'
  },
  {
    gradient: 'conic-gradient(at 6rem 6rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '6rem 6rem',
    size: '24rem 24rem'
  },
  {
    gradient: 'conic-gradient(at 6rem 6rem, #000000 75%, rgba(0, 0, 0, 0.25) 0%)',
    position: '0 0',
    size: '12rem 12rem'
  },
]
const masksImgKeyframes: string[] = []

const gridAnimWrapper = useTemplateRef('gridAnimWrapper')

for (let index = 0; index <= masksSettings.length; index++) {
  masksImgKeyframes.push(masksSettings.slice(0, masksSettings.length - index).map((mask) => mask.gradient).join(','))
}

useGSAP((isReducedMotion, context) => {
  const timeline = gsap.timeline({
    paused: true
  })

  emit("gridAnimTimeline", timeline);

  if (isReducedMotion) {
    timeline
      .set(gridAnimWrapper.value, {
        filter: 'none'
      })
      .play(0)

    return
  }

  gsap
    .set(context.selector?.('.grid-anim__inner'), {
      maskImage: masksSettings.map((mask) => mask.gradient).join(','),
      maskPosition: masksSettings.map((mask) => mask.position).join(','),
      maskSize: masksSettings.map((mask) => mask.size).join(','),
      maskRepeat: 'repeat',
      maskComposite: 'intersect'
    })
    
  timeline
    .from(gridAnimWrapper.value, {
      autoAlpha: 0
    })
    .to(context.selector?.('.grid-anim__inner'), {
      keyframes: {
        maskImage: masksImgKeyframes,
      },
      duration: props.customGridAppearDuration ?? .8,
      ease: 'sine.in',
    }, '<+.1')
    .to(context.selector?.('.grid-anim__filter feOffset'), {
      attr: {
        dx: 0,
        dy: 0
      },
      duration: .5,
      ease: "back.in(2)",
    }, '-=100%')
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
}, gridAnimWrapper)
</script>

<template>
  <div
    ref="gridAnimWrapper"
    class="grid-anim autoalpha"
    :style="{
      'filter': `url(#grid-anim-${index}-filter)`
    }">
    <svg
      width="0"
      height="0"
      class="grid-anim__filter"
      aria-hidden="true"
      focusable="false">
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
    
    <div class="grid-anim__inner">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/molecules/grid-anim.scss' as *;
</style>
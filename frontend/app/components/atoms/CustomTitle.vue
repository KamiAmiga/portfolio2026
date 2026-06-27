<script setup lang="ts">
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import type { ShallowRef } from "vue";

interface Props {
  content: string
  level: 'main' | 'second'
  tag?: 'div' | 'h1' | 'h2' | 'h3' | 'h4'
  enforceVisibility?: boolean
  animSelfTrigger?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  animSelfTrigger: false
})
const emit = defineEmits(["titleTimeline"])
const title = useTemplateRef('title') as ShallowRef<HTMLElement>

const classes = computed(() => {
  return [
    'autoalpha',
    'title',
    `title--${props.level}`,
    props.level === 'main' ? 'font-sans--3xl text-shadow--lg' : 'font-sans--2xl text-shadow--md',
    props.enforceVisibility && props.level === 'main' && 'title--added-bg'
  ].join(' ')
})

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }

  const timeline = gsap.timeline()

  const initTimeline = () => {
    const timeline = gsap.timeline()

    timeline
      .from(title.value, {
        autoAlpha: 0
      })

    return timeline
  }

  const titleMainBackgroundAnim = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline()

    timeline
      .from(gsapContext.selector?.('.title__background'), {
        x: '-100%',
        duration: .3,
        ease: "power2.inOut",
      })

    return timeline
  }

  const titleBorderBoldAnim = (gsapContext: gsap.Context, type: 'main' | 'second') => {
    const timeline = gsap.timeline()

    timeline
      .from(gsapContext.selector?.('.title__border-bold'), {
          scaleX: 0,
          duration: type === 'main' ? .3 : .2,
          ease: "power2.out",
        }, type === 'main' ? '-=25%' : '-=50%')

    return timeline
  }

  const titleBorderLightAnim = (gsapContext: gsap.Context, type: 'main' | 'second') => {
    const timeline = gsap.timeline()

    const settings = type === 'main'
      ? {
        opacity: 0,
        duration: .4,
        ease: "power2.out",
      }
      : {
        scaleX: 0,
        duration: .15,
        ease: "power2.out",
      }

    timeline
      .from(
        gsapContext.selector?.('.title__border-light'),
        settings,
        type === 'main' ? '-=50%' : undefined)

    return timeline
  }

  const titleContentTimeline = (text: Element[], type: 'main' | 'second') => {
    const timeline = gsap.timeline()
    
    timeline
      .from(text, {
        opacity: 0,
        y: '1.5em',
        duration: .3,
        ease: "power2.inOut",
        stagger: .02
      },
    type === 'second' ? '<' : undefined)

    return timeline
  }

  const splitTitle = SplitText.create(context.selector?.('.title__content'), {
    type: props.level === 'main' ? "chars,words" : "words",
    mask: "lines",
    aria: "hidden"
  });

  timeline.add(initTimeline())

  if (!props.animSelfTrigger) {
    timeline.pause()
  }

  if (props.level === 'main') {
    timeline
      .add(titleMainBackgroundAnim(context))
      .add(titleBorderBoldAnim(context, 'main'))
      .add(titleContentTimeline(splitTitle.chars, 'main'))
      .add(titleBorderLightAnim(context, 'main'))
  } else {
    timeline
      .add(titleBorderLightAnim(context, 'second'))
      .add(titleContentTimeline(splitTitle.words, 'second'))
      .add(titleBorderBoldAnim(context, 'second'))
  }
  emit("titleTimeline", timeline);
}, title)
</script>

<template>
  <component :is="tag" :class="classes" ref="title">
    <span class="sr-only">{{ content }}</span>

    <div class="title__content">{{ content }}</div>

    <div v-if="props.level === 'main'" class="title__background" />
    <div class="title__border-light" />
    <div class="title__border-bold" />
  </component>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/atoms/custom-title" as *;
</style>
<script lang="ts" setup>
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import type { HomeCollectionItem, ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{ 
  data: HomeCollectionItem,
  projectsData?: Pick<ProjectsCollectionItem, "title" | "slug" | "cover_image_portrait">[]
}>()

const home = useTemplateRef('home');
const illustrationAnimEnded = ref(false)
const startBuildingAnims = ref(false)
const menuVisible = ref(false)

const evenAndOddProjects = () => {
  if(!props.projectsData?.at(0)) return

  const odd = [];
  const even = [];

  for (let index = 0; index < props.projectsData.length; index++) {
    if (index % 2 === 0) {
      even.push(props.projectsData[index]);
    } else {
      odd.push(props.projectsData[index]);
    }
  }
  
  return { 
    even: even.filter((project) => !!project),
    odd: odd.filter((project) => !!project),
  };
}

const leftBuildingProjectsList = evenAndOddProjects()?.even
const rightBuildingProjectsList = evenAndOddProjects()?.odd

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }

  const titleLargeWordsEase = CustomEase.create("titleLargeWords", ".5, 1, .89, 1")
  
  const timeline = gsap.timeline({
    onComplete: () => {
      illustrationAnimEnded.value = true
    }
  })
  
  const initTimeline = () => {
    const timeline = gsap.timeline()

    timeline
      .from(home.value, {
        autoAlpha: 0
      })

    return timeline
  }

  const logoTimeline = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline()
    const logoWrapper = gsapContext.selector?.('.illustration__logo-wrapper')

    timeline
      .to(logoWrapper, {
        rotation: '+=180deg',
        duration: 0
      })
      .to(logoWrapper, {
        keyframes: [
          {scale: 1, duration: .25, ease: "power2.in"},
          {rotation: '+=180deg', duration: .5, ease: CustomEase.create("logoSpinEase", ".5, 1, .89, 1"), delay: -.2},
          {opacity: 1, duration: .4, ease: "power2.inOut", delay: -.5}
        ],
      })

    return timeline
  }

  const titleTimeline = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline()
    const splitTitleSmall = SplitText.create(gsapContext.selector?.('.title__small'), {
      type: "chars",
      mask: "lines",
      aria: "hidden"
    });
    const splitTitleLarge = SplitText.create(gsapContext.selector?.('.title__large'), {
      type: "words",
      aria: "hidden"
    });

    timeline
      .from(splitTitleSmall.chars, {
        opacity: 0,
        y: '1.5em',
        duration: .25,
        ease: "power2.inOut",
        stagger: .015
      }, '-=.25')
      .from([splitTitleLarge.words.at(0)], {
        opacity: 0,
        y: '-50%',
        duration: .25,
        ease: titleLargeWordsEase
      }, '<')
      .from([splitTitleLarge.words?.at(2)], {
        opacity: 0,
        y: '50%',
        duration: .25,
        ease: titleLargeWordsEase
      }, '<')
      .from([splitTitleLarge.words?.at(1)], {
        width: 0,
        height: 0,
        margin: 0,
        opacity: 0,
        scale: 0,
        duration: .3,
        ease: "back.out(1.5)"
      }, '+=.8')
      .to([splitTitleLarge.words?.at(1)], {
        '--bg-shape-opacity': 1,
        '--bg-shape-rotation': '.125turn',
        duration: .2,
        ease: "power2.out"
      }, '-=80%')

    return timeline
  }

  const groundTimeline = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline({
      onComplete: () => {
        menuVisible.value = true
      }
    })

    timeline
      .from(gsapContext.selector?.('.illustration__ground'), {
        scaleX: 0,
        duration: .3,
        ease: "circ.out"
      }, '-=.05')
      .from(gsapContext.selector?.('.illustration__ground__shape'), {
        opacity: 0,
        y: '-100%',
        duration: .3,
        ease: "circ.out"
      }, '-=66%')

    return timeline
  }

  const cityscapeTimeline = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline()

    timeline
      .to(gsapContext.selector?.('.illustration__cityscape'), {
        opacity: 1,
        duration: .2,
        ease: "power3.inOut",
      })
      .from(gsapContext.selector?.('.illustration__cityscape__shape--back-1, .illustration__cityscape__shape--back-5'), {
        opacity: .5,
        y: '+130%',
        duration: .4,
        ease: "power2.out",
      }, '<')
      .from(gsapContext.selector?.('.illustration__cityscape__shape--back-2, .illustration__cityscape__shape--back-6, .illustration__cityscape__shape--back-4, .illustration__cityscape__shape--back-3'), {
        opacity: .5,
        y: '+130%',
        duration: .35,
        ease: "power2.out",
        stagger: .05
      }, '-=50%')
      .from(gsapContext.selector?.('.illustration__cityscape__shape--front-1, .illustration__cityscape__shape--front-2'), {
        opacity: 0,
        y: '+130%',
        duration: .4,
        ease: "power2.out",
        onStart: () => {
          startBuildingAnims.value = true
        }
      }, '-=50%')
      .from(gsapContext.selector?.('.illustration__cityscape__lights'), {
        opacity: 0,
        duration: .6,
        ease: "power2.out",
      })

    return timeline
  }

  const skylinesTimeline = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline()

    timeline
      .from(gsapContext.selector?.('.illustration__skyline'), {
        clipPath: 'inset(0 0 0 100%)',
        opacity: 0,
        duration: .6,
        ease: "power2.in",
        stagger: .2
      }, '+=.2')

    return timeline
  }
  
  timeline
    .add(initTimeline())
    .add(logoTimeline(context))
    .add(titleTimeline(context))
    .add(groundTimeline(context))
    .add(cityscapeTimeline(context))
    .add(skylinesTimeline(context), '-=.9')
}, home, false)
</script>

<template>
  <div
    ref="home"
    :data-menu-visible="menuVisible"
    class="autoalpha">
    <Grid
      splitting="full"
      :withTopPadding="false"
      :withBottomPadding="false"
      class="title-wrapper">
      <h1 class="title">
        <span class="sr-only">{{ data.title }} {{ data.subtitle }}</span>

        <div class="title__small text-shadow--sm font-sans--md-capitalized">{{ data.title }}</div>
        <div class="title__large text-shadow--lg font-sans--3xl">{{ data.subtitle }}</div>
      </h1>
    </Grid>

    <div class="illustration">
      <div class="illustration-background">
        <div class="illustration__skyline illustration__skyline--1"/>
        <div class="illustration__skyline illustration__skyline--2"/>
        <div class="illustration__skyline illustration__skyline--3"/>
        <div class="illustration__skyline illustration__skyline--4"/>
      </div>

      <div class="illustration-foreground">
        <div class="illustration__cityscape">
          <div class="illustration__cityscape__shape illustration__cityscape__shape--back-1"/>
          <div class="illustration__cityscape__shape illustration__cityscape__shape--back-2"/>
          <div class="illustration__cityscape__shape illustration__cityscape__shape--back-3"/>
          <div class="illustration__cityscape__shape illustration__cityscape__shape--back-4"/>
          <div class="illustration__cityscape__shape illustration__cityscape__shape--back-5"/>
          <div class="illustration__cityscape__shape illustration__cityscape__shape--back-6"/>

          <HomeFrontBuilding 
            v-if="leftBuildingProjectsList?.at(0)"
            class="illustration__cityscape__shape illustration__cityscape__shape--front-1"
            :index="0"
            side="left"
            :canStartAnim="startBuildingAnims"
            :projectsList="leftBuildingProjectsList"
            :projectsAnimSettings="{ duration: 6.5, delay: 0.05 }"
            />
          <HomeFrontBuilding 
            v-if="rightBuildingProjectsList?.at(0)"
            class="illustration__cityscape__shape illustration__cityscape__shape--front-2"
            :index="1"
            side="right"
            :canStartAnim="startBuildingAnims"
            :projectsList="rightBuildingProjectsList"
            :projectsAnimSettings="{ duration: 7, delay: .2 }"
            />

          <div class="illustration__cityscape__lights"/>
        </div>
  
        <div class="illustration__ground">
          <div class="illustration__ground__shape"/>
        </div>
  
        <div class="illustration__logo-wrapper">
          <Logo
            :hasParallaxAnim="true"
            :disableOuterAnim="true"
            :withBlink="startBuildingAnims"
            class="illustration__logo" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '/assets/styles/components/templates/homepage' as *;
</style>
<script lang="ts" setup>
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import type { HomeCollectionItem, ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{ 
  data: HomeCollectionItem,
  projectsData?: Pick<ProjectsCollectionItem, "title" | "slug" | "cover_image_portrait">[]
}>()

interface ParallaxAnims {
  backgroundX: gsap.QuickToFunc
  backgroundY: gsap.QuickToFunc
  foregroundX: gsap.QuickToFunc
  foregroundY: gsap.QuickToFunc
  cityscapeX: gsap.QuickToFunc
  cityscapeY: gsap.QuickToFunc
  ground: gsap.QuickToFunc
}

interface CityscapeNamesAnims {
  leftX: gsap.QuickToFunc
  leftY: gsap.QuickToFunc
  rightX: gsap.QuickToFunc
  rightY: gsap.QuickToFunc
}

const home = useTemplateRef('home');
const mouseParallaxIsActive = ref(false)
const mousePosition = reactive({ x: 0, y: 0 })
const menuVisible = ref(false)
const buildingsAnimInterval: Ref<number | null> = ref(null)
const leftBuildingData = ref(
  {
    current: 0,
    next: 0,
  }
)
const rightBuildingData = ref(
  {
    current: 1,
    next: 1
  }
)

let parallaxAnims: ParallaxAnims | undefined = undefined
let cityscapeNamesAnims: CityscapeNamesAnims | undefined = undefined

const parallaxAnimSettings = {
  delay: 0.1,
  ease: "power2.out",
}

const cityscapeAnimSettings = {
  delay: 0.1,
  ease: "power3.out",
}

const getRandomProjectIndex = () => {
  const randomNumber = Math.floor(Math.random() * (props.projectsData?.length ?? 0))

  if (randomNumber === leftBuildingData.value.current || randomNumber === rightBuildingData.value.current) {
    getRandomProjectIndex()
  }

  return randomNumber
}

const mouseMoveListener = (event: MouseEvent) => {
  if (!mouseParallaxIsActive.value) return

  mousePosition.x = event.clientX
  mousePosition.y = event.clientY

  illustrationParallaxAnim()
}

const frontShapeListener = (event: MouseEvent, shapeSide: 'left' | 'right') => {
  if (!mouseParallaxIsActive.value) return

  frontShapeNameAnim(event.target as HTMLElement, shapeSide)
}

const illustrationParallaxAnim = () => {
  if (!parallaxAnims) return

  parallaxAnims.backgroundX((mousePosition.x / window.innerWidth - 0.5) * 4)
  parallaxAnims.backgroundY((mousePosition.y / window.innerHeight - 0.5) * 4)
  parallaxAnims.foregroundX((mousePosition.x / window.innerWidth - 0.5) * 10)
  parallaxAnims.foregroundY((mousePosition.y / window.innerHeight - 0.5) * 24)
  parallaxAnims.foregroundX((mousePosition.x / window.innerWidth - 0.5) * -20)
  parallaxAnims.foregroundY((mousePosition.y / window.innerHeight) * 16)
  parallaxAnims.ground((mousePosition.x / window.innerWidth - 0.5) * 16)
}

const frontShapeNameAnim = (currentShape: HTMLElement | null, shapeSide: 'left' | 'right') => {
  if (!cityscapeNamesAnims || !currentShape) return

  const currentShapeBoundingBox = currentShape.getBoundingClientRect()
  const newPos = {
    x: Math.max(
        Math.min(
          mousePosition.x - (currentShapeBoundingBox.left),
          currentShapeBoundingBox.right ?? 0
        ),
        0
      ),
    y: Math.max(
        Math.min(
          mousePosition.y - (currentShapeBoundingBox.top ?? 0),
          currentShapeBoundingBox.bottom ?? 0
        ),
        0
      ),
  }
  
  if (shapeSide === 'left') {
    cityscapeNamesAnims.leftX(newPos.x)
    cityscapeNamesAnims.leftY(newPos.y)
  }

  if (shapeSide === 'right') {
    cityscapeNamesAnims.rightX(newPos.x)
    cityscapeNamesAnims.rightY(newPos.y)
  }
}

watchEffect(() => {
  if (!mouseParallaxIsActive.value) return

  parallaxAnims = {
    backgroundX: gsap.quickTo('.illustration-background', "x", parallaxAnimSettings),
    backgroundY: gsap.quickTo('.illustration-background', "y", parallaxAnimSettings),
    foregroundX: gsap.quickTo('.illustration-foreground', "x", parallaxAnimSettings),
    foregroundY: gsap.quickTo('.illustration-foreground', "y", parallaxAnimSettings),
    cityscapeX: gsap.quickTo('.illustration__cityscape__shape', "x", parallaxAnimSettings),
    cityscapeY: gsap.quickTo('.illustration__cityscape__shape', "y", parallaxAnimSettings),
    ground: gsap.quickTo('.illustration__logo, .illustration__ground', "--ground-parallax", parallaxAnimSettings),
  }

  cityscapeNamesAnims = {
    leftX: gsap.quickTo('.illustration__cityscape__shape--front-1 .illustration__cityscape__shape__name', "x", cityscapeAnimSettings),
    leftY: gsap.quickTo('.illustration__cityscape__shape--front-1 .illustration__cityscape__shape__name', "y", cityscapeAnimSettings),
    rightX: gsap.quickTo('.illustration__cityscape__shape--front-2 .illustration__cityscape__shape__name', "x", cityscapeAnimSettings),
    rightY: gsap.quickTo('.illustration__cityscape__shape--front-2 .illustration__cityscape__shape__name', "y", cityscapeAnimSettings),
  }
})

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }

  const titleLargeWordsEase = CustomEase.create("titleLargeWords", ".5, 1, .89, 1")
  
  const timeline = gsap.timeline({
    onComplete: () => {
      mouseParallaxIsActive.value = true

      buildingsAnimInterval.value = setInterval(() => {
        leftBuildingData.value.current = leftBuildingData.value.next
        leftBuildingData.value.next = getRandomProjectIndex()
        
        rightBuildingData.value.current = rightBuildingData.value.next
        rightBuildingData.value.next = getRandomProjectIndex()
      }, 7500)
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

onMounted(() => {
  if (!home.value) return

  leftBuildingData.value.next = getRandomProjectIndex()
  rightBuildingData.value.next = getRandomProjectIndex()
});

onUnmounted(() => {
  if(buildingsAnimInterval.value) {
    clearInterval(buildingsAnimInterval.value)
  }
});
</script>

<template>
  <div
    ref="home"
    @mousemove="mouseMoveListener"
    :data-menu-visible="menuVisible"
    class="autoalpha">
    <Grid
      splitting="full"
      :withTopPadding="false"
      :withBottomPadding="false"
      class="title-wrapper">
      <h1 class="title">
        <span class="sr-only">{{ data.title }} {{ data.subtitle }}</span>

        <div class="title__small font-sans--md-capitalized">{{ data.title }}</div>
        <div class="title__large font-sans--3xl">{{ data.subtitle }}</div>
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
          <div
            class="illustration__cityscape__shape illustration__cityscape__shape--front-1"
            @mousemove="(event) => frontShapeListener(event, 'left')">
            <NuxtLink
              v-if="projectsData?.at(leftBuildingData.next)"
              :to="`/projets/${projectsData?.at(leftBuildingData.next)?.slug}`"
              class="illustration__cityscape__shape__inner">
              <span class="sr-only">Voir le projet : {{ projectsData.at(leftBuildingData.next)?.title }}</span>
              
              <CustomPicture 
                v-for="(project, index) in projectsData"
                :key="project?.slug"
                class="illustration__cityscape__shape__inner__img"
                :class="{
                  'illustration__cityscape__shape__inner__img--next': leftBuildingData.next === index,
                  'illustration__cityscape__shape__inner__img--hidden': leftBuildingData.current !== index && leftBuildingData.next !== index,
                }"
                :pictureDataDefault="project.cover_image_portrait"
                :loading="[leftBuildingData.current, leftBuildingData.next].includes(index) ? 'eager' : 'lazy'"
                format="fourth_grid"
                :isCover="true" />
            </NuxtLink>

            <span
              v-if="projectsData?.at(leftBuildingData.next)?.title"
              aria-hidden="true"
              class="illustration__cityscape__shape__name font-mono--sm">
              {{ projectsData.at(leftBuildingData.next)?.title }}
            </span>
          </div>
          <div
            class="illustration__cityscape__shape illustration__cityscape__shape--front-2"
            @mousemove="(event) => frontShapeListener(event, 'right')">
            <NuxtLink
              v-if="projectsData?.at(rightBuildingData.next)"
              :to="`/projets/${projectsData?.at(rightBuildingData.next)?.slug}`"
              class="illustration__cityscape__shape__inner">
              <span class="sr-only">Voir le projet : {{ projectsData.at(rightBuildingData.next) }}</span>
              
              <CustomPicture 
                v-for="(project, index) in projectsData"
                :key="project?.slug"
                class="illustration__cityscape__shape__inner__img"
                :class="{
                  'illustration__cityscape__shape__inner__img--next': rightBuildingData.next === index,
                  'illustration__cityscape__shape__inner__img--hidden': rightBuildingData.current !== index && rightBuildingData.next !== index,
                }"
                :pictureDataDefault="project.cover_image_portrait"
                :loading="[rightBuildingData.current, rightBuildingData.next].includes(index) ? 'eager' : 'lazy'"
                format="fourth_grid"
                :isCover="true" />
            </NuxtLink>

            <span
              v-if="projectsData?.at(rightBuildingData.next)?.title"
              aria-hidden="true"
              class="illustration__cityscape__shape__name font-mono--sm">
              {{ projectsData.at(rightBuildingData.next)?.title }}
            </span>
          </div>
          <div class="illustration__cityscape__lights"/>
        </div>
  
        <div class="illustration__ground">
          <div class="illustration__ground__shape"/>
        </div>
  
        <div class="illustration__logo-wrapper">
          <Logo class="illustration__logo" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '/assets/styles/components/templates/homepage' as *;
</style>
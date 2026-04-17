<script lang="ts" setup>
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import type { ProjectsCollectionItem, HomeCollectionItem } from "@nuxt/content";

const props = defineProps<{ 
  data: HomeCollectionItem
  projectsData?: Pick<ProjectsCollectionItem, "slug" | "cover_image_portrait">[]
}>()

const home = ref();
const cityScapeWrapper = useTemplateRef('cityScapeWrapper')
const frontCityscapeShape1 = useTemplateRef('cityscapeShape1')
const frontCityscapeShape2 = useTemplateRef('cityscapeShape2')
const mouseParallaxIsActive = ref(false)
const cityScapeAnimComplete = ref(false)
let ctx: gsap.Context;

const titleLargeWordsEase = CustomEase.create("titleLargeWords", ".5, 1, .89, 1")

const mouseMoveParallax = (event: MouseEvent) => {
  if (!mouseParallaxIsActive.value) return

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  gsap
    .to(ctx.selector?.('.illustration-foreground'), {
      x: (mouseX / window.innerWidth - 0.5) * 10,
      y: (mouseY / window.innerHeight - 0.5) * 16,
      delay: 0.2,
      ease: "power3.out",
      overwrite: "auto"
    })

  gsap
    .to(ctx.selector?.('.illustration__cityscape__shape'), {
      x: (mouseX / window.innerWidth - 0.5) * -6,
      y: (mouseY / window.innerHeight) * 16,
      delay: 0.1,
      ease: "power2.out",
      overwrite: "auto"
    })

  gsap
    .to(ctx.selector?.('.illustration__logo-wrapper, .illustration__ground'), {
      x: (mouseX / window.innerWidth - 0.5) * 8,
      delay: 0.1,
      ease: "power2.out",
      overwrite: "auto"
    })
  
  gsap
    .to(ctx.selector?.('.illustration-background'), {
      x: (mouseX / window.innerWidth - 0.5) * 4,
      y: (mouseY / window.innerHeight - 0.5) * 4,
      delay: 0.1,
      ease: "power2.out",
      overwrite: "auto"
    });
}

onMounted(() => {
  const initTimeline = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline()

    timeline
      .from(gsapContext.selector?.('.title, .illustration-background, .illustration__ground, .illustration__cityscape'), {
        autoAlpha: 0
      })
      // .set('.illustration', { perspective: 650 })

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
    const timeline = gsap.timeline()

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
    const timeline = gsap.timeline({
      onComplete: () => {
        cityScapeAnimComplete.value = true
      }
    })

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

  const masterTimeline = gsap.timeline({
    onComplete: () => {
      mouseParallaxIsActive.value = true
    }
  })
  
  ctx = gsap.context((self) => {
    masterTimeline
      .add(initTimeline(self))
      .add(logoTimeline(self))
      .add(titleTimeline(self))
      .add(groundTimeline(self))
      .add(cityscapeTimeline(self))
      .add(skylinesTimeline(self), '-=.9')
  }, home.value);

  // https://tympanus.net/codrops/2025/01/20/vfx-js-webgl-effects-made-easy/
  // https://tympanus.net/codrops/2025/01/22/webgl-shader-techniques-for-dynamic-image-transitions/

  // TODO : refine
  // https://codepen.io/GreenSock/pen/qBzaNQy
  // const outerRX = gsap.quickTo(".illustration-background, .illustration-foreground", "rotationX", { ease: "power3" });
  // const outerRY = gsap.quickTo(".illustration-background, .illustration-foreground", "rotationY", { ease: "power3" });
  // const innerX = gsap.quickTo(".illustration__cityscape, .illustration__logo-wrapper, .illustration__ground", "x", { ease: "power3" });
  // const innerY = gsap.quickTo(".illustration__cityscape, .illustration__logo-wrapper, .illustration__ground", "y", { ease: "power3" });
  // const cityScapeFrontX = gsap.quickTo(".illustration__cityscape__shape--front", "x", { ease: "power3" });
  // const cityScapeFrontY = gsap.quickTo(".illustration__cityscape__shape--front", "y", { ease: "power3" });
  // const cityScapeBackX = gsap.quickTo(".illustration__cityscape__shape--back", "x", { ease: "power3" });
  // const cityScapeBackY = gsap.quickTo(".illustration__cityscape__shape--back", "y", { ease: "power3" });

  // document.addEventListener("pointermove", (e) => {
  //   outerRX(gsap.utils.interpolate(4, -4, e.y / window.innerHeight));
  //   outerRY(gsap.utils.interpolate(-2, 2, e.x / window.innerWidth));
  //   innerX(gsap.utils.interpolate(-8, 8, e.x / window.innerWidth));
  //   innerY(gsap.utils.interpolate(-4, 4, e.y / window.innerHeight));
  //   cityScapeBackX(gsap.utils.interpolate(-4, 4, e.x / window.innerWidth));
  //   cityScapeBackY(gsap.utils.interpolate(0, 16, e.y / window.innerHeight));
  //   cityScapeFrontX(gsap.utils.interpolate(-8, 8, e.x / window.innerWidth));
  //   cityScapeFrontY(gsap.utils.interpolate(0, 24, e.y / window.innerHeight));
  // });

  // document.addEventListener("mousemove", mouseMoveParallax);
});

onUnmounted(() => { 
  ctx.revert();
  // document.removeEventListener("mousemove", mouseMoveParallax);
});
</script>

<template>
  <div ref="home">
    <Grid
      splitting="full"
      :withTopPadding="false"
      :withBottomPadding="false"
      class="title-wrapper">
      <h1 class="title">
        <span class="sr-only">{{ data.title }} {{ data.subtitle }}</span>

        <div class="title__small font-sans--md-capitalized">{{ data.title }}</div>
        <div class="title__large font-sans--2xl">{{ data.subtitle }}</div>
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
        <div class="illustration__cityscape" ref="cityScapeWrapper">
          <div class="illustration__cityscape__shape illustration__cityscape__shape--back illustration__cityscape__shape--back-1"/>
          <div class="illustration__cityscape__shape illustration__cityscape__shape--back illustration__cityscape__shape--back-2"/>
          <div class="illustration__cityscape__shape illustration__cityscape__shape--back illustration__cityscape__shape--back-3"/>
          <div class="illustration__cityscape__shape illustration__cityscape__shape--back illustration__cityscape__shape--back-4"/>
          <div class="illustration__cityscape__shape illustration__cityscape__shape--back illustration__cityscape__shape--back-5"/>
          <div class="illustration__cityscape__shape illustration__cityscape__shape--back illustration__cityscape__shape--back-6"/>
          <div class="illustration__cityscape__shape illustration__cityscape__shape--front illustration__cityscape__shape--front-1" ref="cityscapeShape1"/>
          <div class="illustration__cityscape__shape illustration__cityscape__shape--front illustration__cityscape__shape--front-2" ref="cityscapeShape2" />
          <div class="illustration__cityscape__lights"/>

          <TresCanvas clear-color="#00000000">
            <TresPerspectiveCamera
              :position="[0, 0, 10]"
              :look-at="[0, 0, 0]"
            />

            <HomepageMesh 
              v-if="frontCityscapeShape1 && cityScapeWrapper && cityScapeAnimComplete"
              :cityScapeWrapper="cityScapeWrapper"
              :frontCityscapeShape="frontCityscapeShape1"
              :imgURL="projectsData?.at(0)?.cover_image_portrait.url ?? ''"
              />

            <HomepageMesh 
              v-if="frontCityscapeShape2 && cityScapeWrapper && cityScapeAnimComplete"
              :cityScapeWrapper="cityScapeWrapper"
              :frontCityscapeShape="frontCityscapeShape2"
              :imgURL="projectsData?.at(1)?.cover_image_portrait.url ?? ''"
              />
          </TresCanvas>
        </div>
  
        <div class="illustration__ground">
          <div class="illustration__ground__shape"/>
        </div>
  
        <div class="illustration__logo-wrapper">
          <Logo />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '/assets/styles/components/templates/homepage' as *;
</style>
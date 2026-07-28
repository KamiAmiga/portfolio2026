<script setup lang="ts">
import { gsap } from "gsap";
import { CustomWiggle } from "gsap/CustomWiggle";
import { Draggable } from "gsap/Draggable";
import type { AboutCollectionItem } from '@nuxt/content';

const props = defineProps<{ 
  data: AboutCollectionItem,
}>()

gsap.registerPlugin(Draggable, CustomWiggle)

const headerBackground = useTemplateRef('headerBackground')
const menuVisible = ref(false)
const { transitionState } = useTransitionComposable()
const logoBlink = ref(false)
const logoDraggedCounter = ref(0)

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }

  const logoWrapper = context.selector?.('.about-header__background__logo-wrapper')

  const logoEntranceKeyframes = [
    {scale: 1, duration: .25, ease: "power2.in"},
    {rotation: '+=180deg', duration: .5, ease: "logoSpinEase", delay: -.2},
    {opacity: 1, duration: .4, ease: "power2.inOut", delay: -.5}
  ]

  CustomWiggle.create("logoWiggle", {
    wiggles: 8,
    type:"uniform"
  });

  CustomWiggle.create("logoAngryWiggle", {
    wiggles: 5,
    type:"uniform"
  });

  const draggables = Draggable.create(logoWrapper, {
    bounds: headerBackground.value ?? undefined,
    dragResistance: .5,
    onPress: () => {
      logoBlink.value = false
      gsap.to(
        logoWrapper,
        {
          scale: 1.1,
          '--eye-inner-scale': .85,
          duration: 0.2,
          ease:'power3.inOut'
        }
      )
    },
    onDrag: () => {
      wiggleTimeline.play()
    },
    onRelease: () => {
      logoBlink.value = true
      wiggleTimeline.pause()
      wiggleTimeline.revert()
      gsap.to(
        logoWrapper,
        {
          scale: 1,
          '--eye-inner-scale': 1,
          x:0,
          y:0,
          duration: 0.6,
          ease:'elastic.out(2, .5)',
          onComplete: () => {
            logoDraggedCounter.value++

            if (logoDraggedCounter.value === 5) {
              angryTimeline.play(0)
            }
          }
        }
      )
    },
  });
  
  const timeline = gsap.timeline({
    onComplete: () => {
      menuVisible.value = true
      logoBlink.value = true
      draggables.at(0)?.enable()
    }
  })

  const wiggleTimeline = gsap.timeline({
    paused: true
  })

  const angryTimeline = gsap.timeline({
    paused: true,
    onStart: () => {
      logoBlink.value = false
      draggables.at(0)?.disable()
    },
    onComplete: () => {
      logoDraggedCounter.value = 0
      gsap.delayedCall(5, () => {
        gsap.set(logoWrapper, {
          rotation: '-=180deg',
        })
        gsap.to(logoWrapper, {
          keyframes: logoEntranceKeyframes,
        })
        
        angryTimeline.revert()
        draggables.at(0)?.enable()
      })
    }
  })

  timeline
    .set(logoWrapper, {
      rotation: '+=180deg',
    })
    .from(headerBackground.value, {
      autoAlpha: 0
    })

  wiggleTimeline
    .to(context.selector?.('.logo'), {
      x: 5,
      y: 2,
      rotation: 5,
      ease: "logoWiggle",
      repeat: -1
    });

  angryTimeline
    .to(context.selector?.('.logo'), {
      background: 'var(--color-secondary-darker)'
    })
    .to(context.selector?.('.logo'), {
      scaleY: .7,
      clipPath: 'polygon(0 10%, 100% 50%, 0 90%)',
      ease: 'circ.inOut',
      duration: .2
    }, '<+.1')
    .to(logoWrapper, {
      x: '25%',
      ease: 'logoAngryWiggle',
      duration: .5
    })
    .to(logoWrapper, {
      scale: 0,
      ease: 'back.in(2)',
      duration: .4
    }, '+=.25')

  watchEffect(() => {
    if(transitionState.transitionComplete) {
      timeline
        .to(logoWrapper, {
          keyframes: logoEntranceKeyframes
        })
    }
  })
}, headerBackground, false)
</script>

<template>
<CustomHeader
  title="A propos"
  size="small"
  class="about-header">
  <template v-slot:background>
    <div class="about-header__background autoalpha" ref="headerBackground" :data-menu-visible="menuVisible">
      <div class="about-header__background__skylines about-header__background__skylines--1"/>
      <div class="about-header__background__skylines about-header__background__skylines--2"/>
      <div class="about-header__background__skylines about-header__background__skylines--3"/>
      <div class="about-header__background__logo-wrapper">
        <Logo 
          v-if="headerBackground"
          :hasParallaxAnim="true"
          :mouseParallaxBoundaries="headerBackground"
          :withBlink="logoBlink"
          class="about-header__background__logo"/>
      </div>
    </div>
  </template>
</CustomHeader>

<Grid>
  <RichtextWrapper :withFocus="true">
    <StrapiBlocksText v-if="data?.intro" :nodes="data.intro" />
  </RichtextWrapper>
</Grid>

<Grid>
  <CustomSection v-if="data?.experience" title="Parcours">
    <template v-slot:content>
      <HistoryList :history="data.experience" />
    </template>
  </CustomSection>
</Grid>

<Grid>
  <CustomSection v-if="data?.skills" title="Compétences">
    <template v-slot:content>
      <SkillsList :skills="data.skills" />
    </template>
  </CustomSection>
</Grid>

<Grid splitting="halves">
  <CustomSection v-if="data?.interests" title="Intérêts">
    <template v-slot:content>
      <InterestsList :interests="data.interests" />
    </template>
  </CustomSection>
  
  <CustomSection v-if="data?.social_links" title="Contacts">
    <template v-slot:content>
      <SocialLinksList :social-links="data.social_links"/>
    </template>
  </CustomSection>
</Grid>

<Grid>
  <CustomSection v-if="data?.resume" title="CV">
    <template v-slot:content>
      <ResumeList :resume="data.resume" />
    </template>
  </CustomSection>
</Grid>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/templates/about" as *;
</style>
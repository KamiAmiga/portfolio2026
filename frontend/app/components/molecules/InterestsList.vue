<script setup lang="ts">
import { gsap } from "gsap";
import type { AboutCollectionItem } from '@nuxt/content';

const props = defineProps<{
  interests: AboutCollectionItem["interests"]
}>();

const interestsList = useTemplateRef('interestsList')

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }
  
  const timeline = gsap.timeline({
    defaults: {
      stagger: {
        amount: .6,
        ease: 'power.inOut(1.33)'
      }
    },
    scrollTrigger: {
      trigger: interestsList.value,
      once: true,
    }
  })

  const initTimeline = () => {
    const timeline = gsap.timeline()

    timeline
      .from(interestsList.value, {
        autoAlpha: 0
      })

    return timeline
  }

  const entryTimeline = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline()

    timeline
      .from(gsapContext.selector?.('.interests__center-of-gravity'), {
        scale: .3,
        opacity: 0,
        duration: .4,
        ease: 'back.out(2.5)',
      })
      .from(gsapContext.selector?.('.interests__list__item'), {
        '--base-radius': 0,
        '--scale': .5,
        '--rotate': '-45deg',
        opacity: 0,
        duration: .35,
        ease: 'circ.out',
        stagger: .05
      }, '+=.1')
      .from(gsapContext.selector?.('.interests__list__item__label'), {
        '--translateX': '-.5rem',
        opacity: 0,
        duration: .3,
        ease: 'circ.out',
        stagger: 0
      }, '+=.05')
      .from(interestsList.value, {
        '--opacity': 0,
        duration: .4,
        ease: 'circ.out'
      }, '<+=50%')

    return timeline
  }

  const stillTimeline = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline()

    timeline
    .to(gsapContext.selector?.('.interests__center-of-gravity'), {
        keyframes: {
          scale: [1, 1.1, 1]
        },
        repeat: -1,
        repeatDelay: 2,
        duration: 1,
        ease: 'elastic.out(1.5,1)',
      }, '+=1')

    return timeline
  }

  timeline    
    .add(initTimeline())
    .add(entryTimeline(context))
    .add(stillTimeline(context))
}, interestsList)
</script>

<template>
  <div class="interests autoalpha" ref="interestsList">
    <div class="interests__center-of-gravity">
      <Icon name="heart" size="xl" />
    </div>

    <ul class="interests__list">
      <li
        v-for="(interest, index) in interests"
        :key="interest.id"
        class="interests__list__item"
        :style="{ '--angle': `${(360 / interests.length) * index}deg` }">
        <Icon 
          class="interests__list__item__icon"
          :name="interest.icon_name"
          size="lg" />
        <span class="interests__list__item__label font-mono--sm">{{ interest.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/molecules/interests-list' as *;
</style>
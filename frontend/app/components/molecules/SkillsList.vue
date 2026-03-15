<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AboutCollectionItem } from '@nuxt/content';

const props = defineProps<{
  skills: AboutCollectionItem["skills"]
}>();

const skillsList = ref()
let ctx: gsap.Context;
const skillsSorting = ['language', 'development', 'art', 'web']

const sortedSkills = computed(() => {
  return props.skills.sort((a,b) => {
    const aIndex = skillsSorting.indexOf(a.category)
    const bIndex = skillsSorting.indexOf(b.category)

    if (aIndex < bIndex) {
      return -1
    }

    if (aIndex > bIndex) {
      return 1
    }

    return 0
  })
})

onMounted(() => {
  const initTimeline = () => {
    const timeline = gsap.timeline()

    timeline
      .from(skillsList.value, {
        autoAlpha: 0
      })

    return timeline
  }

  ctx = gsap.context((self) => {
    const timeline = gsap.timeline({
      defaults: {
        stagger: {
          amount: .6,
          ease: 'power.inOut(1.33)'
        }
      }
    })

    timeline    
      .add(initTimeline())
      .from(self.selector?.('.skill-item'), {
        opacity: 0,
        duration: .2,
        ease: 'power2.inOut',
      })
      .from(self.selector?.('.skill-item'), {
        scale: .25,
        duration: .4,
        ease: 'back.out(2.2)',
      }, '<')    

    ScrollTrigger.create({
      trigger: skillsList.value,
      once: true,
      animation: timeline,
    });
  }, skillsList.value)
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<template>
  <ul class="skills-list" ref="skillsList">
    <SkillsListItem v-for="skill in sortedSkills" :key="skill.id" :skill="skill" />
    <li class="skills-list__filler skills-list__filler--1" />
    <li class="skills-list__filler skills-list__filler--2" />
  </ul>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/molecules/skills-list' as *;
</style>
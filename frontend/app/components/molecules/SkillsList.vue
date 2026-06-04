<script setup lang="ts">
import { gsap } from "gsap";
import type { AboutCollectionItem } from '@nuxt/content';

const props = defineProps<{
  skills: AboutCollectionItem["skills"]
}>();

const skillsList = useTemplateRef('skillsList')
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

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }
  
  const timeline = gsap.timeline({
    defaults: {
      stagger: {
        amount: .5,
        ease: 'sine'
      }
    },
    scrollTrigger: {
      trigger: skillsList.value,
      once: true,
    }
  })

  timeline    
    .from(skillsList.value, {
      autoAlpha: 0
    })
    .from(context.selector?.('.skill-item'), {
      opacity: 0,
      duration: .3,
      ease: 'power2.inOut',
    })
    .from(context.selector?.('.skill-item'), {
      scale: .25,
      duration: .4,
      ease: 'back.out(2.5)',
      }, '<')  
}, skillsList)
</script>

<template>
  <ul class="skills-list autoalpha" ref="skillsList">
    <SkillsListItem v-for="skill in sortedSkills" :key="skill.id" :skill="skill" />
    <li class="skills-list__filler skills-list__filler--1" />
    <li class="skills-list__filler skills-list__filler--2" />
  </ul>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/molecules/skills-list' as *;
</style>
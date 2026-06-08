<script lang="ts" setup>
import { gsap } from "gsap";
import type { ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{ 
  year?: ProjectsCollectionItem["year"],
  skills?: ProjectsCollectionItem["skills"]
}>()

const projectStats = useTemplateRef('projectStats')
const matchMedia = gsap.matchMedia()

onMounted(() => {
  if (!projectStats.value) return

  matchMedia.add({
    belowMd: '(max-width: 959px)',
    aboveMd: '(min-width: 960px)',
    reducedMotion: '(prefers-reduced-motion: reduce)'
  }, (context) => {
    const { belowMd, aboveMd, reducedMotion } = context.conditions as {belowMd: boolean, aboveMd: boolean, reducedMotion: boolean}
    let timeline: gsap.core.Timeline
    
    const containerTimeline = () => {
      const timeline = gsap.timeline()

      timeline
        .fromTo(projectStats.value, {
          y: 80,
        }, {
          y: '-8rem',
          duration: .5,
          ease: 'circ.inOut'
        })

      return timeline
    }

    const contentTimeline = (gsapContext: gsap.Context) => {
      const timeline = gsap.timeline()

      timeline
        .from(gsapContext.selector?.('.project-stats__property, .project-stats__value:not(:last-child)'), {
          x: 20,
          opacity: 0,
          duration: .2,
          ease: 'power2.inOut',
          stagger: {
            amount: .2,
            ease: 'sine'
          }
        })
        .from(gsapContext.selector?.('.project-stats__value__skill'), {
          '--icon-shape-rotate': '-90deg',
          opacity: 0,
          duration: .25,
          ease: 'power2.inOut',
          stagger: {
            amount: .3,
            ease: 'sine'
          }
        }, '-=50%')

      return timeline
    }

    if (reducedMotion) {
      return
    }

    timeline = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: projectStats.value,
        onEnter: () => timeline.play(),
        ...aboveMd && {
          onLeaveBack: () => timeline.reverse()
        }
      }
    })

    if (belowMd) {
      timeline.add(contentTimeline(context))
    }

    if (aboveMd) {
      timeline
        .add(containerTimeline())
        .add(contentTimeline(context))
    }
  }, projectStats.value)
})

onUnmounted(() => {
  matchMedia.revert()
})
</script>

<template>
  <dl class="project-stats" ref="projectStats">
    <template v-if="year">
      <dt class="project-stats__property font-sans--md-capitalized">Année</dt>
      <dd class="project-stats__value font-mono--sm">{{ year }}</dd>
    </template>
  
    <template v-if="skills">
      <dt class="project-stats__property font-sans--md-capitalized">Outils</dt>
      <dd class="project-stats__value font-mono--sm">
        <ul class="project-stats__value__skills-list">
          <li
            v-for="skill in skills" 
            class="project-stats__value__skill"
            :class="`project-stats__value__skill--${skill.category}`">
            <Icon 
              :name="skill.icon_name"
              class="project-stats__value__skill__icon" />
            {{ skill.name }}
          </li>
        </ul>
      </dd>
    </template>
  </dl>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/molecules/project-stats' as *;
</style>
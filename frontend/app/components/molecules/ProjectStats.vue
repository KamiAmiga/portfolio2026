<script lang="ts" setup>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from 'lenis/vue';
import type { ProjectsCollectionItem } from "@nuxt/content";

const props = defineProps<{ 
  year?: ProjectsCollectionItem["year"],
  skills?: ProjectsCollectionItem["skills"]
}>()

const projectStats = useTemplateRef('projectStats')
const lenis = useLenis()
const matchMedia = gsap.matchMedia()

watchEffect((onInvalidate) => {
  if (!lenis.value) return

  lenis.value.on('scroll', ScrollTrigger.update)

  function update(time:number) {
    lenis.value?.raf(time * 1000)
  }
  gsap.ticker.add(update)

  gsap.ticker.lagSmoothing(0)

  onInvalidate(() => {
    gsap.ticker.remove(update)
  })
})

onMounted(() => {
  if (!projectStats.value) return

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

  let timeline: gsap.core.Timeline

  matchMedia.add({
    belowMd: '(max-width: 959px)',
    aboveMd: '(min-width: 960px)'
  }, (context) => {
    const { belowMd, aboveMd } = context.conditions as {belowMd: boolean, aboveMd: boolean};

    if (belowMd) {
      timeline = gsap.timeline({paused: true})
        .add(contentTimeline(context))
    }

    if (aboveMd) {
      timeline = gsap.timeline({paused: true})
        .add(containerTimeline())
        .add(contentTimeline(context))
    }
    
    ScrollTrigger.create({
      trigger: projectStats.value,
      start: "top bottom",
      onEnter: () => timeline.play(),
      ...aboveMd && {
        onLeaveBack: () => timeline.reverse()
      }
    });
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
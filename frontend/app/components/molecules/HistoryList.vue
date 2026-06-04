<script setup lang="ts">
import { gsap } from "gsap";
import type { AboutCollectionItem } from '@nuxt/content';

const props = defineProps<{
  history: AboutCollectionItem["experience"]
}>();

type HistoryItem = AboutCollectionItem["experience"][number]

const historyList = useTemplateRef('historyList')

const formatHistoryDateAndPlace = (item: Partial<Pick<HistoryItem, 'place' | 'date'>>) => {
  if (!item.place) return item.date

  return `${item.place}, ${item.date}`
}

const isJunctionItem = (currentIndex: number, currentCategory: string) => {
  return currentCategory !== props.history[currentIndex + 1]?.category 
    && currentIndex < props.history.length - 1 
    && currentIndex !== 0
}

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }
  
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: historyList.value,
      once: true,
    }
  })

  const iconsTimeline = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline()

    timeline
      .from(gsapContext.selector?.('.history-list__item__icon'), {
        rotate: '30deg',
        scale: 0,
        ease: 'back.out(2.2)',
        stagger: {
          amount: .4,
          ease: 'power1'
        }
      })
      .from(gsapContext.selector?.('.history-list__item__icon'), {
        opacity: 0,
        duration: .2,
        ease: "power2.in",
      }, '<')

    return timeline
  }

  const descriptionsTimeline = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline({duration: .4})

    timeline
      .from(gsapContext.selector?.('.history-list__item__description'), {
        opacity: 0,
        ease: "power2",
      })
      .to(gsapContext.selector?.('.history-list__item__description'), {
        '--translate': 0,
        ease: "power3",
      }, '<-.1')

    return timeline
  }

  timeline    
    .from(historyList.value, {
      autoAlpha: 0
    })
    .to(historyList.value, {
      '--inset-block-end': 0,
      duration: .6,
      ease: 'power3.out'
    })
    .add(iconsTimeline(context), '-=33%')
    .add(descriptionsTimeline(context), '-=50%')
}, historyList)
</script>

<template>
  <ul class="history-list autoalpha" :style="{ '--history-length': history.length }" ref="historyList">
    <li 
      v-for="(historyItem, index) in history"
      :key="historyItem.id"
      class="history-list__item"
      :class="[
          'history-list__item--' + historyItem.category,
          { 'history-list__item--junction': isJunctionItem(index, historyItem.category) }
        ]">
      <span class="history-list__item__icon">
        <Icon :name="historyItem.category === 'school' ? 'scholar' : 'bag'" size="md" />
      </span>

      <div class="history-list__item__description-wrapper">
        <div class="history-list__item__description">
          <h3 class="font-sans font-sans--base-bold">{{ historyItem.name }}</h3>
    
          <div v-if="historyItem.place || historyItem.date" class="font-mono font-mono--sm">
            {{ formatHistoryDateAndPlace({place: historyItem.place, date: historyItem.date}) }}
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/molecules/history-list' as *;
</style>
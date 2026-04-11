<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AboutCollectionItem } from '@nuxt/content';

const props = defineProps<{
  history: AboutCollectionItem["experience"]
}>();

type HistoryItem = AboutCollectionItem["experience"][number]

const historyList = ref()
let ctx: gsap.Context;

const formatHistoryDateAndPlace = (item: Partial<Pick<HistoryItem, 'place' | 'date'>>) => {
  if (!item.place) return item.date

  return `${item.place}, ${item.date}`
}

const isJunctionItem = (currentIndex: number, currentCategory: string) => {
  return currentCategory !== props.history[currentIndex + 1]?.category 
    && currentIndex < props.history.length - 1 
    && currentIndex !== 0
}

onMounted(() => {
  const initTimeline = () => {
    const timeline = gsap.timeline()

    timeline
      .from(historyList.value, {
        autoAlpha: 0
      })

    return timeline
  }

  ctx = gsap.context((self) => {
    const timeline = gsap.timeline()

    timeline    
      .add(initTimeline())
      .to(historyList.value, {
        '--inset-block-end': 0,
        duration: .75,
        ease: 'power3.out'
      })
      .from(self.selector?.('.history-list__item'), {
        opacity: 0,
        duration: .5,
        ease: "power2.out",
      }, '<')
      .from(self.selector?.('.history-list__item__icon'), {
        rotate: '30deg',
        scale: 0,
        ease: 'back.out(2.2)',
        stagger: {
          amount: .5,
          ease: 'power1'
        }
      })
      .from(self.selector?.('.history-list__item__icon'), {
        opacity: 0,
        duration: .3,
        ease: "power2.in",
      }, '<')
      .from(self.selector?.('.history-list__item__description'), {
        opacity: 0,
        duration: .4,
        ease: "power2",
      })
      .to(self.selector?.('.history-list__item__description'), {
        '--translate': 0,
        duration: .4,
        ease: "power3",
      }, '<-.1')

    ScrollTrigger.create({
      trigger: historyList.value,
      once: true,
      animation: timeline,
    });
  }, historyList.value)
})

onUnmounted(() => {
  ctx.revert()
})
</script>

<template>
  <ul class="history-list" :style="{ '--history-length': history.length }" ref="historyList">
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
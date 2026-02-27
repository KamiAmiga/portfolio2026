<script setup lang="ts">
import { useSplitByChar } from '~/composables/splitText';

interface Props {
  content: string
  level: 'main' | 'second'
  tag?: 'div' | 'h1' | 'h2' | 'h3' | 'h4'
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div' 
})

const classes = computed(() => {
  return [
    'title',
    `title--${props.level}`,
    props.level === 'main' ? 'font-sans--2xl' : 'font-sans--xl',
  ].join(' ')
})

const splittedTitle = props.level === 'main' 
  ? useSplitByChar(props.content) 
  : useSplitByWord(props.content)
</script>

<template>
  <component :is="tag" :class="classes">
    <span class="sr-only">{{ content }}</span>

    <template
      v-for="segment in splittedTitle"
      :key="segment.index">
      <template v-if="segment.isSpace">&ensp;</template>

      <div
        v-else
        :style="typeof segment.animDelay === 'number' 
          ? `--delay: ${segment.animDelay}s` 
          : undefined"
        aria-hidden="true"
        class="title__split-wrapper">
        <template v-if="segment.charsArray">
          <span 
            v-for="char in segment.charsArray"
            :key="char.index"
            :style="typeof char.animDelay === 'number' 
              ? `--delay: ${char.animDelay}s` 
              : undefined"
            class="title__split">
            {{ char.segment }}
          </span>
        </template>

        <span v-else class="title__split">
          {{ segment.segment }}
        </span>
      </div>
    </template>
  </component>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/components/atoms/custom-title";
</style>
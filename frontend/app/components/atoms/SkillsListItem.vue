<script setup lang="ts">
interface Skill {
  id: number
  name: string
  level: number
  category: string
  icon_name: string
}

const props = defineProps<{
  skill: Skill
}>();
</script>

<template>
  <li class="skill-item" :class="`skill-item--${skill.category}`">
    <Icon class="skill-item__main-icon" size="lg" :name="skill.icon_name" />
    <div>{{ skill.name }}</div>

    <template v-if="skill.level">
      <template v-if="skill.level == 1">
        <span class="sr-only">Niveau correct</span>
        <Icon class="skill-item__level icon" name="star" />
      </template>

      <template v-else>
        <span class="sr-only">Bon niveau</span>
        <Icon class="skill-item__level icon" name="stars" />
      </template>
    </template>
  </li>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/components/atoms/skills-list-item' as *;
</style>
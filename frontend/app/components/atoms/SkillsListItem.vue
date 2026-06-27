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
    <div class="text-shadow--sm">{{ skill.name }}</div>

    <template v-if="skill.level">
      <Icon
        class="skill-item__level icon"
        :name="skill.level == 1 ? 'star' : 'stars'"
        :ariaLabel="skill.level == 1 ? 'Niveau correct' : 'Bon niveau'" />
    </template>
  </li>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/components/atoms/skills-list-item' as *;
</style>
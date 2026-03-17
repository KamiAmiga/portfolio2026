<script setup lang="ts">
import type { AboutCollectionItem } from '@nuxt/content';

const props = defineProps<{ 
  data: AboutCollectionItem,
}>()
</script>

<template>
<CustomHeader title="A propos" />

<Grid>
  <StrapiBlocksText v-if="data?.intro" :nodes="data.intro" />
</Grid>

<Grid>
  <custom-section v-if="data?.experience" title="Parcours">
    <template v-slot:content>
      <ul>
        <li 
          v-for="historyItem in data.experience"
          :key="historyItem.id">
          <Icon :name="historyItem.category === 'school' ? 'scholar' : 'bag'" />
          <h3>{{ historyItem.name }}</h3>
          <div v-if="historyItem.place">{{ historyItem.place }}</div>
          <div v-if="historyItem.date">{{ historyItem.date }}</div>
        </li>
      </ul>
    </template>
  </custom-section>
</Grid>

<Grid>
  <custom-section v-if="data?.skills" title="Compétences">
    <template v-slot:content>
      <SkillsList :skills="data.skills" />
    </template>
  </custom-section>
</Grid>

<Grid splitting="halves">
  <custom-section v-if="data?.interests" title="Intérêts">
    <template>
      <ul>
        <li v-for="interest in data?.interests"
          :key="interest.id">
          <Icon :name="interest.icon_name" />
          <div>{{ interest.name }}</div>
        </li>
      </ul>
    </template>
  </custom-section>
  
  <custom-section v-if="data?.social_links" title="Contacts">
    <template v-slot:content>
      <SocialLinksList :social-links="data.social_links"/>
    </template>
  </custom-section>
</Grid>
</template>

<style lang="scss" scoped>
</style>
<script setup lang="ts">
import CustomHeader from '~/components/organisms/CustomHeader.vue';

const { data: aboutData } = await useAsyncData('about', () => queryCollection('about').first())

if (!aboutData.value) {
  throw createError({
    status: 404,
    statusText: 'Page Not Found',
  })
}

const seoMeta = aboutData?.value?.seo

if (seoMeta) {  
  useSeoMeta({
    title: seoMeta.metaTitle,
    description: seoMeta.metaDescription,
    ogTitle: seoMeta.metaTitle ?? '',
    ogDescription: seoMeta.metaDescription ?? '',
  })
}
</script>

<template>
  <CustomHeader title="A propos" />

  <StrapiBlocksText v-if="aboutData?.intro" :nodes="aboutData.intro" />

  <custom-section v-if="aboutData?.experience" title="Parcours">
    <template v-slot:content>
      <ul>
        <li 
          v-for="historyItem in aboutData.experience"
          :key="historyItem.id">
          <Icon :name="historyItem.category === 'school' ? 'scholar' : 'bag'" />
          <h3>{{ historyItem.name }}</h3>
          <div v-if="historyItem.place">{{ historyItem.place }}</div>
          <div v-if="historyItem.date">{{ historyItem.date }}</div>
        </li>
      </ul>
    </template>
  </custom-section>

  <custom-section v-if="aboutData?.skills" title="Compétences">
    <template v-slot:content>
      <ul>
        <li
          v-for="skill in aboutData.skills"
          :key="skill.id">
          <Icon :name="skill.icon_name" />
          <div>{{ skill.name }}</div>
        </li>
      </ul>
    </template>
  </custom-section>

  <custom-section v-if="aboutData?.interests" title="Intérêts">
    <template>
      <ul>
        <li v-for="interest in aboutData?.interests"
          :key="interest.id">
          <Icon :name="interest.icon_name" />
          <div>{{ interest.name }}</div>
        </li>
      </ul>
    </template>
  </custom-section>

  <custom-section v-if="aboutData?.social_links" title="Contacts">
    <template v-slot:content>
      <ul>
        <li v-for="link in aboutData?.social_links"
          :key="link.id">
          <a :href="link.url" target="_blank" :aria-label="`${link.name} - nouvel onglet`">
            <Icon :name="link.icon_name" />
            <div>{{ link.name }}</div>
          </a>
        </li>
      </ul>
    </template>
  </custom-section>
</template>
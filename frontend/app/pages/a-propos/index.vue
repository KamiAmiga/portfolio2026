<script setup lang="ts">
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
  <h1>A propos</h1>

  <StrapiBlocksText v-if="aboutData?.intro" :nodes="aboutData.intro" />

  <section v-if="aboutData?.experience">
    <h2>Parcours</h2>

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
  </section>

  <section v-if="aboutData?.skills">
    <h2>Compétences</h2>

    <ul>
      <li
        v-for="skill in aboutData.skills"
        :key="skill.id">
        <Icon :name="skill.icon_name" />
        <div>{{ skill.name }}</div>
      </li>
    </ul>
  </section>

  <section v-if="aboutData?.interests">
    <h2>Intérêts</h2>

    <ul>
      <li v-for="interest in aboutData?.interests"
        :key="interest.id">
        <Icon :name="interest.icon_name" />
        <div>{{ interest.name }}</div>
      </li>
    </ul>
  </section>

  <section v-if="aboutData?.social_links">
    <h2>Contacts</h2>

    <ul>
      <li v-for="link in aboutData?.social_links"
        :key="link.id">
        <a :href="link.url" target="_blank" :aria-label="`${link.name} - nouvel onglet`">
          <Icon :name="link.icon_name" />
          <div>{{ link.name }}</div>
        </a>
      </li>
    </ul>
  </section>
</template>
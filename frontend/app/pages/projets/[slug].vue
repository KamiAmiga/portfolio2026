<script setup lang="ts">
import type { ContentNavigationItem, ProjectsCollectionItem } from '@nuxt/content';
import transitionConfig from '../../helpers/pageTransitionConfig';

type SurroundingProject = ContentNavigationItem & Pick<ProjectsCollectionItem, 'slug' | 'cover_image_landscape'>

const props = defineProps<{ 
  id: string
}>()

const route = useRoute()
const { data: projectData } = await useAsyncData(route.path, () => {
  return queryCollection('projects').path(route.path).first()
})

const slugString = Array.isArray(route.params?.slug) 
  ? route.params.slug.join('/')
  : route.params?.slug

if (!projectData.value || !slugString) {
  throw createError({
    status: 404,
    statusText: `Oups, cette page n'existe pas !`,
  })
}

definePageMeta({ 
  pageTransition: transitionConfig
})

const { data: surroundings } = await useAsyncData(
  slugString,
  () => {
    return queryCollectionItemSurroundings(
        'projects',
        route.path,
        { 
          before: 0,
          fields: [
            'title',
            'slug',
            'cover_image_landscape',
          ]
        }
      )
      .order('year', 'DESC')
  }
)

useSeoFromPageData(projectData?.value?.seo)
</script>


<template>
  <main role="main" :id="id">
    <ProjectPageTemplate
      v-if="projectData"
      :data="projectData"
      :nextProject="(surroundings?.at(0) as unknown as (SurroundingProject | undefined))" />
  </main>
</template>
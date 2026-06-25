<script setup lang="ts">
import { gsap } from "gsap";
import type { ProjectsCollectionItem } from "@nuxt/content";
import type { MeshData } from "../molecules/ProjectsListPageMesh.vue";

const props = defineProps<{ 
  images: ProjectsCollectionItem['main_images']
}>()

const imgsList = useTemplateRef('imgs')
const smoothScrollWrapper = useTemplateRef('smoothScrollWrapper')
const planes: Ref<(MeshData & {id: string})[]> = ref([])

useGSAP((isReducedMotion) => {
  if (isReducedMotion) {
    return
  }

  imgsList.value?.forEach((img, index) => {
    gsap.from(img, {
      scrollTrigger: {
        trigger: img,
        onEnter: () => {
          if (planes.value?.[index]) {
            planes.value[index].isIntersecting = true
          }
        },
      },
    });
  });
}, smoothScrollWrapper)

const updatePlanesPosition = () => {
  imgsList.value?.forEach((img, index) => {
    if (!img) return
    
    const clientRect = img.querySelector('img')?.getBoundingClientRect()

    if (planes.value[index] && clientRect) {
      planes.value[index].x = clientRect.left
      planes.value[index].y = -clientRect.top
    }
  })
}

const updatePlanesSize = () => {
  imgsList.value?.forEach((img, index) => {
    if (!img) return
    
    const clientRect = img.querySelector('img')?.getBoundingClientRect()

    if (planes.value[index] && clientRect) {
      planes.value[index].width = clientRect.width
      planes.value[index].height = clientRect.height
    }
  })
}

const handleScroll = () => {
  updatePlanesPosition()
}

const handleResize = () => {
  updatePlanesSize()
  updatePlanesPosition()
}

onMounted(() => {
  imgsList.value?.map((img, index) => {
    const imgEl = img.querySelector('img')

    if (!imgEl) return

    planes.value.push({
      id: `plane-${index}`,
      width: imgEl.getBoundingClientRect().width ?? 0,
      height: imgEl.getBoundingClientRect().height ?? 0,
      x: imgEl.getBoundingClientRect().x ?? 0,
      y: imgEl.getBoundingClientRect().y ?? 0,
      img: {
        url: imgEl.src ?? '',
        width: imgEl.width ?? 0,
        height: imgEl.height ?? 0,
      },
      isIntersecting: false
    })
  })
  
  globalThis.addEventListener('scroll', handleScroll)
  globalThis.addEventListener('resize', handleResize)

  updatePlanesSize()
  updatePlanesPosition()
})

onUnmounted(() => {
  globalThis.removeEventListener('scroll', handleScroll)
  globalThis.removeEventListener('resize', handleResize)
})
</script>

<template>
  <TresCanvas window-size clear-color="#00000000">
    <TresPerspectiveCamera
      :position="[0, 0, 10]"
      :look-at="[0, 0, 0]"
    />

    <template v-for="plane in planes" :key="plane.id">
      <ProjectsListPageMesh 
        v-if="Boolean(plane.img.url)"
        :img="plane.img"
        :width="plane.width"
        :height="plane.height"
        :x="plane.x"
        :y="plane.y"
        :isIntersecting="plane.isIntersecting"
      />
    </template>
  </TresCanvas>

  <div ref="smoothScrollWrapper">
    <div class="imgs-scroller">
      <section v-for="mainImage in images" :key="mainImage.id" class="imgs-scroller__item">
        <div ref="imgs">
          <CustomPicture 
            v-if="mainImage.images?.[0]"
            :pictureDataDefault="mainImage.images[0]"
            />
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
.imgs-scroller {
  position: relative;
  z-index: 1;

  &__item {
    display: grid;
    grid-template-columns: 15% 1fr 15%;
    padding: var(--spacer-2xl);
    
    > * {
      grid-column-end: span 2;
    }

    &:first-child {
      padding-block-start: 25vh;
    }
    
    &:nth-child(odd) {
      > * {
        grid-column-start: 2;
      }
    }

    img {
      opacity: 0;
    }
  }
}
</style>
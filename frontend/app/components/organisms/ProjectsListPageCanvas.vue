<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const { data: projectsData } = await useAsyncData(
  'projects-data',
  () => queryCollection('projects')
    .order('year', 'DESC')
    .select('name', 'cover_image_landscape', 'cover_image_portrait')
    .all()
)

if (!projectsData.value) {
  throw createError({
    status: 404,
    statusText: 'Page Not Found',
  })
}

interface MeshPosition {
  width: number
  height: number
  x: number
  y: number
}

const imgsList = useTemplateRef('imgs')
const planes: Ref<MeshPosition[]> = ref([])
const scrollY = ref(0)
const velocityProxy = ref({ v: 0, s: 0 }) // v = signed, s = strength (0..1)
const smoothScrollWrapper = ref()
let ctx: gsap.Context

const updatePlanesPosition = () => {
  imgsList.value?.forEach((img, index) => {
    if (!img) return
    
    const clientRect = img.getBoundingClientRect()

    if (planes.value[index]) {
      planes.value[index].x = clientRect.left
      planes.value[index].y = -clientRect.top
    }
  })
}

const updatePlanesSize = () => {
  imgsList.value?.forEach((img, index) => {
    if (!img) return
    
    const clientRect = img.getBoundingClientRect()

    if (planes.value[index]) {
      planes.value[index].width = clientRect.width
      planes.value[index].height = clientRect.height
    }
  })
}

const handleScroll = () => {
  scrollY.value = globalThis.scrollY
  updatePlanesPosition()
}

const handleResize = () => {
  updatePlanesSize()
  updatePlanesPosition()
}

onMounted(() => {
  ctx = gsap.context(() => {
    const clamp = gsap.utils.clamp(-2000, 2000);

    // TODO :
    // Move scrollTrigger to ProjectsListPageMesh.vue ?
    // Full copy of shaders from : https://codepen.io/GreenSock/pen/EaVbXeM

    // A single ScrollTrigger to compute velocity and tween back to 0
    ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate(self) {
        const raw = clamp(self.getVelocity()); // px/s-ish
        const norm = raw / 1000; // ~ -1..1
        const strength = Math.min(1, Math.abs(norm));

        if (Math.abs(strength) > Math.abs(velocityProxy.value.s)) {
          velocityProxy.value.v = norm;
          velocityProxy.value.s = strength;
          gsap.to(velocityProxy.value, {
            v: 0,
            s: 0,
            duration: 0.8,
            ease: "sine.inOut",
            overwrite: true
          });
        }
      }
    });
  }, smoothScrollWrapper.value);

  imgsList.value?.map((image) => {
    if (!image) return

    planes.value.push({
      width: image.getBoundingClientRect().width,
      height: image.getBoundingClientRect().height,
      x: image.getBoundingClientRect().x,
      y: image.getBoundingClientRect().y,
    })
  })

  scrollY.value = globalThis.scrollY
  globalThis.addEventListener('scroll', handleScroll)
  globalThis.addEventListener('resize', handleResize)

  updatePlanesSize()
  updatePlanesPosition()
})

onUnmounted(() => {
  globalThis.removeEventListener('scroll', handleScroll)
  globalThis.removeEventListener('resize', handleResize)

  ctx.revert()
})
</script>

<template>
  <TresCanvas window-size clear-color="#00000000">
    <TresPerspectiveCamera
      :position="[0, 0, 10]"
      :look-at="[0, 0, 0]"
    />

    <ProjectsListPageMesh 
      v-for="(plane, index) in planes"
      :width="plane.width"
      :height="plane.height"
      :x="plane.x"
      :y="plane.y"
      :imgURL="projectsData[index].cover_image_landscape.url"
      :target="velocityProxy.v"
      :current="velocityProxy.s"
    />
  </TresCanvas>


  <div ref="smoothScrollWrapper">
    <div class="imgs-scroller">
      <section v-for="project in projectsData" :key="project.name" class="imgs-scroller__item">
        <div ref="imgs">
          <CustomPicture 
            v-if="project.cover_image_landscape"
            :pictureDataDefault="project.cover_image_landscape"
            :pictureDataPortrait="project.cover_image_portrait"
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
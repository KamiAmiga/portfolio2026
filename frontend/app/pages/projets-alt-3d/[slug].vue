<script setup lang="ts">
import * as THREE from 'three'
import vertexShader from '../../assets/shaders/vertexShader.glsl?raw'
import fragmentShader from '../../assets/shaders/fragmentShader.glsl?raw'

definePageMeta({
  layout: 'no-smooth-scroll',
})

const route = useRoute()
const { data: projectData } = await useAsyncData(route.path, () => {
  return queryCollection('projects').path(route.path).first()
})

if (!projectData.value) {
  throw createError({
    status: 404,
    statusText: 'Page Not Found',
  })
}

const { data: surroundings } = await useAsyncData('surround', () => {
  return queryCollectionItemSurroundings(
      'projects',
      route.path,
      { 
        fields: [
          'name',
          'cover_image_landscape',
          'cover_image_portrait'
        ]
      }
    )
    .order('year', 'DESC')
})

/**
 * Smooth scroll setup start
 * To be removed in favour of gsap smoothscroll
 */
// const scrollable = ref()

// let current = 0
// let target = 0
// const ease = .075

// const lerp = (start: number, end: number, t: number) => {
//   return start * (1-t) + end * t
// }

// const smoothScroll = () => {
//   target = window.scrollY
//   current = lerp(current, target, ease)
//   scrollable.value.style.transform = `translate3d(0, ${-current}px, 0)`
// }
/**
 * Smooth scroll setup end
 * To be removed in favour of gsap smoothscroll
 */


/**
 * ThreeJS setup start
 * To be removed in favour of ThreeJS journey structure
 */
class EffectCanvas {
  container: HTMLElement | null
  images: Element[]
  meshItems: MeshItem[]
  scene?: THREE.Scene
  camera?: THREE.PerspectiveCamera
  renderer?: THREE.WebGLRenderer

  constructor() {
    this.container = document.querySelector('.test-rgb')
    this.images = [...document.querySelectorAll('.test-rgb img')]
    this.meshItems = []
    this.setupCamera()
    this.createMeshItems()
    this.render()
  }

  get viewport() {
    const width = window.innerWidth
    const height = window.innerHeight
    const aspectRatio = width / height

    return {
      width,
      height,
      aspectRatio
    }
  }

  setupCamera() {
    window.addEventListener('resize', this.onWindowResize.bind(this))
    this.scene = new THREE.Scene()

    const perspective = 1000
    const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI
    this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 1, 1000)
    this.camera.position.set(0,0, perspective)

    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
    this.renderer.setSize(this.viewport.width, this.viewport.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.container?.appendChild(this.renderer.domElement)
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return

    this.camera.aspect = this.viewport.aspectRatio
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.viewport.width, this.viewport.height)
  }

  createMeshItems() {
    if (!this.scene) return

    for (const image of this.images) {
      this.meshItems.push(new MeshItem(image, this.scene))
    }
  }

  render() {
    if (!this.scene || !this.camera) return

    // smoothScroll()

    for (const meshItem of this.meshItems) {
      meshItem.render()
    }

    this.renderer?.render(this.scene, this.camera)

    requestAnimationFrame(this.render.bind(this))
  }
}

class MeshItem{
  element: Element
  scene: THREE.Scene
  offset: THREE.Vector2
  sizes: THREE.Vector2
  geometry?: THREE.PlaneGeometry
  imageTexture?: THREE.Texture<HTMLImageElement>
  uniforms?: { uTexture: { value: THREE.Texture<HTMLImageElement> }; uOffset: { value: THREE.Vector2 }; uAlpha: { value: number } }
  material?: THREE.ShaderMaterial
  mesh?: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial, THREE.Object3DEventMap>

  constructor(element: Element, scene: THREE.Scene) {
    this.element = element
    this.scene = scene
    this.offset = new THREE.Vector2(0, 0)
    this.sizes = new THREE.Vector2(0, 0)
    this.createMesh()
  }

  getDimensions() {
    const {width, height, top, left} = this.element.getBoundingClientRect()
    this.sizes.set(width, height)
    this.offset.set(left - window.innerHeight / 2 + width / 2, -top + window.innerHeight / 2 - height / 2)
  }

  // TODO : https://youtu.be/DdQn82X1G3I?si=d8wTO5A_iXQzNHRP
  createMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 30, 30)
    this.imageTexture = new THREE.TextureLoader().load(this.element.src)
    this.uniforms = {
      uTexture: {value: this.imageTexture},
      uOffset: {
        value: new THREE.Vector2(0, 0),
      },
      uAlpha: {value: 1}
    }
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.getDimensions()
    this.mesh.position.set(this.offset.x, this.offset.y, 0)
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 0)
    this.scene.add(this.mesh)
  }

  render() {
    this.getDimensions()
    this.mesh?.position.set(this.offset.x, this.offset.y, 0)
    this.mesh?.scale.set(this.sizes.x, this.sizes.y, 0)
    // this.uniforms?.uOffset.value.set(0, -(target - current) * .0002)
  }
}
/**
 * ThreeJS setup end
 */

onMounted(() => {
  // document.body.style.height = `${scrollable.value.getBoundingClientRect().height}px`

  new EffectCanvas()
})

// onUnmounted(() => {
//   document.body.style.height = 'auto'
// })
</script>


<template>
  <div v-if="projectData" class="test-rgb">
    <!-- <CustomHeader :title="projectData.name" /> -->

    <div v-if="projectData.main_images" class="test-rgb__scrollable">
      <div class="test-rgb__scrollable__container">
        <div 
          v-for="mainImage in projectData.main_images"
          :key="mainImage.id"
          class="test-rgb__img-container">
          <CustomPicture v-if="mainImage.images?.at(0)" :picture-data-default="mainImage.images[0]" />
        </div>
      </div>
    </div>

    <!-- <div v-if="surroundings?.[0]">
      {{ surroundings[0]?.title }}
    </div>
    <div v-if="surroundings?.[1]">
      {{ surroundings[1]?.title }}
    </div> -->
  </div>
</template>

<style lang="scss">
.test-rgb {
  // position: fixed;
  // width: 100%;
  // height: 100vh;

  // &__scrollable {
  //   position: absolute;
  //   width: 100%;
  //   top: 0;
  //   left: 0;
  //   will-change: transform;
  // }

  &__img-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;

    img {
      position: absolute;
      height: 60%;
      opacity: 0;
    }
  }

  canvas {
    position: fixed;
    z-index: -1;
    top: 0;
    left: 0;
  }
}
</style>
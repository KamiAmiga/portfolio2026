<script setup lang="ts">
import * as THREE from 'three'
import { TextureLoader, type PerspectiveCamera } from 'three'
import vertexShader from '../../assets/shaders/homepage01/vertexShader.glsl?raw'
import fragmentShader from '../../assets/shaders/homepage01/fragmentShader.glsl?raw'

const isHovered = ref(false)

const props = defineProps<{
  cityScapeWrapper: HTMLElement | null
  frontCityscapeShape: HTMLElement | null
  imgURL: string
}>()
const { onBeforeRender } = useLoop()
const { camera } = useTresContext()
const { state: texture, isLoading, error } = useLoader(
  TextureLoader,
  props.imgURL
)

const mesh = shallowRef()
const uniforms = ref()

const sizes = computed(() => {
  const activeCamera = camera.activeCamera.value as PerspectiveCamera

  const fov = activeCamera.fov * (Math.PI / 180)
  const height = activeCamera.position.z * Math.tan(fov / 2) * 2
  const width = height * activeCamera.aspect

  return {
    width,
    height
  }
})

const updatePlanesPosition = () => {
  if(!props.frontCityscapeShape || !props.cityScapeWrapper) return {
    x: 0,
    y: 0
  }

  const origShapeRect = props.frontCityscapeShape.getBoundingClientRect()
  const origWrapper = props.cityScapeWrapper.getBoundingClientRect()

  const origShapeCenterPos = {
    x: origShapeRect.left + origShapeRect.width / 2,
    y: origShapeRect.top + origShapeRect.height / 2
  }

  const origWrapperCenterPos = {
    x: origWrapper.left + origWrapper.width / 2,
    y: origWrapper.top + origWrapper.height / 2
  }

  return {
    x: (origShapeCenterPos.x - origWrapperCenterPos.x) / origWrapper.width,
    y: (origShapeCenterPos.y - origWrapperCenterPos.y) / origWrapper.height
  }
}

const updatePlanesSize = () => {
  if(!props.frontCityscapeShape || !props.cityScapeWrapper) return {
    width: 1,
    height: 1
  }

  const origShapeRect = props.frontCityscapeShape.getBoundingClientRect()
  const origWrapper = props.cityScapeWrapper.getBoundingClientRect()

  return {
    width: (origShapeRect.width / origWrapper.width) * sizes.value.width,
    height: (origShapeRect.height / origWrapper.height) * sizes.value.height
  }
}

const handleResize = () => {
  mesh.value.position.x = updatePlanesPosition().x * sizes.value.width
  mesh.value.position.y = updatePlanesPosition().y * sizes.value.height * -1
  mesh.value?.scale.set(updatePlanesSize().width, updatePlanesSize().height, 1)
}


// Postpone ThreeJS stuff: 
// isolate in a separate branch
// and stabilize a complete version with GSAP anims only
onBeforeRender(() => {
  // https://tympanus.net/codrops/2024/02/07/on-scroll-revealing-webgl-image-explorations/
  // https://real-world-shader.jankohlbach.com/hover/004
  // https://github.com/jankohlbach/real-world-shader/tree/main/src/shader/hover/004
  // uniforms?.value.uOffset.value.set(0)
  // uniforms?.value.uOffset.value.set(0, -((props.target ?? 0) - (props.current ?? 0)) * .0002)
})

onMounted(() => {
  globalThis.addEventListener('resize', handleResize)

  handleResize()

  if (texture) {
    uniforms.value = {
      // uTexture: {value: texture},
      // uOffset: {
      //   value: new THREE.Vector2(0, 0),
      // },
      // uAlpha: {value: 1}

      uTexture: { value: texture },
      uShiftAmount: { value: isHovered ? 0.1 : 0 }
    }
  }
})

onUnmounted(() => {
  globalThis.removeEventListener('resize', handleResize)
});
</script>

<template>
  <TresMesh 
    ref="mesh"
    :position="[
      0,
      0,
      0
    ]"
    @pointer-over="isHovered = true"
    @pointer-out="isHovered = false"
    >
    <TresPlaneGeometry :args="[1, 1]" />
    <TresShaderMaterial
      :vertex-shader="vertexShader"
      :fragment-shader="fragmentShader"
      :uniforms="uniforms" />
    <!-- <TresMeshBasicMaterial v-if="texture" :map="texture" /> -->
  </TresMesh>
</template>
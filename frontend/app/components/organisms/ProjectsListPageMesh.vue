<script setup lang="ts">
import * as THREE from 'three'
import { TextureLoader, type PerspectiveCamera } from 'three'
import vertexShader from '../../assets/shaders/vertexShader.glsl?raw'
import fragmentShader from '../../assets/shaders/fragmentShader.glsl?raw'

const props = defineProps<{
  width: number
  height: number
  x: number
  y: number
  imgURL: string
  target?: number
  current?: number
}>()
const { onBeforeRender } = useLoop()
const { scene, renderer, camera, sizes, events } = useTresContext()
const { state: texture, isLoading, error } = useLoader(
  TextureLoader,
  props.imgURL
)

// TODO : https://docs.tresjs.org/essentials/concepts/reactivity#template-refs-the-preferred-approach
const mesh = ref()
const uniforms = ref()

const sizes2 = computed(() => {
  const activeCamera = camera.activeCamera.value as PerspectiveCamera

  const fov = activeCamera.fov * (Math.PI / 180)
  const height = activeCamera.position.z * Math.tan(fov / 2) * 2
  const width = height * activeCamera.aspect

  return {
    width,
    height
  }
})

const updateMeshPosition = () => {
  const meshPos = {
    x: (props.x * sizes2.value.width) / window.innerWidth,
    y: (props.y * sizes2.value.height) / window.innerHeight,
  }
  
  const meshWidth = (props.width * sizes2.value.width) / window.innerWidth
  const meshHeight = (props.height * sizes2.value.height) / window.innerHeight

  meshPos.x -= sizes2.value.width / 2
  meshPos.x += meshWidth / 2

  meshPos.y -= meshHeight / 2
  meshPos.y += sizes2.value.height / 2

  mesh.value.position.x = meshPos.x
  mesh.value.position.y = meshPos.y
}

const updateMeshSize = () => {
  const width = (props.width * sizes2.value.width) / window.innerWidth
  const height = (props.height * sizes2.value.height) / window.innerHeight

  mesh.value?.scale.set(width, height, 1)
}

onBeforeRender(() => {
  updateMeshSize()
  updateMeshPosition()
  uniforms?.value.uOffset.value.set(0, -((props.target ?? 0) - (props.current ?? 0)) * .0002)
})

onMounted(() => {
  if (texture) {
    uniforms.value = {
      uTexture: {value: texture},
      uOffset: {
        value: new THREE.Vector2(0, 0),
      },
      uAlpha: {value: 1}
    }
  }
})
</script>

<template>
  <TresMesh 
    ref="mesh"
    :position="[
      0,
      0,
      0
    ]">
    <TresPlaneGeometry :args="[1, 1, 1, 1]" />
    <TresShaderMaterial
      :vertex-shader="vertexShader"
      :fragment-shader="fragmentShader"
      :uniforms="uniforms" />
    <!-- <TresMeshBasicMaterial v-if="texture" :map="texture" /> -->
  </TresMesh>
</template>
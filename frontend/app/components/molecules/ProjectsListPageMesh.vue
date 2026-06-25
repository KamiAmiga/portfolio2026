<script setup lang="ts">
import * as THREE from 'three'
import { TextureLoader, type PerspectiveCamera } from 'three'
import { gsap } from "gsap";
import vertexShader from '../../assets/shaders/vertexShader.glsl?raw'
import fragmentShader from '../../assets/shaders/fragmentShader.glsl?raw'

export interface MeshData {
  width: number
  height: number
  x: number
  y: number
  img: {
    url: string
    width: number
    height: number
  }
  isIntersecting: boolean
}

const props = defineProps<
  MeshData
>()
const { onBeforeRender } = useLoop()
const { camera } = useTresContext()
const { state: texture } = useLoader(
  TextureLoader,
  props.img.url
)

const mesh = shallowRef<THREE.Mesh | null>(null)
const uniforms = shallowRef()

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

watch([uniforms, () => props.isIntersecting], () => {
  if (!uniforms.value) return

  if (props.isIntersecting && uniforms) {    
    gsap.to(uniforms.value.uProgress, {
      value: 1,
      duration: 1.2,
      ease: 'none',
    })
  }
})

const updateMeshPosition = () => {
  if (!mesh.value) return
  
  const meshPos = {
    x: (props.x * sizes.value.width) / window.innerWidth,
    y: (props.y * sizes.value.height) / window.innerHeight,
  }
  
  const meshWidth = (props.width * sizes.value.width) / window.innerWidth
  const meshHeight = (props.height * sizes.value.height) / window.innerHeight

  meshPos.x -= sizes.value.width / 2
  meshPos.x += meshWidth / 2

  meshPos.y -= meshHeight / 2
  meshPos.y += sizes.value.height / 2

  mesh.value.position.x = meshPos.x
  mesh.value.position.y = meshPos.y
}

const updateMeshSize = () => {
  if (!mesh.value || !uniforms.value?.uElementSize.value) return

  const width = (props.width * sizes.value.width) / window.innerWidth
  const height = (props.height * sizes.value.height) / window.innerHeight

  mesh.value.scale.set(width, height, 1)
  uniforms.value.uElementSize.value.x = width
  uniforms.value.uElementSize.value.y = height
}

onBeforeRender(() => {
  updateMeshSize()
  updateMeshPosition()
})

const PIXELS =  [1, 1.5, 2, 2.5, 3, 1, 1.5, 2, 2.5, 3, 3.5, 4, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 20, 100].map((v) => v/100)

onMounted(() => {
  if (texture) {
    uniforms.value = {
      uTexture: texture,
      uFillColor: {value: new THREE.Color('#86032E')},
      uPixels: {value: PIXELS},
      uTextureSize: {value: new THREE.Vector2(props.img.width, props.img.height)},
      uElementSize: {value: new THREE.Vector2(props.width, props.height)},
      uProgress: {value: 0}
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
    <TresPlaneGeometry :args="[1, 1]" />
    <TresShaderMaterial
      :transparent="true"
      :vertex-shader="vertexShader"
      :fragment-shader="fragmentShader"
      :uniforms="uniforms" /> 
  </TresMesh>
</template>
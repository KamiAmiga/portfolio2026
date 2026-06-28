<script setup lang="ts">
import { gsap } from "gsap";

const props = defineProps<{
  hasParallaxAnim?: boolean
  mouseParallaxBoundaries?: HTMLElement | null
  disableOuterAnim?:boolean
}>()

interface ParallaxAnims {
  eyeX: gsap.QuickToFunc
  eyeY: gsap.QuickToFunc
  eyeInnerX: gsap.QuickToFunc
  eyeInnerY: gsap.QuickToFunc
}

const logo = useTemplateRef('logo')
const mousePosition = reactive({ x: 0, y: 0 })

let parallaxAnims: ParallaxAnims | undefined = undefined

const parallaxAnimSettings = {
  delay: 0.1,
  ease: "power2.out",
}

const mouseMoveListener = (event: MouseEvent) => {
  mousePosition.x = event.clientX
  mousePosition.y = event.clientY

  illustrationParallaxAnim()
}

const illustrationParallaxAnim = () => {
  if (!parallaxAnims) return

  const boundaries = props.mouseParallaxBoundaries ?? document.body
  
  const boundariesBox = boundaries.getBoundingClientRect()
  const boxBottomBoundary = boundariesBox.y + boundariesBox.height

  const xPosNormalize = mousePosition.x / boundariesBox.width - 0.5
  const yPosNormalize = mousePosition.y / boxBottomBoundary - .5

  if (mousePosition.y > boxBottomBoundary) {
    if(!props.disableOuterAnim) {
      parallaxAnims.eyeX(0)
      parallaxAnims.eyeY(0)
    }
  
    parallaxAnims.eyeInnerX(0)
    parallaxAnims.eyeInnerY(0)

    return
  }

  if(!props.disableOuterAnim) {
    parallaxAnims.eyeX(xPosNormalize * 12)
    parallaxAnims.eyeY(yPosNormalize * 12)
  }

  parallaxAnims.eyeInnerX(xPosNormalize)
  parallaxAnims.eyeInnerY(yPosNormalize)
}

useGSAP((isReducedMotion) => {
  if (isReducedMotion || !logo.value) {
    return
  }

  parallaxAnims = {
    eyeX: gsap.quickTo(logo.value, "x", parallaxAnimSettings),
    eyeY: gsap.quickTo(logo.value, "y", parallaxAnimSettings),
    eyeInnerX: gsap.quickTo(logo.value, '--eye-inner-x', parallaxAnimSettings),
    eyeInnerY: gsap.quickTo(logo.value, "--eye-inner-y", parallaxAnimSettings),
  }
}, logo, false)

onMounted(() => {
  if (!props.hasParallaxAnim) return

  document.addEventListener('mousemove', mouseMoveListener)
})

onUnmounted(() => {
  if (!props.hasParallaxAnim) return
  
  document.removeEventListener('mousemove', mouseMoveListener)
})
</script>

<template>
  <div ref="logo" class="logo"/>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/components/atoms/logo' as *;
</style>
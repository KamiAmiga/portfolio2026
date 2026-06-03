import type { ShallowRef } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export function useGSAP(
  callback: (isReducedMotion: boolean, context: gsap.Context) => void,
  scope: ShallowRef<HTMLElement | null> | null
): void {
  let ctx: gsap.Context
  console.log(window?.matchMedia("(prefers-reduced-motion: reduce)").matches)

  function _callback() {
    ctx?.revert()

    nextTick(() => {
      if (!scope?.value) return

      ctx = gsap.context((self) => {
        callback(
          window?.matchMedia("(prefers-reduced-motion: reduce)").matches ?? false,
          self
        )
        
        ScrollTrigger.refresh()
      }, scope.value)
    })
  }

  onMounted(_callback)

  onUnmounted(() => ctx?.revert())
}
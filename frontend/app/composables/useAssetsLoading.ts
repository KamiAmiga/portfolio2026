import type { ShallowRef } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export function useAssetsLoading(
  scope: ShallowRef<HTMLElement | null> | null,
): Ref<'eager' | 'lazy'> {
  let ctx: gsap.Context
  const loadAssets = ref<'eager' | 'lazy'>('lazy')

  function _callback() {
    if (!scope?.value) return

    ctx?.revert()

    nextTick(() => {
      if (!scope?.value) return

      ctx = gsap.context(() => {
        const loadAssetsTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: scope.value,
            once: true,
            start: 'top 250%',
          }
        })

        loadAssetsTimeline
          .to(loadAssets, {
            value: 'eager'
          })
        
        ScrollTrigger.refresh()
      }, scope.value)
    })
  }

  onMounted(_callback)

  onUnmounted(() => ctx?.revert())

  return loadAssets
}
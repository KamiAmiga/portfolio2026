<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";

const smoothScrollWrapper = ref();
const smoothScrollContent = ref()
let ctx: gsap.Context;

onMounted(() => {
  ctx = gsap.context(() => {
    ScrollSmoother.create({
      smooth: 1,
      normalizeScroll: true,
      wrapper: smoothScrollWrapper.value,
      content: smoothScrollContent.value
    });
  }, smoothScrollWrapper.value);
});

onUnmounted(() => {
  ctx.revert();
});
</script>

<template>
  <div ref="smoothScrollWrapper">
    <div ref="smoothScrollContent">
      <slot />
    </div>
  </div>
</template>
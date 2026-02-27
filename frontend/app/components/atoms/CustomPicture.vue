<script setup lang="ts">
import type {
  StrapiImage,
} from "@/types/strapiResponsiveImage";

const props = defineProps<{
  pictureDataDefault: StrapiImage;
  pictureDataPortrait?: StrapiImage;
  format?: "full_screen" | "projects_image";
  isCover?: boolean
}>();

const modifiers = {
  format: 'webp',
  quality: 85
}

const img = useImage()
const imgSizesParams = {
  sizes: 'md:100vw lg:100vw xl:100vw',
  modifiers
}

const _srcset = computed(() => {
  const resizerDefault = img.getSizes(props.pictureDataDefault.url, imgSizesParams)
  const resizerPortrait = props.pictureDataPortrait 
    ? img.getSizes(props.pictureDataPortrait.url, imgSizesParams)
    : null

  return {resizerDefault, resizerPortrait}
})
</script>

<template>
  <picture v-if="props.pictureDataPortrait" class="picture" :class="{'picture--cover': isCover}">
    <source
      v-if="_srcset?.resizerPortrait"
      :srcset="_srcset.resizerPortrait.srcset"
      :sizes="_srcset.resizerPortrait.sizes"
      media="(orientation: portrait)"
      type="image/webp">
    <source
      v-if="_srcset?.resizerDefault"
      :srcset="_srcset.resizerDefault.srcset"
      :sizes="_srcset.resizerDefault.sizes"
      type="image/webp">
    <img 
      :src="_srcset?.resizerDefault?.src ?? pictureDataDefault?.url"
      :alt="pictureDataDefault?.alternativeText ?? ''"
      class="image"
      :class="{'image--cover': isCover}" />
  </picture>

  <NuxtImg 
    v-else
    :src="pictureDataDefault.url"
    :alt="pictureDataDefault.alternativeText ?? ''"
    :sizes="imgSizesParams.sizes"
    :format="modifiers.format"
    :quality="modifiers.quality"
    class="image"
    :class="{'image--cover': isCover}" />
</template>

<style lang="scss" scoped>
@use '../../assets/styles/components/atoms/custom-picture' as *;
</style>
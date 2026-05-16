<script setup lang="ts">
import type {
  StrapiImage,
} from "@/types/strapiResponsiveImage";

interface Props {
  pictureDataDefault: StrapiImage;
  pictureDataPortrait?: StrapiImage;
  format?: 
    "full_screen" 
    | "full_grid" 
    | "half_grid" 
    | "third_grid" 
    | "fourth_grid";
  isCover?: boolean;
  loading?: 'eager' | 'lazy'
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy'
})

const modifiers = {
  format: 'webp',
  quality: 85
}

const img = useImage()

const imgSizesPerFormat = () => {
  const defaultSizes = 'xs:100vw sm:100vw md:100vw lg:100vw'
  switch(props.format) {
    case 'half_grid':
      return 'xs:100vw sm:100vw md:50vw lg:50vw'
    case 'third_grid':
      return 'xs:66vw sm:66vw md:33vw lg:33vw'
    case 'fourth_grid':
      return 'xs:33vw sm:33vw md:25vw lg:25vw'
    case 'full_screen':
    case 'full_grid':
    default:
      return defaultSizes
  }

}
const imgSizesParams = {
  sizes: imgSizesPerFormat(),
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
      :width="pictureDataPortrait?.width"
      :height="pictureDataPortrait?.height"
      media="(orientation: portrait)"
      type="image/webp">
    <source
      v-if="_srcset?.resizerDefault"
      :srcset="_srcset.resizerDefault.srcset"
      :sizes="_srcset.resizerDefault.sizes"
      :width="pictureDataDefault.width"
      :height="pictureDataDefault.height"
      type="image/webp">
    <img 
      :src="_srcset?.resizerDefault?.src ?? pictureDataDefault?.url"
      :alt="pictureDataDefault?.alternativeText ?? ''"
      :loading="loading"
      :width="pictureDataDefault.width"
      :height="pictureDataDefault.height"
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
    :loading="loading"
    :width="pictureDataDefault.width"
    :height="pictureDataDefault.height"
    class="image"
    :class="{'image--cover': isCover}" />
</template>

<style lang="scss" scoped>
@use '../../assets/styles/components/atoms/custom-picture' as *;
</style>
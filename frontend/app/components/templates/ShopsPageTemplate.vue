<script lang="ts" setup>
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import type { ShopsCollectionItem } from '@nuxt/content';

defineProps<{ 
  data: ShopsCollectionItem,
}>()

const templateWrapper = useTemplateRef('templateWrapper')
const menuVisible = ref(false)
let titleTimeline: gsap.core.Timeline;

const onTitleTimeline = (payload: gsap.core.Timeline) => {
  titleTimeline = payload;
};

useGSAP((isReducedMotion, context) => {
  if (isReducedMotion) {
    return
  }
  
  const timeline = gsap.timeline()

  const initTimeline = () => {
    const timeline = gsap.timeline()

    timeline
      .from(templateWrapper.value, {
        autoAlpha: 0
      })

    return timeline
  }

  const headerTimeline = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline({
      onComplete: () => {
        menuVisible.value = true
      }
    })

    const splitHeaderText = SplitText.create(gsapContext.selector?.('.header [data-text-split]'), {
      type: "chars",
      mask: "lines",
      autoSplit: true,
      aria: "hidden"
    });
    
    timeline
      .from(gsapContext.selector?.('.header__logo-wrapper'), {
        opacity: 0,
        duration: .3,
        ease: 'power2.in',
      }, '<')
      .from(gsapContext.selector?.('.header__logo-wrapper'), {
        scale: 0,
        duration: .25,
        ease: 'back.out(2.5)',
      }, '<')
      .from(splitHeaderText.chars, {
        opacity: 0,
        y: '1.5em',
        duration: .3,
        ease: "power2.inOut",
        stagger: .02
      })

    return timeline
  }

  const shopsListTimeline = (gsapContext: gsap.Context) => {
    const timeline = gsap.timeline()

    const splitTitle = SplitText.create(gsapContext.selector?.('[data-shops-list] [data-text-split]'), {
      type: "chars",
      mask: "lines",
      autoSplit: true,
      aria: "hidden"
    });

    timeline
      .from(splitTitle.chars, {
        opacity: 0,
        y: '1.5em',
        duration: .3,
        ease: "power2.inOut",
        stagger: .02
      })
      .from(gsapContext.selector?.('.shops-list__item'), {
        opacity: 0,
        duration: .3,
        ease: 'circ.in',
        stagger: .08,
        onComplete: () =>{
          titleTimeline.play()
        }
      }, '+=.05')

    return timeline
  }

  const socialLinksTimeline = gsap.timeline({
    trigger: context.selector?.('[data-social-links]'),
    once: true,
  })

  const splitTitle = SplitText.create(context.selector?.('[data-social-links] [data-text-split]'), {
    type: "chars",
    mask: "lines",
    autoSplit: true,
    aria: "hidden"
  });

  timeline    
    .add(initTimeline())
    .add(headerTimeline(context))
    .add(shopsListTimeline(context), '-=25%')

  socialLinksTimeline
    .from(splitTitle.chars, {
      opacity: 0,
      y: '1.5em',
      duration: .3,
      ease: "power2.inOut",
      stagger: .02
    })
}, templateWrapper)
</script>

<template>
<div class="autoalpha" ref="templateWrapper">
  <Grid 
    tag="header"
    :noGap="true"
    :withBottomPadding="false"
    class="header"
    :data-menu-visible="menuVisible">
    <div class="header__logo-wrapper">
      <div class="header__logo-skyline"/>
      <Logo class="header__logo"/>
    </div>
  
    <h1 v-if="data.title">
      <span class="sr-only">{{ data.title }} {{ data.subtitle }}</span>

      <div class="font-sans--md-capitalized" data-text-split>
        {{ data.title }}
      </div>
  
      <div v-if="data.subtitle" class="font-mono--sm" data-text-split>
        {{ data.subtitle }}
      </div>
    </h1>
  </Grid>
  
  <Grid>
    <div v-if="data.shops_list" data-shops-list>
      <h2>
        <span class="sr-only">Mes boutiques</span>

        <div class="font-sans--base-capitalized" data-text-split>
          Mes boutiques
        </div>
      </h2>
      
      <ul class="shops-list">
        <li
          v-for="shopItem in data.shops_list"
          :key="shopItem.id"
          class="shops-list__item">
          <a :href="shopItem.url" target="_blank">
            <CustomPicture 
              v-if="shopItem.preview_image"
              :pictureDataDefault="shopItem.preview_image"
              :isCover="true"
              format="half_grid"
              class="shops-list__item__image" />
            <CustomTitle
              :content="shopItem.name"
              level="main"
              tag="h2"
              enforceVisibility
              class="shops-list__item__title"
              @title-timeline="onTitleTimeline"  />
          </a>
        </li>
      </ul>
    </div>
  
    <div v-if="data.social_links" data-social-links>
      <h2>
        <span class="sr-only">Retrouvez moi aussi sur :</span>
        
        <div class="font-sans--base-capitalized" data-text-split>Retrouvez moi aussi sur :</div>
      </h2>
  
      <SocialLinksList :social-links="data.social_links" class="social-links"/>
    </div>
  </Grid>
</div>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/components/templates/shop' as *;
</style>
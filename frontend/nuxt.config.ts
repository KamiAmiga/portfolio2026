// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'fr-FR'
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      title: 'Camille Gicquel - Portfolio',
    }
  },
  compatibilityDate: '2025-07-15',
  components: [
    {
      path: '~/components',
      pathPrefix: false,
      global: true
    },
  ],
  devtools: { enabled: true },
  image: {
    screens: {
      'xs': 480,
      'sm': 640,
      'md': 960,
      'lg': 1280
    },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    'lenis/nuxt',
    'nuxt-icons',
    'nuxt-strapi-blocks-renderer',
  ],
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'gsap',
        'gsap/ScrollTrigger',
        'gsap/ScrollSmoother',
        'gsap/CustomEase',
        'gsap/SplitText',
      ]
    }
  }
})
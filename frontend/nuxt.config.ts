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
  css: ['lenis/dist/lenis.css'],
  devtools: { enabled: true },
  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: {
          interaction: true,
          visibility: false,
        },
      },
    },
  },
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
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/"],
    }
  },
  vite: {
    optimizeDeps: {
      include: [
        'gsap',
        'gsap/ScrollTrigger',
        'gsap/CustomEase',
        'gsap/SplitText',
        'gsap/CustomWiggle',
        'gsap/Draggable',
      ]
    }
  }
})

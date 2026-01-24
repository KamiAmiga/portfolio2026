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
    },
  ],
  devtools: { enabled: true },
  image: {
    screens: {
      'md': 640,
      'lg': 1280,
      'xl': 1920
    },
  },
  modules: ['@nuxt/content', '@nuxt/image', 'nuxt-icons', 'nuxt-strapi-blocks-renderer']
})
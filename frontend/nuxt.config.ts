// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Camille Gicquel - Portfolio',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      htmlAttrs: {
        lang: 'fr-FR'
      }
    }
  },
  compatibilityDate: '2025-07-15',
  components: {
    dirs: [
      {
        path: "~/components/atoms",
        global: true,
      },
      {
        path: "~/components/molecules",
        global: true,
      },
      {
        path: "~/components/organisms",
        global: true,
      },
      "~/components",
    ],
  },
  devtools: { enabled: true },
  modules: ['@nuxt/content']
})

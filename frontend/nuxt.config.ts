// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
      "~/components",
    ],
  },
  devtools: { enabled: true },
  modules: ['@nuxt/content']
})

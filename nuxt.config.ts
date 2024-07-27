// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@vueuse/nuxt", "@nuxt/ui", "@pinia/nuxt", "@nuxtjs/google-fonts"],

  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL,
    },
  },

  typescript: {
    typeCheck: true,
  },

  devtools: { enabled: true },

  googleFonts: {
    families: {
      Inter: "200..700",
    },
  },

  compatibilityDate: "2024-07-09",
});

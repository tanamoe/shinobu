// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@vueuse/nuxt", "@nuxt/ui", "@pinia/nuxt", "@nuxt/eslint"],

  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL,
      imageUrl: process.env.IMAGE_URL,
    },
  },

  typescript: {
    typeCheck: true,
    strict: true,
  },

  css: ["~/assets/css/main.css"],

  icon: {
    serverBundle: "remote",
  },

  compatibilityDate: "2024-07-09",
});

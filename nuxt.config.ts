// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@vueuse/nuxt",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxt/eslint",
  ],

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

  icon: {
    serverBundle: "remote",
  },

  compatibilityDate: "2024-07-09",
});

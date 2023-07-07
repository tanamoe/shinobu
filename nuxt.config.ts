// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/google-fonts", "@nuxthq/ui"],
  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL,
    },
  },
  typescript: {
    shim: false,
  },
  devtools: { enabled: true },
  ui: {
    icons: ["fluent"],
  },
  googleFonts: {
    families: {
      Inter: [400, 700],
      Alexandria: [700, 900],
    },
  },
});

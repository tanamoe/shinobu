// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@vueuse/nuxt", "@nuxtjs/google-fonts", "@nuxt/ui"],
  runtimeConfig: {
    tenorApiKey: process.env.TENOR_API_KEY,
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
  experimental: {
    appManifest: false,
  },
});

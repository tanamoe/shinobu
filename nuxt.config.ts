// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@vueuse/nuxt", "@nuxt/ui"],
  runtimeConfig: {
    tenorApiKey: process.env.TENOR_API_KEY,
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL,
    },
  },
  typescript: {
    shim: false,
  },
  css: ["~/assets/fonts/inter.css"],
  devtools: { enabled: true },
  ui: {
    icons: ["fluent"],
  },
  experimental: {
    appManifest: false,
  },
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@vueuse/nuxt", "@nuxtjs/google-fonts", "@nuxthq/ui"],
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
  // TODO: track: https://answers.netlify.com/t/javascript-heap-out-of-memory-when-trying-to-build-a-nuxt-app/93138/13
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      cssnano:
        process.env.NODE_ENV === "production"
          ? { preset: ["default", { discardComments: { removeAll: true } }] }
          : false, // disable cssnano when not in production
    },
  },
});

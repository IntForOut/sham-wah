// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  nitro: {
    preset: "github-pages",
  },

  app: {
    baseURL: "/sham-wah/",
    buildAssetsDir: "assets",

    head: {
      title: "Sham-Wah",
      meta: [
        {
          name: "description",
          content:
            "Application for Querying and Discovering Ressources From A Knowledge Graph in Alpine Ecology",
        },
      ],
    },
  },

  runtimeConfig: {
    NEO4J_API_URL: process.env.NUXT_NEO4J_API_URL || "http://localhost:8000",
    public: {
      MAPTILER_KEY: process.env.NUXT_PUBLIC_MAPTILER_KEY,
      NEO4J_API_URL:
        process.env.NUXT_PUBLIC_NEO4J_API_URL || "http://localhost:8000",
    },
  },

  modules: [
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxtjs/color-mode",
  ],

  colorMode: {
    preference: "system", // default value of $colorMode.preference
    fallback: "light", // fallback value if not system preference found
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "",
    storage: "localStorage", // or 'sessionStorage' or 'cookie'
    storageKey: "nuxt-color-mode",
  },
});

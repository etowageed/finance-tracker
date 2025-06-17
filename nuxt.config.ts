// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "@nuxtjs/color-mode",
    // ...other modules...
  ],
  css: ["~/assets/css/main.css"],
  // vite: {
  //   plugins: [tailwindcss()],
  // },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
  supabase: {
    redirect: false,
  },

  colorMode: {
    classSuffix: "",
    preference: "system", // default value of color mode (system, dark, light)
    fallback: "light", // fallback value if not system preference found
    storageKey: "nuxt-color-mode", // key for localStorage/sessionStorage
  },
});

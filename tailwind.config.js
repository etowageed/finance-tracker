import type { Config } from "tailwindcss";

export default Config({
  darkMode: "class", // Enable class-based dark mode for Nuxt Color Mode
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
// This configuration file sets up Tailwind CSS for a Nuxt.js project with dark mode support.
// It specifies the content paths to scan for class names and extends the default theme.
// The `darkMode` option is set to "class" to enable dark mode based on a class toggle,
// which is compatible with Nuxt Color Mode.

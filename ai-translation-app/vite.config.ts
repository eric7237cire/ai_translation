import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  //See public base path in vite guide
  base: "./",

  plugins: [tailwindcss(), vue()],

  resolve: {
    alias: {
      "@services": path.resolve(__dirname, "./src/services"),
      "@composables": path.resolve(__dirname, "./src/composables"),
    },
  },
});

import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/s
export default defineConfig({
  plugins: [vue(), vueDevTools(), UnoCSS({ configFile: "./uno.config.ts" })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 4000,
  },
});

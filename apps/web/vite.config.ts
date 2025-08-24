import { fileURLToPath, URL } from "node:url";
import ui from "@nuxt/ui/vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import VueRouter from "unplugin-vue-router/vite";
import { defineConfig } from "vite";
// import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/s
export default defineConfig({
  plugins: [
    VueRouter(),
    vue(),
    // vueDevTools(),
    ui({
      prefix: "Vue",
    }),
    UnoCSS({ configFile: "./uno.config.ts" }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(
        new URL("../../packages/shared", import.meta.url),
      ),
    },
  },
  server: {
    port: 4000,
  },
});

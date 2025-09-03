import { fileURLToPath, URL } from "node:url";
import ui from "@nuxt/ui/vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import VueRouter from "unplugin-vue-router/vite";
import { defineConfig } from "vite";
// import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/s
export default defineConfig({
  define: {
    __API_URL__: JSON.stringify(process.env.VITE_API_URL),
  },

  plugins: [
    VueRouter(),
    vue(),
    // vueDevTools(),

    ui({
      prefix: "Vue",
      ui: {
        modal: {
          variants: {
            transition: {
              true: {
                overlay:
                  "data-[state=open]:animate-[fade-in_100ms_ease-out] data-[state=closed]:animate-[fade-out_100ms_ease-in]",
                content:
                  "data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]",
              },
            },
          },
        },
        tooltip: {
          slots: {
            content: [
              "bg-dTheme-surface rounded-sm p-2 text-dTheme-font",
              "border-t-1 border-t-dTheme-light",
              "border-l-1 border-l-dTheme-light/80 ",
              "border-r-1 border-r-dTheme-light/80",
              "shadow-xs shadow-dTheme-accent",
            ],
          },
        },
      },
    }),

    UnoCSS({
      configFile: "./uno.config.ts",
      inspector: false,
      // mode: "dist-chunk",
    }),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(
        new URL("../../packages/shared", import.meta.url),
      ),
    },
  },

  // ssr: {},

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "sudoku-game": [
            "./src/components/SudokuGrid.vue",
            "./src/components/Cell.vue",
          ],
          vendor: ["vue", "@nuxt/ui"],
        },
      },
    },
  },

  server: {
    port: 4000,
  },
});

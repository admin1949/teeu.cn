import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import ElementPlus from "unplugin-element-plus/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: "src/auto-import.d.ts",
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: "src/component.d.ts",
    }),
    ElementPlus({}),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vender: ["vue", "lottie-web", "typed.js"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve("./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});

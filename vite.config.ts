import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
});

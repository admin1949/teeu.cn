import { defineConfig } from "vitepress";
import ElementPlus from "unplugin-element-plus/vite";
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';
import { resolve } from "node:path";
// import Inspect from 'vite-plugin-inspect'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Minjian的博客",
  description: "日常随记",
  lang: "zh-CN",
  base: "/blog/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "Typescript", link: "/ts/worker" },
      { text: "Vue3", link: "/vue3/async-hooks" },
      { text: "Vue2", link: "/vue2/demo" },
    ],
    
    sidebar: [
      {
        text: "Typescript",
        items: [
          { text: "Web Worker", link: "/ts/worker" },
        ],
      },
      
      {
        text: "Vue3",
        items: [
          { text: "Async Hooks", link: "/vue3/async-hooks" },
          { text: "Drag and Drop", link: "/vue3/drag-drop" },
        ],
      },
      
      {
        text: "Vue2",
        items: [
          { text: "Demo", link: "/vue2/demo" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/admin1949/teeu.cn/tree/master/docs" },
    ],
    
    outline: {
      label: "页面导航"
    }
  },
  markdown: {
    config(md) {
      md.use(vitepressDemoPlugin);
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
    plugins: [
      ElementPlus({}),
      // Inspect({}),
    ],
    resolve: {
      "alias": {
        "@": resolve("./src"),
      }
    },
    ssr: {
      noExternal: ['element-plus', "react", "react-dom"],
    },
    build: {
      chunkSizeWarningLimit: 100,
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
            return;
          }
          warn(warning);
        },
      },
    },
  }
});

import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
      "/@components": path.resolve(__dirname, "./src/components"),
      "/@app_modules": path.resolve(__dirname, "./src/modules"),
      "/@stores": path.resolve(__dirname, "./src/stores"),
    },
  },
  devServer: {
    proxy: {
      "//": {
        target: "54.180.125.158:9090/upload",
        changeOrigin: true,
      },
      "/": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});

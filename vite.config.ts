import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 开发环境代理 Semantic Scholar，解决浏览器直连可能遇到的 CORS 问题。
      // 生产环境建议改为后端代理，避免暴露 API key 和被浏览器限流。
      "/semantic-scholar": {
        target: "https://api.semanticscholar.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/semantic-scholar/, ""),
      },
    },
  },
});

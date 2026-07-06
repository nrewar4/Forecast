import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/askcos-proxy": {
        target: "https://askcos-demo.mit.edu",
        changeOrigin: true,
        rewrite: (p: string) => p.replace(/^\/askcos-proxy/, ""),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "charts-vendor": ["recharts"],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});

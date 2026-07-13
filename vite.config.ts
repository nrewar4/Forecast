import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// The base public path the app is served from. Default "/" for a root or
// subdomain deploy (e.g. platform.apacss.com). Set VITE_BASE_PATH to a subpath
// (e.g. "/platform/") to host the app under a folder of the main APAC site.
// Vite exposes this to the app as import.meta.env.BASE_URL, which main.tsx uses
// as the router basename, so routing works under any path with no code changes.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
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

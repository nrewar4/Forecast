import { defineConfig, loadEnv, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

// Mounts the same keyless AI proxy used in production (see api/ai.ts) onto the
// Vite dev and preview servers, so `npm run dev` / `npm run preview` exercise the
// real proxy path. The key is read from OPENROUTER_API_KEY (a normal, non-VITE
// env var), so it stays server-side and is never bundled into the client.
function aiProxyPlugin(apiKey: string): PluginOption {
  const handler = (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.end(JSON.stringify({ error: { message: "Use POST." } }));
      return;
    }
    if (!apiKey) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: { message: "Server is missing OPENROUTER_API_KEY." } }));
      return;
    }
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      try {
        const upstream = await fetch(OPENROUTER_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "X-Title": "APAC Sourcing Intelligence",
          },
          body,
        });
        const text = await upstream.text();
        res.statusCode = upstream.status;
        res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
        res.end(text);
      } catch (e) {
        res.statusCode = 502;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: { message: `Proxy failed: ${(e as Error)?.message || e}` } }));
      }
    });
  };
  return {
    name: "ai-proxy",
    configureServer(server) {
      server.middlewares.use("/api/ai", handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/ai", handler);
    },
  };
}

// The base public path the app is served from. Default "/" for a root or
// subdomain deploy (e.g. platform.apacss.com). Set VITE_BASE_PATH to a subpath
// (e.g. "/platform/") to host the app under a folder of the main APAC site.
// Vite exposes this to the app as import.meta.env.BASE_URL, which main.tsx uses
// as the router basename, so routing works under any path with no code changes.
export default defineConfig(({ mode }) => {
  // Load ALL env vars (not just VITE_-prefixed), so the server-side key is
  // available to the dev/preview proxy without ever being exposed to the client.
  const env = loadEnv(mode, process.cwd(), "");
  const serverKey = env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || "";

  return {
    base: process.env.VITE_BASE_PATH || "/",
    plugins: [react(), aiProxyPlugin(serverKey)],
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
  };
});

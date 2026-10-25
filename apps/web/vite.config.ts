import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    // Same-origin API in dev: the frontend calls /api/*, Vite proxies to the
    // backend. The browser never sees the backend's host or the API key.
    proxy: {
      "/api": "http://localhost:8787",
    },
  },
});

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: path.resolve("client"),

  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve("client/src"),
      "@shared": path.resolve("shared"),
      "@assets": path.resolve("attached_assets"),
    },
  },

  envDir: path.resolve("."),

  publicDir: path.resolve("client/public"),

  build: {
    outDir: path.resolve("dist/public"),
    emptyOutDir: true,
  },
});

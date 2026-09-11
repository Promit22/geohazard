import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/geohazard/",

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        analysis: resolve(__dirname, "analysis.html"),
        about: resolve(__dirname, "about.html"),
      },
    },
  },
});

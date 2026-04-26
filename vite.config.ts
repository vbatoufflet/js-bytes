import { resolve } from "node:path";

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      fileName: format => (format === "es" ? "index.js" : "index.cjs"),
      formats: ["es", "cjs"],
    },
    target: "es2023",
  },
});

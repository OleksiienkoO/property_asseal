import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        private_executors: resolve(import.meta.dirname, "private_executors.html"),
        arbitrage_manager: resolve(import.meta.dirname, "arbitrage_manager.html"),
        banks: resolve(import.meta.dirname, "banks.html"),
      },
    },
  },
});

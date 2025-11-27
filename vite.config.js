import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        private_executors: resolve(__dirname, "private_executors.html"),
        arbitrage_manager: resolve(__dirname, "arbitrage_manager.html"),
        banks: resolve(__dirname, "banks.html"),
      },
    },
  },
});

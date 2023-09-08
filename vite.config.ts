import { defineConfig } from "vite";
import { resolve } from "path";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        main: "src/main.ts", // Your original entry point
        ["preact"]: "src/preact.tsx",
      },
    },
  },
});

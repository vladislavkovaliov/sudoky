import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  build: {
    rollupOptions: {
      input: {
        main: "src/main.ts", // Your original entry point
        ["preact"]: "src/preact.tsx",
      },
    },
  },
});

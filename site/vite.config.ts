import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2020",
  },
  optimizeDeps: {
    // ya-webadb packages use ESM with top-level await
    include: [
      "@yume-chan/adb",
      "@yume-chan/adb-backend-webusb",
    ],
  },
});

import { defineConfig, Plugin } from "vite";
import fs from "fs";
import path from "path";

function androidVersionPlugin(): Plugin {
  const virtualModuleId = "virtual:android-version";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "android-version",
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const manifest = fs.readFileSync(
          path.resolve(__dirname, "../AndroidManifest.xml"),
          "utf-8"
        );
        const versionCode = manifest.match(/android:versionCode="(\d+)"/)?.[1];
        const versionName = manifest.match(/android:versionName="([^"]+)"/)?.[1];
        return `export const VERSION_CODE = ${JSON.stringify(versionCode)};
export const VERSION_NAME = ${JSON.stringify(versionName)};`;
      }
    },
  };
}

export default defineConfig({
  plugins: [androidVersionPlugin()],
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

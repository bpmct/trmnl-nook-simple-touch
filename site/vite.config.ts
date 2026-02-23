import { defineConfig, Plugin } from "vite";
import fs from "fs";
import path from "path";
import type { Connect } from "vite";

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

// Vite dev server plugin: proxies GitHub releases API server-side to avoid
// CORS issues and unauthenticated rate limits from the browser.
function githubReleasesPlugin(): Plugin {
  return {
    name: "github-releases",
    configureServer(server) {
      server.middlewares.use(
        "/api/releases" as string,
        (async (_req, res, _next) => {
          try {
            const releasesRes = await fetch(
              "https://api.github.com/repos/usetrmnl/trmnl-nook-simple-touch/releases",
              { headers: { Accept: "application/vnd.github+json", "User-Agent": "vite-dev" } }
            );
            const releases = await releasesRes.json() as Array<{ tag_name: string; html_url: string; published_at: string }>;

            // Fetch versionCode for each release from AndroidManifest.xml
            const mapped = await Promise.all(
              releases.map(async (r) => {
                const manifestRes = await fetch(
                  `https://raw.githubusercontent.com/usetrmnl/trmnl-nook-simple-touch/${r.tag_name}/AndroidManifest.xml`
                );
                const xml = await manifestRes.text();
                const versionCode = xml.match(/android:versionCode="(\d+)"/)?.[1] ?? null;
                const versionName = xml.match(/android:versionName="([^"]+)"/)?.[1] ?? r.tag_name.replace(/^v/, "");
                return { tag: r.tag_name, versionCode, versionName, url: r.html_url, publishedAt: r.published_at };
              })
            );

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(mapped));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(e) }));
          }
        }) as Connect.NextHandleFunction
      );
    },
  };
}

export default defineConfig({
  plugins: [androidVersionPlugin(), githubReleasesPlugin()],
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

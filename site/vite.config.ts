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
            const fullReleases = releases as Array<{
              tag_name: string; html_url: string; published_at: string;
              assets: Array<{ name: string; browser_download_url: string }>;
            }>;
            const mapped = await Promise.all(
              fullReleases.map(async (r) => {
                const manifestRes = await fetch(
                  `https://raw.githubusercontent.com/usetrmnl/trmnl-nook-simple-touch/${r.tag_name}/AndroidManifest.xml`
                );
                const xml = await manifestRes.text();
                const versionCode = xml.match(/android:versionCode="(\d+)"/)?.[1] ?? null;
                const versionName = xml.match(/android:versionName="([^"]+)"/)?.[1] ?? r.tag_name.replace(/^v/, "");
                const apkAsset = r.assets?.find(a => a.name.endsWith(".apk"));
                const apkUrl = apkAsset?.browser_download_url ?? null;
                return { tag: r.tag_name, versionCode, versionName, url: r.html_url, publishedAt: r.published_at, apkUrl };
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

      // Proxy APK downloads to avoid CORS (GitHub release assets use S3 redirects)
      server.middlewares.use(
        "/api/download" as string,
        (async (req, res, _next) => {
          const url = new URL(req.url ?? "", "http://localhost");
          const target = url.searchParams.get("url");
          if (!target || !target.startsWith("https://github.com")) {
            res.statusCode = 400;
            res.end("Bad request");
            return;
          }
          try {
            const upstream = await fetch(target, {
              headers: { "User-Agent": "vite-dev" },
              redirect: "follow",
            });
            res.statusCode = upstream.status;
            const ct = upstream.headers.get("content-type");
            if (ct) res.setHeader("Content-Type", ct);
            const cl = upstream.headers.get("content-length");
            if (cl) res.setHeader("Content-Length", cl);
            // Stream body to response
            const reader = upstream.body?.getReader();
            if (!reader) { res.end(); return; }
            const pump = async () => {
              while (true) {
                const { done, value } = await reader.read();
                if (done) { res.end(); break; }
                const ok = res.write(value);
                if (!ok) await new Promise(r => res.once("drain", r));
              }
            };
            await pump();
          } catch (e) {
            res.statusCode = 502;
            res.end(String(e));
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

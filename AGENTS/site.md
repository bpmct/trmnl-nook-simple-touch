# site/ — WebUSB ADB Browser Tool

A Vite + TypeScript web app in `site/` that connects to the NOOK over WebUSB
and provides a browser-based ADB shell + device info panel.

## Stack

- **Vite 5** + **TypeScript** (strict)
- **@yume-chan/adb** + **@yume-chan/adb-backend-webusb** (ya-webadb)
- No framework — vanilla DOM

## Running

```bash
cd site
npm install
npm run dev   # → http://localhost:5173
```

Chrome or Edge required (WebUSB). Kill the host ADB server first:
```bash
~/Downloads/adt-bundle-linux-x86_64-20140702/.../platform-tools/adb kill-server
```

## udev rule (Linux)

Chrome needs permission to open the USB device:

```bash
echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="2080", ATTR{idProduct}=="0003", MODE="0666", GROUP="plugdev"' \
  | sudo tee /etc/udev/rules.d/51-nook.rules
sudo udevadm control --reload-rules && sudo udevadm trigger
```

Then unplug/replug the NOOK and log out/in.

## ya-webadb API notes (as installed)

| What you want | Correct API |
|---|---|
| Device picker | `AdbWebUsbBackendManager.BROWSER!.requestDevice()` → `AdbWebUsbBackend \| undefined` |
| Connect | `device.connect()` → cast `as any` for TS (ReadableStream variance issue) |
| Authenticate | `AdbDaemonTransport.authenticate({ serial, connection, credentialStore })` |
| Shell protocol supported? | `adb.subprocess.shellProtocol.isSupported` — **getter, not method** |
| Run command (modern) | `adb.subprocess.shellProtocol.spawn(cmd)` → `.stdout` + `.exited` (Promise\<number\>) |
| Run command (legacy) | `adb.subprocess.noneProtocol.pty(cmd)` → `.output` (Promise\<void\> on exit) |

## Android 2.1 compatibility (critical)

`noneProtocol.spawn()` uses the `exec:` ADB socket service which **does not exist on Android < 4**.
It silently fails with "Socket open failed".

**Fix: use `noneProtocol.pty()` instead** — routes through `shell:` which works on all Android versions.

```ts
// ❌ fails on Android 2.1
const proc = await adb.subprocess.noneProtocol.spawn(cmd);

// ✅ works on Android 2.1
const proc = await adb.subprocess.noneProtocol.pty(cmd);
// read from proc.output (not proc.stdout)
```

## Credential store

ya-webadb has no built-in browser credential store. We implement one in `src/main.ts`:
- Generate RSA-2048 key via WebCrypto (`exportKey("jwk")` to get n and d)
- Pack n at byte offset 38 and d at byte offset 303 in a 600-byte buffer
- Store the buffer in IndexedDB under `"webusb-adb-keys"` / `"adbkey"`
- The library's `rsaSign()` reads n and d directly from those offsets

## NOOK device properties

| prop | value |
|---|---|
| `ro.product.overall.name` | `NOOK` (use this, not `ro.product.model`) |
| `ro.product.manufacturer` | `BarnesAndNoble` |
| `ro.build.version.release` | `2.1` |
| `ro.build.version.sdk` | `7` |
| USB vendor/product ID | `2080:0003` |
| Serial (example) | `3014710109313003` |

## Version detection

Android 2.1's `dumpsys package` does **not** include `versionName`.
`/data/system/packages.xml` has `version=` which is `versionCode`, not `versionName`.
No binary tools (`strings`, `aapt`) are available on the device.

**Solution:** Two-part system:

1. **Vite plugin** (`vite.config.ts`) reads `../AndroidManifest.xml` at build time,
   exposes `VERSION_CODE` + `VERSION_NAME` as virtual module `virtual:android-version`.

2. **`/api/releases` dev-server middleware** fetches GitHub releases API server-side
   (avoids CORS/rate limits), fetches each tag's `AndroidManifest.xml` from
   `raw.githubusercontent.com` to extract `versionCode`, returns JSON array:
   `[{ tag, versionCode, versionName, url, publishedAt, apkUrl }]`

At runtime, read `versionCode` from `packages.xml`, match against `/api/releases`,
show version name and update badge if outdated.

**Known versionCodes:**
- `v0.8.0` → `80099` (latest as of Feb 2026)
- `v0.7.0` → `70099`
- `v0.6.2` → `60299`

## Install check — do NOT use `pm list packages`

`pm list packages` on Android 2.1 takes **~30 seconds** — avoid it entirely.

**Instead:** read `/data/system/packages.xml` directly:
```bash
grep "com.bpmct.trmnl" /data/system/packages.xml
```
If `grep` isn't available (varies by firmware), fall back to `cat` + JS string search.
The package line contains both the install status and `version="XXXXX"` (versionCode).

## OTA install flow

Browser downloads APK from GitHub via `/api/download?url=...` proxy (handles CORS + S3
redirects). Pushed to device via `adb.sync().write()`, then installed with `pm install -r`.

```
/api/download  →  fetch from GitHub  →  Uint8Array in browser
adb.sync().write({ filename: "/data/local/tmp/trmnl_update.apk", file: stream })
safeRunCommand(adb, "pm install -r /data/local/tmp/trmnl_update.apk", 90000)
```

**`pm install` output is swallowed** by pty mode on Android 2.1 — do NOT check output
for "Success". Instead verify by re-reading `packages.xml` after install.

## USB disconnect resilience

`transport.disconnected` is a `Promise<void>` getter on `AdbDaemonTransport`.
Watch it to catch `transferIn`/`transferOut` `NetworkError` when cable is pulled:

```ts
transport.disconnected
  .then(() => handleUnexpectedDisconnect("Device disconnected"))
  .catch((err) => handleUnexpectedDisconnect(err.message));
```

## `safeRunCommand` timeout

Always pass a `timeoutMs` argument — the default is 10s. Use longer for slow operations:
- `packages.xml` grep: default 10s (fast)
- `pm install`: 90s (can be slow on Android 2.1)
- Post-install `pm list packages` verify: 20s

## App prefs file

```
/data/data/com.bpmct.trmnl_nook_simple_touch/shared_prefs/trmnl_prefs.xml
```

Note: the filename is `trmnl_prefs.xml`, **not** `com.bpmct.trmnl_nook_simple_touch_preferences.xml`.

## Android build isolation

`site/` is completely ignored by the Android Ant build — Ant only touches
`src/`, `res/`, `libs/`, `gen/`, `bin/`. `site/node_modules/` and `site/dist/`
are in `.gitignore`.

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

**Solution:** Vite plugin (`vite.config.ts`) reads `../AndroidManifest.xml` at build time
and exposes `VERSION_CODE` + `VERSION_NAME` as a virtual module `virtual:android-version`.
At runtime, compare device versionCode against the baked-in value.

```ts
import { VERSION_CODE, VERSION_NAME } from "virtual:android-version";
// if device versionCode === VERSION_CODE → show VERSION_NAME
// else → show "build XXXXX (current: VERSION_NAME)"
```

## App prefs file

```
/data/data/com.bpmct.trmnl_nook_simple_touch/shared_prefs/trmnl_prefs.xml
```

Note: the filename is `trmnl_prefs.xml`, **not** `com.bpmct.trmnl_nook_simple_touch_preferences.xml`.

## Android build isolation

`site/` is completely ignored by the Android Ant build — Ant only touches
`src/`, `res/`, `libs/`, `gen/`, `bin/`. `site/node_modules/` and `site/dist/`
are in `.gitignore`.

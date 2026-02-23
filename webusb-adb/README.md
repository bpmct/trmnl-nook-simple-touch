# WebUSB ADB

A browser-based ADB client for the NOOK Simple Touch (and other ADB-enabled Android devices), built with Vite + TypeScript and the [ya-webadb](https://github.com/yume-chan/ya-webadb) library.

No host ADB daemon required — connects directly over USB from the browser.

## Requirements

- **Chrome or Edge** (WebUSB is not supported in Firefox/Safari)
- Device with **ADB enabled** (NOOK: Settings → Device Options → Enable ADB)
- USB cable connecting device to your computer

## Setup

```bash
cd webusb-adb
npm install
npm run dev
```

Then open http://localhost:5173 in Chrome or Edge.

## Build

```bash
npm run build
# Output in dist/
```

To serve the built output:
```bash
npm run preview
```

## Usage

1. Open the app in Chrome/Edge
2. Click **Connect Device** — the browser will show a USB device picker
3. Select your NOOK (or Android device) from the list
4. If it's the first connection, the device screen will show an authorization dialog — tap **Allow**
5. Once connected, the device serial/model/Android version appears
6. Use the **Shell** section to run commands, or click a **Quick** button

### Quick commands available

| Button | Command |
|---|---|
| model | `getprop ro.product.model` |
| android ver | `getprop ro.build.version.release` |
| serial | `getprop ro.serialno` |
| uptime | `uptime` |
| disk | `df -h` |
| mem | `cat /proc/meminfo \| head -5` |
| ls sdcard | `ls /sdcard/` |
| logcat (30) | `logcat -d -t 30` |

## Architecture

```
src/main.ts       — App logic (connect, shell, UI wiring)
src/style.css     — Dark terminal theme
index.html        — App shell
vite.config.ts    — Vite config
tsconfig.json     — TypeScript config
```

### Key ya-webadb APIs used

| Class | Purpose |
|---|---|
| `AdbDaemonWebUsbDeviceManager` | Shows USB device picker, lists paired devices |
| `AdbDaemonTransport.authenticate()` | Performs ADB handshake + RSA key auth |
| `AdbWebCredentialStore` | Persists RSA keys in browser IndexedDB |
| `Adb` | Main ADB client (subprocess, sync, etc.) |
| `adb.subprocess.spawn()` | Runs a shell command, streams stdout |

## Notes

- RSA keys are stored in browser IndexedDB under the key `"webusb-adb"` — they persist across sessions so you only need to authorize once per browser
- The NOOK Simple Touch runs Android 2.1 (API 7) — use `adb.subprocess.spawn()` which falls back to the legacy `shell:` service automatically
- WebUSB requires the page to be served over HTTPS or localhost

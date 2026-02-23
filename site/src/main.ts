/**
 * WebUSB ADB — Browser-based ADB client for NOOK Simple Touch
 *
 * Uses @yume-chan/adb + @yume-chan/adb-backend-webusb (ya-webadb).
 *
 * Real API (as installed):
 *   - AdbWebUsbBackendManager  — requestDevice() / getDevices()
 *   - AdbWebUsbBackend         — wraps a USBDevice, .serial, .connect()
 *   - AdbDaemonTransport       — ADB handshake + auth
 *   - Adb                      — main ADB client
 *   - credentialStore          — custom impl using IndexedDB + WebCrypto
 */

import { Adb, AdbDaemonTransport } from "@yume-chan/adb";
import { VERSION_CODE, VERSION_NAME } from "virtual:android-version";

// Hide the browser warning if WebUSB is supported
if (navigator.usb) {
  document.getElementById("browser-warning")?.classList.add("hidden");
}
import { AdbWebUsbBackendManager } from "@yume-chan/adb-backend-webusb";

// ---------------------------------------------------------------------------
// Credential store — persists RSA key in IndexedDB as ADB raw key buffer
//
// @yume-chan/adb's RSA implementation reads n and d directly from a raw
// byte buffer:
//   - n (modulus):          bytes [38 .. 38+256)
//   - d (private exponent): bytes [303 .. 303+256)
// We generate a WebCrypto RSA-2048 key (exportable), export as JWK to
// extract n and d, then pack them into the expected buffer layout.
// ---------------------------------------------------------------------------

const DB_NAME = "webusb-adb-keys";
const STORE_NAME = "keys";

function base64UrlToBytes(b64url: string): Uint8Array {
  // Convert base64url → base64 → bytes
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

/**
 * Build a raw ADB RSA private key buffer from WebCrypto JWK n and d values.
 * The library only reads n at offset 38 and d at offset 303 (each 256 bytes).
 * Everything else in the buffer is ignored for signing; we zero-fill it.
 */
function buildAdbKeyBuffer(nBytes: Uint8Array, dBytes: Uint8Array): Uint8Array {
  // Minimum buffer size: 303 + 256 = 559 bytes. Use 512 for safety.
  const buf = new Uint8Array(600);
  // Write n at offset 38 (pad/trim to 256 bytes)
  const nPadded = new Uint8Array(256);
  nPadded.set(nBytes.slice(-256), 256 - Math.min(nBytes.length, 256));
  buf.set(nPadded, 38);
  // Write d at offset 303
  const dPadded = new Uint8Array(256);
  dPadded.set(dBytes.slice(-256), 256 - Math.min(dBytes.length, 256));
  buf.set(dPadded, 303);
  return buf;
}

async function openKeyDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadOrGenerateAdbKey(): Promise<Uint8Array> {
  const db = await openKeyDb();
  const existing: Uint8Array | undefined = await new Promise((res, rej) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get("adbkey");
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
  if (existing) return existing;

  // Generate exportable RSA-2048 key via WebCrypto
  const pair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-1",
    },
    true, // must be extractable so we can read n and d
    ["sign", "verify"]
  );
  const jwk = await crypto.subtle.exportKey("jwk", pair.privateKey);
  const nBytes = base64UrlToBytes(jwk.n!);
  const dBytes = base64UrlToBytes(jwk.d!);
  const keyBuf = buildAdbKeyBuffer(nBytes, dBytes);

  await new Promise<void>((res, rej) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const req = tx.objectStore(STORE_NAME).put(keyBuf, "adbkey");
    req.onsuccess = () => res();
    req.onerror = () => rej(req.error);
  });
  return keyBuf;
}

/** Build the credentialStore that AdbDaemonTransport.authenticate() expects. */
async function buildCredentialStore() {
  const keyBuf = await loadOrGenerateAdbKey();
  // The key object shape: { buffer: Uint8Array, name?: string }
  const keyObj = { buffer: keyBuf, name: "webusb-adb" };
  return {
    async *iterateKeys() {
      yield keyObj;
    },
    async generateKey() {
      return keyObj;
    },
  };
}

// ---------------------------------------------------------------------------
// DOM refs
// ---------------------------------------------------------------------------
const btnConnect = document.getElementById("btn-connect") as HTMLButtonElement;
const btnDisconnect = document.getElementById(
  "btn-disconnect"
) as HTMLButtonElement;
const btnRun = document.getElementById("btn-run") as HTMLButtonElement;
const btnClear = document.getElementById("btn-clear") as HTMLButtonElement;
const cmdInput = document.getElementById("cmd-input") as HTMLInputElement;
const output = document.getElementById("output") as HTMLPreElement;
const deviceInfo = document.getElementById("device-info") as HTMLDivElement;
const authPrompt = document.getElementById("auth-prompt") as HTMLDivElement;
const statusDot = document.getElementById("status-dot") as HTMLSpanElement;
const statusText = document.getElementById("status-text") as HTMLSpanElement;
const shellSection = document.getElementById("shell-section") as HTMLElement;
const errorBanner = document.getElementById("error-banner") as HTMLDivElement;
const quickCmds = document.querySelectorAll<HTMLButtonElement>(".btn-quick");

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let adb: Adb | null = null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function setStatus(connected: boolean, text: string) {
  statusDot.className = `dot ${connected ? "connected" : "disconnected"}`;
  statusText.textContent = text;
}

function showError(msg: string) {
  errorBanner.textContent = `❌ ${msg}`;
  errorBanner.classList.remove("hidden");
  setTimeout(() => errorBanner.classList.add("hidden"), 8000);
}

function appendOutput(text: string) {
  output.textContent += text;
  output.scrollTop = output.scrollHeight;
}

function setConnectedUI(connected: boolean) {
  btnConnect.disabled = connected;
  btnDisconnect.disabled = !connected;
  shellSection.style.display = connected ? "block" : "none";
  if (!connected) {
    deviceInfo.innerHTML = "";
    deviceInfo.classList.add("hidden");
    authPrompt.classList.add("hidden");
  }
}

// ---------------------------------------------------------------------------
// Connect
// ---------------------------------------------------------------------------
btnConnect.addEventListener("click", async () => {
  btnConnect.disabled = true;
  setStatus(false, "Requesting device…");
  errorBanner.classList.add("hidden");

  try {
    // Check WebUSB support
    if (!navigator.usb) {
      throw new Error(
        "WebUSB is not supported in this browser. Use Chrome or Edge."
      );
    }

    // Build credential store (RSA key in IndexedDB)
    const credentialStore = await buildCredentialStore();

    // Use the static BROWSER instance (already checks navigator.usb)
    const manager = AdbWebUsbBackendManager.BROWSER;
    if (!manager) {
      throw new Error("WebUSB not available — use Chrome or Edge.");
    }

    // requestDevice() returns undefined if user cancels (no throw)
    const device = await manager.requestDevice();
    if (!device) {
      setStatus(false, "Disconnected");
      btnConnect.disabled = false;
      return;
    }

    setStatus(false, "Connecting…");
    authPrompt.classList.remove("hidden");

    // Connect — this performs ADB handshake + RSA key auth
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const connection = await device.connect() as any;

    const transport = await AdbDaemonTransport.authenticate({
      serial: device.serial,
      connection,
      credentialStore,
    });

    authPrompt.classList.add("hidden");

    adb = new Adb(transport);

    // Show device info — NOOK uses ro.product.overall.name, not ro.product.model
    const model =
      (await safeGetProp(adb, "ro.product.overall.name")) ??
      (await safeGetProp(adb, "ro.product.name")) ??
      (await safeGetProp(adb, "ro.product.model")) ??
      "Unknown model";
    const manufacturer =
      (await safeGetProp(adb, "ro.product.manufacturer")) ?? "";
    const androidVer =
      (await safeGetProp(adb, "ro.build.version.release")) ?? "?";
    const serial = transport.serial;
    const displayName = [manufacturer, model].filter(Boolean).join(" ");

    // Detect TRMNL app install + version
    const PACKAGE = "com.bpmct.trmnl_nook_simple_touch";
    const pkgList = await safeRunCommand(adb, `pm list packages ${PACKAGE}`);
    const installed = pkgList?.includes(PACKAGE) ?? false;
    let appVersion: string | null = null;
    if (installed) {
      // Android 2.1 only stores versionCode in /data/system/packages.xml.
      // Fetch versionCode→versionName mapping from GitHub releases API.
      const pkgsXml = await safeRunCommand(adb,
        `grep "com.bpmct.trmnl" /data/system/packages.xml`
      );
      const versionCode = pkgsXml?.match(/version="(\d+)"/)?.[1] ?? null;
      if (versionCode) {
        try {
          const res = await fetch("/api/releases");
          const releases = await res.json() as Array<{ versionCode: string; versionName: string; tag: string; url: string }>;
          const match = releases.find(r => r.versionCode === versionCode);
          const latest = releases[0];
          if (match) {
            const isLatest = match.versionCode === latest.versionCode;
            appVersion = isLatest
              ? match.versionName
              : `${match.versionName} → <a href="${latest.url}" target="_blank">${latest.versionName} available</a>`;
          } else {
            appVersion = `build ${versionCode}`;
          }
        } catch {
          // Fall back to build-time value
          appVersion = versionCode === VERSION_CODE ? VERSION_NAME : `build ${versionCode}`;
        }
      }
    }
    const appRow = installed
      ? `<tr><td>TRMNL app</td><td><code>${appVersion ? `v${appVersion}` : "?"} ✅</code></td></tr>`
      : `<tr><td>TRMNL app</td><td><code>not installed ❌</code></td></tr>`;

    deviceInfo.innerHTML = `
      <table>
        <tr><td>Serial</td><td><code>${escHtml(serial)}</code></td></tr>
        <tr><td>Device</td><td><code>${escHtml(displayName)}</code></td></tr>
        <tr><td>Android</td><td><code>${escHtml(androidVer)}</code></td></tr>
        ${appRow}
      </table>`;
    deviceInfo.classList.remove("hidden");

    setStatus(true, `Connected — ${displayName}`);
    setConnectedUI(true);

    appendOutput(
      `# Connected to ${serial} (${displayName}, Android ${androidVer})\n# Type a command above and press Run, or use the quick buttons.\n\n`
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    showError(msg);
    console.error(err);
    setStatus(false, "Connection failed");
    authPrompt.classList.add("hidden");
    btnConnect.disabled = false;
  }
});

// ---------------------------------------------------------------------------
// Disconnect
// ---------------------------------------------------------------------------
btnDisconnect.addEventListener("click", async () => {
  if (adb) {
    try {
      await adb.close();
    } catch {
      // ignore
    }
    adb = null;
  }
  setStatus(false, "Disconnected");
  setConnectedUI(false);
  appendOutput("\n# Disconnected.\n");
});

// ---------------------------------------------------------------------------
// Run shell command
// ---------------------------------------------------------------------------
async function runCommand(cmd: string) {
  if (!adb) return;
  if (!cmd.trim()) return;

  btnRun.disabled = true;
  appendOutput(`\n$ ${cmd}\n`);

  try {
    // Try shell protocol first (Android 4+), fall back to noneProtocol (Android 2.x)
    // shellProtocol may be undefined on very old devices
    const shellSvc = adb.subprocess.shellProtocol;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let outputStream: any;
    let exitedPromise: Promise<number> | undefined;

    if (shellSvc && shellSvc.isSupported) {
      const proc = await shellSvc.spawn(cmd);
      outputStream = proc.stdout;     // ShellProtocolProcess has .stdout
      exitedPromise = proc.exited;    // Promise<number> with exit code
    } else {
      // Legacy Android < 4 (NOOK Simple Touch): exec: not supported, use shell: via pty()
      const proc = await adb.subprocess.noneProtocol.pty(cmd);
      outputStream = proc.output;
      // pty exited is Promise<void>, no exit code
    }

    const decoder = new TextDecoder();
    const reader = outputStream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        appendOutput(decoder.decode(value, { stream: true }));
      }
    } finally {
      reader.releaseLock();
    }

    if (exitedPromise) {
      const exitCode = await exitedPromise;
      if (exitCode !== 0) {
        appendOutput(`\n[exit ${exitCode}]\n`);
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    appendOutput(`\n[error: ${msg}]\n`);
    showError(msg);
  } finally {
    btnRun.disabled = false;
    cmdInput.value = "";
    cmdInput.focus();
  }
}

btnRun.addEventListener("click", () => runCommand(cmdInput.value));

cmdInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runCommand(cmdInput.value);
});

btnClear.addEventListener("click", () => {
  output.textContent = "";
});

quickCmds.forEach((btn) => {
  btn.addEventListener("click", () => {
    const cmd = btn.dataset.cmd ?? "";
    cmdInput.value = cmd;
    runCommand(cmd);
  });
});

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

async function safeRunCommand(adb: Adb, cmd: string): Promise<string | null> {
  try {
    const shellSvc = adb.subprocess.shellProtocol;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let outputStream: any;
    if (shellSvc && shellSvc.isSupported) {
      const proc = await shellSvc.spawn(cmd);
      outputStream = proc.stdout;
    } else {
      const proc = await adb.subprocess.noneProtocol.pty(cmd);
      outputStream = proc.output;
    }
    const chunks: Uint8Array[] = [];
    const reader = outputStream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    const text = new TextDecoder().decode(
      chunks.reduce((acc, c) => {
        const merged = new Uint8Array(acc.length + c.length);
        merged.set(acc); merged.set(c, acc.length);
        return merged;
      }, new Uint8Array())
    );
    return text.trim() || null;
  } catch {
    return null;
  }
}

async function safeGetProp(adb: Adb, prop: string): Promise<string | null> {
  try {
    const shellSvc = adb.subprocess.shellProtocol;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let outputStream: any;
    if (shellSvc && shellSvc.isSupported) {
      const proc = await shellSvc.spawn(`getprop ${prop}`);
      outputStream = proc.stdout;
    } else {
      // pty() on Android 2.x may include a trailing shell prompt — we strip it below
      const proc = await adb.subprocess.noneProtocol.pty(`getprop ${prop}`);
      outputStream = proc.output;
    }
    const process = { stdout: outputStream };
    const chunks: Uint8Array[] = [];
    const reader = process.stdout.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    const text = new TextDecoder().decode(
      chunks.reduce((acc, c) => {
        const merged = new Uint8Array(acc.length + c.length);
        merged.set(acc);
        merged.set(c, acc.length);
        return merged;
      }, new Uint8Array())
    );
    return text.trim() || null;
  } catch {
    return null;
  }
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}



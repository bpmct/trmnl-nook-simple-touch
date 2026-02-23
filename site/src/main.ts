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
const btnInstall = document.getElementById("btn-install") as HTMLButtonElement | null;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let adb: Adb | null = null;
let pendingApkUrl: string | null = null;

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

function handleUnexpectedDisconnect(reason: string) {
  if (!adb) return; // already handled
  adb = null;
  setStatus(false, "Disconnected");
  setConnectedUI(false);
  appendOutput(`\n# ⚠️ USB connection lost: ${reason}\n# Unplug and reconnect, then click Connect.\n`);
  showError(`USB disconnected: ${reason}`);
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
// Refresh TRMNL app info rows in the device table
// ---------------------------------------------------------------------------
async function refreshAppInfo(adbInst: Adb, installed: boolean, cachedPkgLine?: string | null) {
  // Remove any existing app rows first
  deviceInfo.querySelectorAll("tr.app-row").forEach(r => r.remove());

  let appVersionName: string | null = null;
  let updateAvailable: { versionName: string; url: string; apkUrl: string | null } | null = null;

  if (installed) {
    // Use cached packages.xml line if available (avoids re-reading on connect).
    // On re-check after install, re-read it fresh.
    let pkgsXml = cachedPkgLine ?? null;
    if (!pkgsXml) {
      pkgsXml = await safeRunCommand(adbInst, `grep "com.bpmct.trmnl" /data/system/packages.xml`);
      if (!pkgsXml) {
        const fullXml = await safeRunCommand(adbInst, `cat /data/system/packages.xml`);
        pkgsXml = fullXml?.split("\n").find(l => l.includes("com.bpmct.trmnl")) ?? null;
      }
    }
    appendOutput(`# [debug] packages.xml line: ${JSON.stringify(pkgsXml)}\n`);

    const versionCode = pkgsXml?.match(/version="(\d+)"/)?.[1] ?? null;
    appendOutput(`# [debug] versionCode: ${versionCode}\n`);

    if (versionCode) {
      try {
        const res = await fetch("/api/releases");
        const releases = await res.json() as Array<{ versionCode: string; versionName: string; tag: string; url: string; apkUrl: string | null }>;
        appendOutput(`# [debug] releases fetched: ${releases.length}, codes: ${releases.map(r => r.versionCode).join(", ")}\n`);

        const match = releases.find(r => r.versionCode === versionCode);
        const latest = releases[0];
        if (match) {
          appVersionName = match.versionName;
          if (match.versionCode !== latest.versionCode) {
            updateAvailable = { versionName: latest.versionName, url: latest.url, apkUrl: latest.apkUrl };
          }
        } else {
          appVersionName = `build ${versionCode}`;
        }
      } catch (e) {
        appendOutput(`# [debug] releases fetch error: ${e}\n`);
        appVersionName = versionCode === VERSION_CODE ? VERSION_NAME : `build ${versionCode}`;
      }
    } else {
      appendOutput(`# [debug] could not extract versionCode from grep output\n`);
    }
  }

  // Store APK URL for install button
  if (installed) {
    pendingApkUrl = updateAvailable?.apkUrl ?? null;
    if (btnInstall) {
      if (updateAvailable?.apkUrl) {
        btnInstall.classList.remove("hidden");
        btnInstall.disabled = false;
        btnInstall.textContent = "Install v" + updateAvailable.versionName;
      } else {
        btnInstall.classList.add("hidden");
      }
    }
  } else {
    // Not installed — fetch latest release and offer fresh install
    pendingApkUrl = null;
    try {
      const res = await fetch("/api/releases");
      const releases = await res.json() as Array<{ versionCode: string; versionName: string; tag: string; url: string; apkUrl: string | null }>;
      const latest = releases[0];
      if (latest?.apkUrl) {
        pendingApkUrl = latest.apkUrl;
        if (btnInstall) {
          btnInstall.classList.remove("hidden");
          btnInstall.disabled = false;
          btnInstall.textContent = "Install v" + latest.versionName;
        }
      }
    } catch {
      // no releases available, leave button hidden
    }
  }

  // Append rows to existing table
  const table = deviceInfo.querySelector("table");
  if (!table) return;
  const mkRow = (label: string, html: string) => {
    const tr = document.createElement("tr");
    tr.className = "app-row";
    tr.innerHTML = `<td>${escHtml(label)}</td><td>${html}</td>`;
    table.appendChild(tr);
  };

  if (installed) {
    mkRow("TRMNL app", "✅ installed");
    mkRow("Version", `<code>${appVersionName ? `v${escHtml(appVersionName)}` : "?"}</code>`);
    mkRow("Update", updateAvailable
      ? `<span class="update-badge">⬆ v${escHtml(updateAvailable.versionName)} available</span> <a class="update-link" href="${escHtml(updateAvailable.url)}" target="_blank">release notes</a>`
      : `<span class="up-to-date">✓ up to date</span>`
    );
  } else {
    mkRow("TRMNL app", "❌ not installed");
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

    appendOutput("# Building credential store…\n");
    const credentialStore = await buildCredentialStore();
    appendOutput("# Credential store ready\n");

    const manager = AdbWebUsbBackendManager.BROWSER;
    if (!manager) {
      throw new Error("WebUSB not available — use Chrome or Edge.");
    }

    appendOutput("# Opening device picker…\n");
    const device = await manager.requestDevice();
    if (!device) {
      appendOutput("# Picker cancelled\n");
      setStatus(false, "Disconnected");
      btnConnect.disabled = false;
      return;
    }

    appendOutput(`# Device selected: ${device.serial}\n`);
    setStatus(false, "Connecting…");
    authPrompt.classList.remove("hidden");

    appendOutput("# Establishing USB connection…\n");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const connection = await device.connect() as any;
    appendOutput("# USB connected — authenticating…\n");

    const transport = await AdbDaemonTransport.authenticate({
      serial: device.serial,
      connection,
      credentialStore,
    });
    appendOutput("# ADB authenticated\n");

    authPrompt.classList.add("hidden");

    adb = new Adb(transport);

    // Watch for unexpected USB disconnects (transferIn/transferOut NetworkError)
    transport.disconnected.then(() => {
      if (adb) handleUnexpectedDisconnect("Device disconnected");
    }).catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      handleUnexpectedDisconnect(msg);
    });

    // Show device info — NOOK uses ro.product.overall.name, not ro.product.model
    appendOutput("# Reading device props…\n");
    const serial = transport.serial;
    const model =
      (await safeGetProp(adb, "ro.product.overall.name")) ??
      (await safeGetProp(adb, "ro.product.name")) ??
      (await safeGetProp(adb, "ro.product.model")) ??
      "Unknown model";
    appendOutput(`# model: ${model}\n`);
    const manufacturer =
      (await safeGetProp(adb, "ro.product.manufacturer")) ?? "";
    const androidVer =
      (await safeGetProp(adb, "ro.build.version.release")) ?? "?";
    const displayName = [manufacturer, model].filter(Boolean).join(" ");
    appendOutput(`# device: ${displayName}, Android ${androidVer}\n`);

    // Skip pm list packages (slow on Android 2.1) — read packages.xml directly.
    // If the package line exists there, it's installed.
    appendOutput("# Checking TRMNL app…\n");
    const PACKAGE = "com.bpmct.trmnl_nook_simple_touch";
    const pkgsXmlQuick = await safeRunCommand(adb, `grep "com.bpmct.trmnl" /data/system/packages.xml`) ??
      await safeRunCommand(adb, `cat /data/system/packages.xml`).then(x => x?.split("\n").find(l => l.includes("com.bpmct.trmnl")) ?? null);
    const installed = pkgsXmlQuick?.includes(PACKAGE) ?? false;
    appendOutput(`# installed: ${installed}\n`);

    deviceInfo.innerHTML = `
      <table>
        <tr><td>Serial</td><td><code>${escHtml(serial)}</code></td></tr>
        <tr><td>Device</td><td><code>${escHtml(displayName)}</code></td></tr>
        <tr><td>Android</td><td><code>${escHtml(androidVer)}</code></td></tr>
      </table>`;
    deviceInfo.classList.remove("hidden");
    await refreshAppInfo(adb, installed, pkgsXmlQuick);

    setStatus(true, `Connected — ${displayName}`);
    setConnectedUI(true);

    appendOutput(
      `# Connected to ${serial} (${displayName}, Android ${androidVer})\n# Type a command above and press Run, or use the quick buttons.\n\n`
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    appendOutput(`\n# ❌ Connection failed: ${msg}\n`);
    showError(msg);
    console.error(err);
    setStatus(false, "Connection failed");
    authPrompt.classList.add("hidden");
    btnConnect.disabled = false;
  }
});

// ---------------------------------------------------------------------------
// OTA Install — download APK in browser, push via ADB sync, pm install
// ---------------------------------------------------------------------------
async function installUpdate(apkUrl: string) {
  if (!adb) return;
  const adbInst = adb;
  const btn = btnInstall;
  if (btn) { btn.disabled = true; btn.textContent = "Downloading…"; }
  appendOutput("\n# Starting OTA update…\n");

  try {
    // 1. Download APK via dev-server proxy (avoids CORS + S3 redirect issues)
    const proxyUrl = `/api/download?url=${encodeURIComponent(apkUrl)}`;
    appendOutput(`# Downloading APK from GitHub…\n`);
    const resp = await fetch(proxyUrl);
    if (!resp.ok) throw new Error(`Download failed: HTTP ${resp.status}`);
    const apkBytes = new Uint8Array(await resp.arrayBuffer());
    appendOutput(`# Downloaded ${(apkBytes.byteLength / 1024 / 1024).toFixed(1)} MB\n`);

    // 2. Push APK to device via ADB sync
    const REMOTE_PATH = "/data/local/tmp/trmnl_update.apk";
    appendOutput(`# Pushing to ${REMOTE_PATH}…\n`);
    if (btn) btn.textContent = "Pushing to device…";

    const sync = await adbInst.sync();
    try {
      // Wrap Uint8Array in a native ReadableStream<Uint8Array> for AdbSync.write()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fileStream = new ReadableStream<any>({
        start(controller) {
          controller.enqueue(apkBytes);
          controller.close();
        }
      });
      await sync.write({
        filename: REMOTE_PATH,
        file: fileStream as unknown as import("@yume-chan/stream-extra").ReadableStream<import("@yume-chan/stream-extra").MaybeConsumable<Uint8Array>>,
        permission: 0o644,
      });
    } finally {
      await sync.dispose();
    }
    appendOutput(`# Push complete\n`);

    // 3. Install via pm install
    // Android 2.1 pty mode may swallow pm install output — give it 60s and
    // verify success by re-checking pm list packages rather than parsing output.
    if (btn) btn.textContent = "Installing… (may take ~30s)";
    appendOutput(`# Running pm install… (may take ~30s)\n`);
    const result = await safeRunCommand(adbInst, `pm install -r ${REMOTE_PATH}`, 90000);
    appendOutput(`# pm install output: ${result ?? "(none)"}\n`);

    // 4. Cleanup
    await safeRunCommand(adbInst, `rm ${REMOTE_PATH}`);

    // Verify by checking pm list packages — more reliable than parsing pm output on Android 2.1
    appendOutput(`# Verifying install…\n`);
    const pkgCheck = await safeRunCommand(adbInst, `pm list packages com.bpmct.trmnl_nook_simple_touch`, 20000);
    const verified = pkgCheck?.includes("com.bpmct.trmnl_nook_simple_touch") ?? false;

    if (verified) {
      appendOutput(`# ✅ Install verified! Checking version…\n`);
      if (btn) btn.textContent = "Verifying…";
      await refreshAppInfo(adbInst, true);
      appendOutput(`# Version check complete.\n`);
      if (btn) btn.textContent = "✅ Installed";
    } else {
      appendOutput(`# ⚠️ Package not found after install — it may have failed.\n`);
      if (btn) { btn.disabled = false; btn.textContent = "Retry Install"; }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    appendOutput(`# ❌ Install failed: ${msg}\n`);
    showError(`Install failed: ${msg}`);
    if (btn) { btn.disabled = false; btn.textContent = "Retry Install"; }
  }
}

btnInstall?.addEventListener("click", () => {
  if (pendingApkUrl) installUpdate(pendingApkUrl);
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

async function safeRunCommand(adb: Adb, cmd: string, timeoutMs = 10000): Promise<string | null> {
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
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Command timed out after ${timeoutMs}ms: ${cmd}`)), timeoutMs)
    );
    try {
      while (true) {
        const { done, value } = await Promise.race([
          reader.read(),
          timeout,
        ]);
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



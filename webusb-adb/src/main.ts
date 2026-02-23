/**
 * WebUSB ADB — Browser-based ADB client for NOOK Simple Touch
 *
 * Uses @yume-chan/adb + @yume-chan/adb-backend-webusb (ya-webadb v2).
 *
 * API notes (ya-webadb 0.0.24+):
 *   - AdbDaemonWebUsbDeviceManager  — manages USB device selection/listing
 *   - AdbDaemonWebUsbDevice         — wraps a USBDevice, provides connect()
 *   - AdbDaemonTransport            — the transport layer
 *   - Adb                           — main ADB client
 *   - AdbCredentialStore / AdbAuthenticationHandler — RSA key auth
 */

import { Adb, AdbDaemonTransport, AdbWebCredentialStore } from "@yume-chan/adb";
import {
  AdbDaemonWebUsbDeviceManager,
  AdbDaemonWebUsbDevice,
} from "@yume-chan/adb-backend-webusb";

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
let credentialStore: AdbWebCredentialStore | null = null;

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

    // Credential store persists RSA keys in IndexedDB
    credentialStore = new AdbWebCredentialStore("webusb-adb");

    // Show the browser's device picker (filters to ADB-compatible devices)
    const manager = AdbDaemonWebUsbDeviceManager.BROWSER!;
    if (!manager) {
      throw new Error("WebUSB ADB device manager unavailable.");
    }

    let device: AdbDaemonWebUsbDevice;
    try {
      device = await manager.requestDevice();
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "NotFoundError") {
        // User cancelled picker
        setStatus(false, "Disconnected");
        btnConnect.disabled = false;
        return;
      }
      throw e;
    }

    setStatus(false, "Connecting…");
    authPrompt.classList.remove("hidden");

    // Connect — this performs ADB handshake + RSA key auth
    const connection = await device.connect();

    const transport = await AdbDaemonTransport.authenticate({
      serial: device.serial,
      connection,
      credentialStore: credentialStore,
    });

    authPrompt.classList.add("hidden");

    adb = new Adb(transport);

    // Show device info
    const model =
      (await safeGetProp(adb, "ro.product.model")) ?? "Unknown model";
    const androidVer =
      (await safeGetProp(adb, "ro.build.version.release")) ?? "?";
    const serial = transport.serial;

    deviceInfo.innerHTML = `
      <table>
        <tr><td>Serial</td><td><code>${escHtml(serial)}</code></td></tr>
        <tr><td>Model</td><td><code>${escHtml(model)}</code></td></tr>
        <tr><td>Android</td><td><code>${escHtml(androidVer)}</code></td></tr>
      </table>`;
    deviceInfo.classList.remove("hidden");

    setStatus(true, `Connected — ${model}`);
    setConnectedUI(true);

    appendOutput(
      `# Connected to ${serial} (${model}, Android ${androidVer})\n# Type a command above and press Run, or use the quick buttons.\n\n`
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
    // Use shell protocol for proper exit codes when available,
    // fall back to noneProtocol (legacy, Android < 4.x)
    const process = await adb.subprocess.spawn(cmd);

    const decoder = new TextDecoder();

    // Pipe stdout
    const stdout = process.stdout;
    const reader = stdout.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        appendOutput(decoder.decode(value, { stream: true }));
      }
    } finally {
      reader.releaseLock();
    }

    const exitCode = await process.exit;
    if (exitCode !== 0) {
      appendOutput(`\n[exit ${exitCode}]\n`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    appendOutput(`\n[error: ${msg}]\n`);
    showError(msg);
  } finally {
    btnRun.disabled = false;
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

async function safeGetProp(adb: Adb, prop: string): Promise<string | null> {
  try {
    const process = await adb.subprocess.spawn(`getprop ${prop}`);
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



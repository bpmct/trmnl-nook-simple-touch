# Agent notes (legacy Android / NOOK Simple Touch)

This repo targets very old Android and an Eclipse ADT / Ant-era workflow.
Do not suggest modern Android tooling or APIs unless they are explicitly
compatible with Android 2.1 (API 7).

Current notes:
- Main entry activity: `DisplayActivity`.
- API credentials/base URL live in app settings (`ApiPrefs`).

## Key Patterns

ADB-over-TCP on NOOK is flaky after sleep/wake. The `nook-adb.sh` script
auto-recovers from `offline` state (kill-server → reconnect cycle), so
**always use `tools/nook-adb.sh`** — never call `adb` directly.

Saved file logs (when "Save to file" enabled) live at:
- `/media/My Files/trmnl.log`

To read logs:
```bash
# Using nook-adb.sh wrapper (recommended)
tools/nook-adb.sh --ip <ip> get-logs [n]  # default: last 200 lines

# Or direct adb command
adb -s <ip>:5555 shell "tail -n 200 '/media/My Files/trmnl.log'"
```

### HTTP Requests
- All HTTPS goes through `BouncyCastleHttpClient` (TLS 1.2 support for old Android)
- HTTP (non-TLS) supported when "Allow HTTP" setting enabled (for BYOS/local servers)
- Self-signed certs supported when "Allow self-signed certificates" enabled
- **Always retry failed requests** with 3s backoff (network often flaky after wake)
- Wait for WiFi connectivity before attempting fetches (`waitForWifiThenFetch()`)
- Image fetches need retry too, not just API calls

### Testing on Device

**Standard workflow for testing changes:**

```bash
# Always use build-install-run (builds, installs, launches app)
NOOK_IP=<ip> tools/nook-adb.sh build-install-run

# Or with logcat output:
NOOK_IP=<ip> tools/nook-adb.sh build-install-run-logcat
```

**Initial worktree setup:**
- Run `.mux/init` to symlink `local.properties` and JAR files from main repo
- This is required for worktrees to build successfully

**Other useful commands:**
- Run logcat in background: `tools/nook-adb.sh logcat` to monitor while testing
- Read file logs: `tools/nook-adb.sh --ip <ip> get-logs [n]` (default: 200 lines)
- Device often goes offline when WiFi auto-disabled; use "Auto-disable WiFi" setting OFF during dev
- ADB reconnect: `tools/nook-adb.sh connect` after device comes back online
- Clean build: `tools/nook-adb.sh --clean build-install-run`

### Boot & Error UX

### Prefs presets (SaaS / BYOS)

Device config presets live in `~/trmnl-prefs/` and are shared across all worktrees via symlink (created by `.mux/init`).

To switch settings quickly, create preset files like `~/trmnl-prefs/myserver.args`. Use one argument per line so the shell doesn't have to parse quoting.

Example: `prefs/selfhosted.args`

```
--string
api_id
A1:B2:C3:D4:E5:F6
--string
api_token
YOUR_TOKEN
--string
api_base_url
http://192.168.1.232:2300/api
--bool
allow_http
true
--bool
allow_sleep
false
```

Apply with:

```
tools/nook-adb.sh --ip <ip> set-preset selfhosted
```

For SaaS, create `prefs/saas.args` with the hosted credentials/base URL, then:

```
tools/nook-adb.sh --ip <ip> set-preset saas
```
- Boot screen: header with icon + status text + streaming logs below
- Update status via `setBootStatus("message")` during boot
- On error: show boot header with "Error - tap to retry" + full logs
- Call `hideBootScreen()` only when content successfully loads

### Logging
- `logD()`/`logW()` stream to screen during boot (while `!bootComplete`)
- After boot completes, logs only go to Android logcat
- `logE()` always shows on screen

## Index

### Worktree merge notes

When `main` is checked out in another worktree, you can't switch it here. Use a worktree-safe patch:

```
# from this worktree

git format-patch origin/main --stdout > /tmp/adb-device-ad7e.patch

# then in the main worktree

git apply /tmp/adb-device-ad7e.patch

git commit -am "Merge adb-device-ad7e changes"
```

- `AGENTS/platform-constraints.md`
- `AGENTS/build-tooling.md`
- `AGENTS/release.md`
- `AGENTS/tls-network.md`
- `AGENTS/sleep-wake-cycle.md`
- `AGENTS/ux-patterns.md`
- `AGENTS/references.md`


# UX Patterns

## Boot Screen
The app shows a boot screen on startup with:
- Header: TRMNL icon + status text (e.g., "Starting...", "Waiting for WiFi...", "Fetching...")
- Logs: Streaming below the header showing connection progress

Update boot status: `setBootStatus("message")`  
Hide boot screen when done: `hideBootScreen()`

## Error Handling
On fetch failure (after retries):
- Keep boot header visible with "Error - tap to retry"
- Show full logs so user can see what went wrong
- Tap anywhere to open menu and retry

## Network Retry Logic
Both API and image fetches use the same pattern:
```java
for (int attempt = 1; attempt <= 2; attempt++) {
    if (attempt > 1) {
        logW("Attempt failed - retrying in 3s");
        Thread.sleep(3000);
    }
    result = fetch();
    if (success) break;
}
```

## Menu States
- Normal: Battery + Next + Settings buttons
- Loading: "Loading..." status, no buttons
- Error: Error message + Next button for retry

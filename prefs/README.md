# Local prefs presets (ignored)

Store local, machine-specific preference presets here. Files in this folder are gitignored.

Suggested format: `*.args` with one argument per line. Example (`prefs/selfhosted.args`):

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

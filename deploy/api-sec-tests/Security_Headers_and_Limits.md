# Security Headers & Limits — Recomendaciones
## Headers
- Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
- X-Content-Type-Options: nosniff
- Referrer-Policy: no-referrer
- Permissions-Policy: camera=(self "https://sandra.local"), microphone=(self "https://sandra.local"), geolocation=()
- Cross-Origin-Opener-Policy: same-origin
- Cross-Origin-Resource-Policy: same-site

## Rate limits sugeridos (staging = prod o más estricto)
- /chat: 30 req/min por client_id; burst 10/10s
- /realtime-voice: 6 sesiones activas/usuario; bitrate TTS máx 64 kbps
- /vision: 12 req/min; payload ≤ 3 MB; tipos: image/png,jpeg,webp

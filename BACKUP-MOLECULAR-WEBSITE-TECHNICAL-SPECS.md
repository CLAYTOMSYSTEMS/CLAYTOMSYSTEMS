# BACKUP — Molecular Website Technical Specs

This document contains **ready-to-use code** and integration notes for the ClayTomSystems molecular homepage
with Three.js particles and the **CEO Command Center** stub connected to `api-gateway /commands`.

## Files
- `index.html` — Full page with GPU particles + Command Center panel.
- `chatbots-400.json` — 400 autonomous development chatbots.
- `manifest-400.csv` & `chatbots-400-list.csv` — quick audit.

## CEO Command Center API
- POST **/commands** `{ command: "activate"|"scale"|"train"|"report", target?: string, count?: number }`
- GET  **/chatbots** — passthrough to profiles.
- WS  **/realtime** — proxy to realtime-bridge (for voice).

### Example curl
```bash
curl -s -X POST https://api.claytomsystems.com/commands   -H 'content-type: application/json'   -d '{"command":"activate","target":"revenue_optimizer","count":10}'
```

## Realtime voice
- Browser connects to `wss://api.claytomsystems.com/realtime` (gateway → bridge → OpenAI Realtime).
- Audio: 16kHz PCM mono; VAD & barge-in handled on client/bridge.

## Fallback
- If WebGL is unavailable, provide a CSS-only fallback or reduce particles to 300 for low-powered devices.

## Deployment
- Serve `index.html` from Netlify / NGINX.
- Ensure CORS and `Permissions-Policy: microphone=self` headers are enabled.

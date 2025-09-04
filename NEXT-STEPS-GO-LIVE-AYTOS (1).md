# GO-LIVE — Ayuntamientos 01/02 (Checklist)

**Fecha (UTC):** 2025-09-04 12:24:36Z

1) DNS  → Crear A/AAAA:
   - `ayuntamientos-modelo-01.guestsvalencia.es` → IP del servidor Docker
   - `ayuntamientos-modelo-02.guestsvalencia.es` → IP del servidor Docker

2) Traefik → Cargar reglas (2 dominios):
```bash
cp traefik-dynamic-2.yml ./traefik/dynamic.yml
docker compose -f docker-compose.brand-switcher.yml up -d
```

3) Brand-switcher → Inyectar config
   - `prompts-ayuntamientos.json`
   - `avatars-ayuntamientos.json` (rellenar IDs HeyGen/OpenAI)

4) Verificación TLS
```bash
curl -I https://ayuntamientos-modelo-01.guestsvalencia.es
curl -I https://ayuntamientos-modelo-02.guestsvalencia.es
```

5) Mic 3-en-1 → Chrome Desktop
   - VAD = **0.045**
   - Latencia p95 **≤ 300 ms**
   - Barge-in: hablar → interrumpe al avatar

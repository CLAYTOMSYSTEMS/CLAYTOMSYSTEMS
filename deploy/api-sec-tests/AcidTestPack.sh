#!/usr/bin/env bash
# Acid Test Pack — API Staging
# Endpoint: https://api-staging.sandra.local/v1
# Usage: export TOKEN="<JWT_5min>"; bash AcidTestPack.sh

set -euo pipefail
BASE="https://api-staging.sandra.local/v1"
ORIGIN_OK="https://sandra.local"
CID_PREFIX="CEO-TEST-$(date +%s)"
HDRS=(-H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json")

echo "1) Rate limiting / burst control"
for i in $(seq 1 45); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "${HDRS[@]}" -H "X-Correlation-Id: RL-$i" -H "Origin: ${ORIGIN_OK}" -d '{"message":"ping"}' "$BASE/chat")
  echo "$i => $code"
  sleep 0.5
done

echo "2) Schema validation estricta (reject unknown fields)"
curl -i "${HDRS[@]}" -H "X-Correlation-Id: ${CID_PREFIX}-SCHEMA" -H "Origin: ${ORIGIN_OK}" -d '{"message":"hola","__hacker":"x"}' "$BASE/chat" || true

echo "3) Error sanitization / ruta inexistente"
curl -i "${HDRS[@]}" -H "X-Correlation-Id: ${CID_PREFIX}-404" -H "Origin: ${ORIGIN_OK}" "$BASE/does-not-exist" || true

echo "4) JWT expiración (esperar manualmente 5 min y reintentar /chat)"
echo "   -> Tras caducar el token, espera 5 min y ejecuta:"
echo "curl -i ${HDRS[@]} -H 'X-Correlation-Id: ${CID_PREFIX}-EXP' -H 'Origin: ${ORIGIN_OK}' -d '{"message":"hola"}' $BASE/chat"

echo "5) CORS estricto (origen no permitido)"
curl -i "${HDRS[@]}" -H "X-Correlation-Id: ${CID_PREFIX}-CORS" -H "Origin: https://malicioso.example" -d '{"message":"hola"}' "$BASE/chat" || true

echo "6) mTLS interno: verificar en logs del gateway (manual)"
echo "   -> Revisar verificación de certificado de cliente ok"

echo "7) PII en logs: tokenización"
curl -i "${HDRS[@]}" -H "X-Correlation-Id: ${CID_PREFIX}-PII" -H "Origin: ${ORIGIN_OK}" -d '{"message":"Mi nombre Ana, tel 600123123"}' "$BASE/chat" || true

echo "8) Uploads seguros (vision) — imagen válida"
curl -i -X POST -H "Authorization: Bearer ${TOKEN}" -H "X-Correlation-Id: ${CID_PREFIX}-IMGOK" -H "Origin: ${ORIGIN_OK}"   -F "prompt=describe" -F "image=@/etc/hosts;type=image/png" "$BASE/vision" || true
echo "   (sustituye /etc/hosts por una imagen real .png/.jpg/.webp)"

echo "8b) Uploads: tipo no permitido (exe) — debe bloquear"
echo -n "MZ" > /tmp/fake.exe
curl -i -X POST -H "Authorization: Bearer ${TOKEN}" -H "X-Correlation-Id: ${CID_PREFIX}-EXE" -H "Origin: ${ORIGIN_OK}"   -F "prompt=describe" -F "image=@/tmp/fake.exe;type=application/octet-stream" "$BASE/vision" || true

echo "9) Idempotencia en POST con efectos (simulado)"
curl -i "${HDRS[@]}" -H "X-Correlation-Id: ${CID_PREFIX}-IDEMP1" -H "Idempotency-Key: TEST-123" -H "Origin: ${ORIGIN_OK}"   -d '{"message":"reservar"}' "$BASE/chat" || true
curl -i "${HDRS[@]}" -H "X-Correlation-Id: ${CID_PREFIX}-IDEMP2" -H "Idempotency-Key: TEST-123" -H "Origin: ${ORIGIN_OK}"   -d '{"message":"reservar"}' "$BASE/chat" || true

echo "10) Telemetría y trazas — validar en dashboard (manual)"
echo "   -> Exporta p50/p95, 4xx/5xx, 429 y traza por X-Correlation-Id"

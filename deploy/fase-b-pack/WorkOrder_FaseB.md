# 🪖 WORK ORDER — FASE B (24–48h)
**Objetivo:** Endurecimiento avanzado y observabilidad productiva en staging.

## 0) Guardarraíles
- No tocar producción.  
- Rama `hardening/fase-b` + PR con 2 reviews (Lead + QA Sec).  
- Evidencias obligatorias en `#api-sec-audit` y anexo al Informe B.

## 1) Observabilidad avanzada
- Dashboards: latencias p50/p95/p99, error-rate 4xx/5xx, RPS, 429, CPU/RAM, colas.  
- Alertas (Pager): p95 /chat > 800 ms (10 min), 5xx > 1% (5 min), 429 spikes (5 min), caídas de mTLS.  
- Correlación completa por `X-Correlation-Id` y `request_id` interno.

## 2) DAST + Fuzz (contrato OpenAPI)
- Baseline + autenticado (OWASP ZAP/u otro).  
- Fuzz de tipos/longitudes sobre `/chat`, `/vision`, `/avatar`.  
- Reporte con CVEs/OWASP Top 10 y fixes aplicados.

## 3) Idempotencia y concurrencia avanzada
- `Idempotency-Key` con almacenamiento de huellas 24 h.  
- Lock temporal por recurso/usuario para operaciones sensibles.  
- Reintentos con jitter + circuit breakers en dependencias.

## 4) Rate limiting y cuotas refinadas
- Cuotas mensuales por `client_id`.  
- `/realtime-voice`: limitar sesiones simultáneas/usuario + ancho de banda.  
- `/vision`: límites por tamaño y frecuencia; bloqueos graduados.

## 5) mTLS y SSL
- Automatizar emisión/renovación/instalación (los 13 SSL pendientes).  
- Rotación de certs internos y verificación estricta en gateway.

## 6) Gestión de secretos y SBOM
- Rotación de claves (≤ 90 días).  
- SBOM actualizado + auditoría de dependencias; parches críticos aplicados.

## 7) Entregables
- **Informe B** (2–3 páginas): métricas antes/después, lista de fixes, hallazgos DAST/Fuzz y su cierre.  
- **Dashboards y alertas** exportables (JSON).  
- **Checklist de idempotencia** y **política de cuotas** documentadas.  
- **Plan de rollback** de configuraciones de gateway.

## 8) Definition of Done (DoD)
- p95 /chat ≤ 700 ms | error-rate < 0.7% | 0 PII en logs (verificado).  
- 100% de los 13 SSL instalados + 5 configs cerradas.  
- DAST “sin hallazgos críticos/altos”.  
- Idempotencia verificada por pruebas repetidas y logs.

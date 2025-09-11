
# ClayTom Systems — Paquete 500,000 Marketing Agents (v1.0.0)

**Fecha de generación:** 2025-09-07

Este paquete contiene plantillas y runbooks para instanciar **500,000 agentes** especializados (95–97%)
en: creación de contenido, gestión de RRSS, marketing digital & influencer management, y producción audiovisual.

## Archivos
- `master_template.json` — contrato base ERA.
- `content_creator.json`, `social_manager.json`, `performance_marketer.json`, `audiovisual_producer.json` — perfiles por rol.
- `knowledge_collections.yaml` — fuentes y vectores.
- `tools.yaml` — herramientas y conexiones.
- `qa_scenarios.json` — smoke/acceptance tests.
- `runbook.sh` — despliegue automatizado (4×125k).

## Cómo activar (resumen)
1. `ctsctl login` y exporta credenciales de OAuth/API Keys requeridas por `tools.yaml`.
2. `bash runbook.sh`
3. Verifica el **Arsenal IA %**, engagement/CTR/ROAS en tu panel de observabilidad.

## SLO/SLA de calidad (95–97%)
- Éxito por intención (copy/storyboard/scheduler/ads/video) ≥ **95%** con revisión muestral.
- No publicar contenido sin consentimiento de marketing y marca.
- Escalado a humano ante “legal/privacidad/marca/pago”.


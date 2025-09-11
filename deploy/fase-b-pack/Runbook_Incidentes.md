# 📟 Runbook de Incidentes — Sandra API
## 0) Primeros 5 minutos
- Confirmar si el incidente afecta a usuarios; pausar despliegues.  
- Asignar **Incident Commander (IC)** y **Scribe**.  
- Abrir canal `#inc-<fecha>-<resumen>` y puente de voz.

## 1) Reunir señales
- Dashboards (latencias/errores/429), logs (correlation-id), estado mTLS, certificados, dependencias externas.  
- Identificar último cambio (código/config) y activar **change freeze**.

## 2) Diagnóstico rápido
- ¿Degradación o caída total? ¿Zona afectada (chat/voice/vision)?  
- ¿Errores 5xx o 4xx masivos? ¿Saturación de rate limit o CPU?

## 3) Tácticas
- Rollback al último artefacto estable.  
- Aplicar límites defensivos (rate/quota) temporales.  
- Desactivar rutas no críticas si es necesario.

## 4) Comunicación
- Actualizar estado cada 15 min en canal del incidente.  
- Notificar a stakeholders si supera 30 min de impacto.  
- Post-mortem en 48 h con acciones preventivas.

## 5) Cierre
- Confirmar recuperación de SLO.  
- Levantar freeze tras verificación.  
- Documentar aprendizajes y tareas de seguimiento.

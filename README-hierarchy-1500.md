# ClayTom — Hierarchy 1,500

**Composición exacta:** 35 dominios × 30 = 1,050 + Consejo Ejecutivo 450 = **1,500**.

## Integración rápida con `profiles-service`
1. Copia `hierarchy-1500.json` dentro del directorio `chatbots/` del repo.
2. Añade soporte de carga en `profiles-service` para este archivo o reemplaza los tres existentes.
3. Los sujetos NATS siguen el patrón `org.claytom.<domain>.<role>.<id>`.

## Cadena de mando
- Cada dominio: 5 Directors → 2 Coordinators c/u → 1 Specialist c/u + 1 Innovator mentorizado por Director.
- Consejo Ejecutivo (corporate): roles transversales con *mentors_domains* sobre 4 dominios por agente.

## Rutas NATS útiles
- Dominio completo: `org.claytom.<domain>.*.*`
- Solo Directors: `org.claytom.<domain>.director.*`
- Ejecutivos: `org.claytom.corporate.*.*`

## Métricas mínimas
- SLA dominio (tickets resueltos/día)
- Ciclo de aprendizaje (semanal) por *Autonomous Learning Master*
- Innovaciones aterrizadas/mes por dominio

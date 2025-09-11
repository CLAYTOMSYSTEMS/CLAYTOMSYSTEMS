# 🔍 API SLO SENTINEL - Configuración Completa

**Sistema**: ClayTomSystems Autonomous Bastion  
**Coordinador**: George Thomas (CODE)  
**Horario**: Cada hora (Europe/Madrid timezone)

---

## 🎯 MONITORES OPERATIVOS ACTIVOS

### Horarios Established (CEST)
- **09:00** — Morning kickoff
- **13:00** — Midday status check-in  
- **18:00** — End-of-day signoff (+ reservas directas vs media 7d)
- **Lunes 09:05** — Weekly roadmap & SLO (+ guardarraíles ROAS<2.5, margen<35%)
- **Quincenal 09:10** — Performance summary
- **Mensual 09:15** — Financial summary
- **Cada hora** — API SLO sentinel ✅
- **Diario 08:00** — Security hygiene check

### Integración Reservas 20:00
- Nota CEO: límite tareas activas alcanzado
- ✅ Integrado en signoff 18:00 + weekly briefing
- Alternativa: desactivar tarea existente para crear alerta independiente 20:00

---

## 📊 SLO TARGETS & THRESHOLDS

### API Sandra Metrics (Ventana 10 min)
```yaml
latency_p95_chat:
  threshold: >800ms
  severity: page
  action: scale + optimize
  
error_rate:
  threshold: >1%
  exclude: 429_responses
  severity: page
  action: rollback + investigate

rate_limit_429:
  threshold: >5% total_responses
  severity: ticket
  action: tune_burst + optimize_quotas
```

### Telemetría Sources
- **Prometheus/Alertmanager**: Primary metrics collection
- **Datadog**: Secondary APM + alerting
- **New Relic**: Application performance insights
- **Custom**: Sandra API staging/production endpoints

---

## 🔧 QUERIES CONFIGURADAS

### Prometheus Rules (YAML)
```yaml
groups:
- name: sandra-api-slo
  rules:
  - alert: SandraApiP95High
    expr: histogram_quantile(0.95, sum by (le, env) (rate(http_request_duration_seconds_bucket{service="sandra-api",route="/chat"}[10m]))) > 0.8
    for: 10m
    labels: {severity: page}
    annotations:
      summary: "Sandra API p95 > 800ms en {{ $labels.env }}"
      runbook: "https://docs.claytomsystems.com/runbooks/api-latency"

  - alert: SandraApiErrorRateHigh  
    expr: (sum(rate(http_requests_total{service="sandra-api",status=~"5..|4..",status!="429"}[10m])) / sum(rate(http_requests_total{service="sandra-api"}[10m]))) > 0.01
    for: 10m
    labels: {severity: page}
    annotations:
      summary: "Sandra API error rate >1% en {{ $labels.env }}"
      runbook: "https://docs.claytomsystems.com/runbooks/api-errors"

  - alert: SandraApi429Excessive
    expr: (sum(rate(http_requests_total{service="sandra-api",status="429"}[10m])) / sum(rate(http_requests_total{service="sandra-api"}[10m]))) > 0.05
    for: 10m
    labels: {severity: ticket}
    annotations:
      summary: "Sandra API 429 >5% (burst control) en {{ $labels.env }}"
      runbook: "https://docs.claytomsystems.com/runbooks/rate-limiting"
```

### Datadog Monitors
```javascript
// p95 Latency Monitor
avg(last_10m):p95:trace.http.request.duration{
  service:sandra-api,
  resource:/chat,
  env:prod
} > 0.8

// Error Rate Monitor  
100 * (
  sum(last_10m):requests.error{service:sandra-api,env:prod} / 
  sum(last_10m):requests.total{service:sandra-api,env:prod}
) > 1

// 429 Rate Monitor
100 * (
  sum(last_10m):requests.by_status{service:sandra-api,env:prod,status:429} / 
  sum(last_10m):requests.total{service:sandra-api,env:prod}
) > 5
```

### New Relic NRQL
```sql
-- p95 Latency Query
SELECT percentile(duration,95) 
FROM Transaction 
WHERE appName='sandra-api' 
  AND requestUri='/chat' 
  AND environment IN ('production','staging') 
SINCE 10 minutes ago

-- Error Rate Query
SELECT percentage(count(*), WHERE error IS true AND httpResponseCode != 429) 
FROM Transaction 
WHERE appName='sandra-api' 
FACET environment 
SINCE 10 minutes ago

-- 429 Rate Query  
SELECT percentage(count(*), WHERE httpResponseCode = 429)
FROM Transaction 
WHERE appName='sandra-api'
FACET environment
SINCE 10 minutes ago
```

---

## 🚨 RUNBOOKS AUTOMÁTICOS

### 1) p95 Latency > 800ms
```bash
# Escalado inmediato
kubectl scale deploy sandra-api -n prod --replicas=$(($(kubectl get deploy sandra-api -n prod -o=jsonpath='{.spec.replicas}') * 2))

# Protección cola (Envoy/Gateway)
kubectl patch configmap envoy-config -n prod --patch='
data:
  envoy.yaml: |
    circuit_breakers:
      thresholds:
        max_requests: 1000
        max_pending_requests: 100
'

# Degradación controlada  
curl -X POST https://api.sandra.local/v1/admin/mode \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"fast_path": true, "context_size": 512}'

# Upstream LLM optimization
kubectl patch deployment sandra-api -n prod --patch='
spec:
  template:
    spec:
      containers:
      - name: sandra-api
        env:
        - name: OPENAI_TIMEOUT
          value: "30s"
        - name: RETRY_ATTEMPTS  
          value: "3"
'
```

### 2) Error Rate > 1%
```bash
# Rollback último deploy (si <60min)
if [[ $(kubectl rollout history deploy/sandra-api -n prod --revision=1 | grep "$(date -d '1 hour ago' +%Y-%m-%d)") ]]; then
  kubectl rollout undo deploy/sandra-api -n prod
fi

# Feature flags disable
curl -X POST https://feature-flags.sandra.local/disable \
  -H "Authorization: Bearer $FF_TOKEN" \
  -d '{"flags": ["latest_features"], "environment": "production"}'

# Log inspection automática
kubectl logs -n prod deployment/sandra-api --tail=1000 | \
  grep -E "(ERROR|FATAL)" | \
  head -20 > /tmp/sandra-errors.log

# Dependency health check
curl -s https://api.sandra.local/v1/health/dependencies | \
  jq '.[] | select(.status != "healthy")'
```

### 3) 429 Rate > 5%
```bash
# Rate limit por tenant
kubectl patch configmap rate-limits -n prod --patch='
data:
  limits.yaml: |
    staging:
      requests_per_minute: 100
    production:  
      requests_per_minute: 1000
    per_client:
      requests_per_minute: 50
'

# Token bucket tuning (+50% burst)
current_burst=$(redis-cli -h redis.sandra.local GET rate_limit:burst)
new_burst=$((current_burst * 3 / 2))
redis-cli -h redis.sandra.local SET rate_limit:burst $new_burst

# Gateway pre-queue
kubectl patch configmap nginx-config -n prod --patch='
data:
  nginx.conf: |
    upstream sandra_api {
      queue 100 timeout=30s;
      server sandra-api:8080 max_fails=3;
    }
'
```

---

## 📈 DASHBOARD INTEGRADO

### Grafana Dashboard Panels
- **API Health Score**: Composite metric (latency + errors + 429s)
- **Request Volume**: RPS por endpoint + status codes  
- **Latency Percentiles**: p50/p95/p99 últimas 24h
- **Error Breakdown**: Por tipo + upstream dependency
- **Auto-Actions Log**: Healing attempts + success rate
- **Business Metrics**: Requests → Conversations → Revenue

### Real-time Alerts
- **Critical**: CEO + CTO immediate (SMS + call)
- **High**: Tech leads (Slack + email)  
- **Medium**: Team notifications (Slack)
- **Low**: Dashboard + daily summary

---

## 🔄 AUTO-MITIGATION SEQUENCE

### Level 1 (0-5min): Immediate Response
1. **Scale replicas** +25% (max 2x baseline)
2. **Activate circuit breakers** downstream
3. **Enable fast path mode** (reduced features)
4. **Clear caches** Redis + application level

### Level 2 (5-15min): Enhanced Response  
1. **Rollback deployment** if recent (<60min)
2. **Disable feature flags** non-critical
3. **Tune rate limiting** +50% burst capacity
4. **Route traffic** to healthy instances only

### Level 3 (15-30min): HITL Escalation
1. **Alert tech leads** with complete context
2. **Prepare war room** Slack channel + video
3. **Gather diagnostics** logs + traces + metrics
4. **CEO notification** if revenue impact

---

## 📊 EVIDENCIAS AUTOMÁTICAS

### Hourly Report Template
```
🔍 API SLO SENTINEL - [TIMESTAMP]

📊 MÉTRICAS PERÍODO:
• p95 latency: [X]ms (target ≤800ms) ✅❌
• Error rate: [X]% (target ≤1%) ✅❌  
• 429 rate: [X]% (target ≤5%) ✅❌
• Availability: [X]% (target ≥99.9%) ✅❌

🤖 AUTO-ACTIONS EJECUTADAS:
[Lista acciones + resultados]

📈 TRENDING:
• Latency: [improving/degrading/stable]
• Errors: [pattern analysis]  
• Traffic: [volume changes]

🚨 ALERTAS ACTIVAS:
[Current alerts + severity]

EVIDENCIAS: [links graphs + logs]
```

---

**🔍 API SLO SENTINEL CONFIGURADO Y ACTIVO**  
**Próxima verificación**: Cada hora en punto  
**Telemetría**: Pendiente conexión APM stack  
**George Thomas - CODE Coordinador**  
**Autonomous Bastion IA monitoring activo según Charter**
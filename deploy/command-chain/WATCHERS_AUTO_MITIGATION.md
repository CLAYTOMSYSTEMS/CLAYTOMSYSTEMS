# 👁️ WATCHERS & AUTO-MITIGACIÓN - Sistema Completo

**Sistema**: Autonomous Bastion IA  
**Coordinador**: George Thomas (CODE)  
**Principio**: Auto-healing con escalado HITL

---

## 🔍 WATCHERS CONFIGURADOS

### Performance Watchers
```yaml
sandra_api_latency:
  query: "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{service='sandra-api'}[10m]))"
  threshold: 0.8  # 800ms
  window: 10m
  actions:
    - scale_replicas
    - clear_caches  
    - activate_circuit_breaker
  escalation: 15m

sandra_api_errors:
  query: "rate(http_requests_total{service='sandra-api',status=~'5..'}[5m])"
  threshold: 0.01  # 1%
  window: 5m
  actions:
    - rollback_deployment
    - disable_feature_flags
    - health_check_dependencies
  escalation: 10m

memory_usage:
  query: "container_memory_usage_bytes / container_spec_memory_limit_bytes"
  threshold: 0.85  # 85%
  window: 10m
  actions:
    - restart_high_memory_pods
    - garbage_collection_force
    - scale_horizontally
  escalation: 20m
```

### Security Watchers
```yaml
rate_limit_breaches:
  query: "rate(http_requests_total{service='sandra-api',status='429'}[5m])"
  threshold: 0.05  # 5%
  window: 5m
  actions:
    - tighten_rate_limits
    - analyze_client_patterns
    - activate_enhanced_waf
  escalation: immediate

failed_auth_attempts:
  query: "rate(auth_failures_total[1m])"
  threshold: 10  # 10 attempts/min
  window: 1m
  actions:
    - temporary_ip_block
    - enhanced_logging
    - security_team_alert
  escalation: immediate

suspicious_traffic:
  query: "anomaly_score > 0.8"
  threshold: 0.8
  window: 5m
  actions:
    - traffic_analysis
    - selective_blocking
    - forensic_logging
  escalation: immediate
```

### Infrastructure Watchers
```yaml
disk_usage:
  query: "disk_usage_percent"
  threshold: 75  # 75%
  window: 15m
  actions:
    - log_rotation
    - temp_file_cleanup
    - archive_old_data
  escalation: 30m

ssl_certificate_expiry:
  query: "ssl_cert_expiry_days"
  threshold: 7  # 7 days
  window: daily
  actions:
    - automated_cert_renewal
    - cert_validation
    - backup_cert_check
  escalation: immediate

database_connections:
  query: "db_connections_active / db_connections_max"
  threshold: 0.7  # 70%
  window: 5m
  actions:
    - connection_pool_optimization
    - kill_long_running_queries
    - scale_db_instances
  escalation: 15m
```

---

## 🛠️ AUTO-MITIGACIÓN RUNBOOKS

### Performance Issues
```bash
#!/bin/bash
# AUTO-MITIGATION: High Latency

perform_scaling() {
  echo "🔧 AUTO-SCALING: Incrementing replicas"
  current_replicas=$(kubectl get deploy sandra-api -n prod -o=jsonpath='{.spec.replicas}')
  new_replicas=$((current_replicas + (current_replicas / 2)))  # +50%
  max_replicas=$((current_replicas * 2))  # Hard limit 2x
  
  if [ $new_replicas -gt $max_replicas ]; then
    new_replicas=$max_replicas
  fi
  
  kubectl scale deploy sandra-api -n prod --replicas=$new_replicas
  
  # Log action
  echo "$(date): Scaled sandra-api from $current_replicas to $new_replicas replicas" >> /var/log/auto-mitigation.log
  
  # Verify scaling success
  sleep 30
  actual_replicas=$(kubectl get deploy sandra-api -n prod -o=jsonpath='{.status.readyReplicas}')
  if [ "$actual_replicas" -eq "$new_replicas" ]; then
    echo "✅ Scaling successful: $actual_replicas/$new_replicas ready"
    return 0
  else
    echo "❌ Scaling failed: $actual_replicas/$new_replicas ready - ESCALATING"
    return 1
  fi
}

clear_caches() {
  echo "🔧 AUTO-CLEARING: Application caches"
  
  # Redis cache clear
  redis-cli -h redis.sandra.local FLUSHDB
  
  # Application cache endpoints
  curl -X POST https://api.sandra.local/v1/admin/cache/clear \
    -H "Authorization: Bearer $ADMIN_TOKEN"
  
  # CDN cache purge
  curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE/purge_cache" \
    -H "Authorization: Bearer $CF_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"purge_everything":true}'
  
  echo "$(date): Cleared all caches (Redis + App + CDN)" >> /var/log/auto-mitigation.log
}

activate_circuit_breaker() {
  echo "🔧 AUTO-PROTECTION: Circuit breaker activation"
  
  # Envoy circuit breaker configuration
  kubectl patch configmap envoy-config -n prod --patch='
  data:
    circuit_breaker.yaml: |
      circuit_breakers:
        thresholds:
          max_requests: 100
          max_pending_requests: 10
          max_retries: 3
          track_remaining: true
  '
  
  # Restart Envoy to apply config
  kubectl rollout restart deployment/envoy-proxy -n prod
  
  echo "$(date): Activated circuit breaker protection" >> /var/log/auto-mitigation.log
}

# Main execution
if perform_scaling; then
  clear_caches
  activate_circuit_breaker
  echo "✅ AUTO-MITIGATION: Performance issue resolved"
else
  echo "🚨 ESCALATION: Auto-mitigation failed - alerting humans"
  # Trigger HITL escalation
  curl -X POST $SLACK_WEBHOOK \
    -d '{"text":"🚨 AUTO-MITIGATION FAILED: High latency persists - human intervention required"}'
fi
```

### Security Auto-Response
```bash
#!/bin/bash
# AUTO-MITIGATION: Security threats

handle_rate_limit_breach() {
  echo "🔧 AUTO-SECURITY: Rate limit breach detected"
  
  # Tighten rate limits by 50%
  current_limit=$(redis-cli -h redis.sandra.local GET rate_limit:global)
  new_limit=$((current_limit / 2))
  redis-cli -h redis.sandra.local SET rate_limit:global $new_limit EX 3600  # 1 hour
  
  # Analyze top clients
  redis-cli -h redis.sandra.local --eval rate_limit_analysis.lua > /tmp/rate_limit_clients.log
  
  # Auto-block excessive clients
  while read -r client_ip count; do
    if [ "$count" -gt 1000 ]; then
      # Temporary 15min block
      redis-cli -h redis.sandra.local SET "blocked:$client_ip" 1 EX 900
      echo "$(date): Auto-blocked $client_ip for 15min (excessive requests: $count)" >> /var/log/auto-security.log
    fi
  done < /tmp/rate_limit_clients.log
}

handle_failed_auth() {
  local source_ip=$1
  echo "🔧 AUTO-SECURITY: Failed auth attempts from $source_ip"
  
  # Immediate temporary block
  redis-cli -h redis.sandra.local SET "auth_block:$source_ip" 1 EX 900  # 15min
  
  # Enhanced logging
  kubectl patch deployment sandra-api -n prod --patch='
  spec:
    template:
      spec:
        containers:
        - name: sandra-api
          env:
          - name: LOG_LEVEL
            value: "DEBUG"
          - name: AUTH_LOGGING
            value: "ENHANCED"
  '
  
  # Security team notification
  curl -X POST $SECURITY_SLACK_WEBHOOK \
    -d "{\"text\":\"🚨 AUTO-BLOCKED: Failed auth attempts from $source_ip - investigating\"}"
  
  echo "$(date): Auto-blocked $source_ip for failed auth attempts" >> /var/log/auto-security.log
}

investigate_suspicious_traffic() {
  echo "🔧 AUTO-SECURITY: Suspicious traffic pattern analysis"
  
  # Collect traffic samples
  kubectl exec -n prod deployment/sandra-api -- \
    tcpdump -i any -w /tmp/suspicious_traffic.pcap -c 1000
  
  # Pattern analysis
  python3 /opt/security/traffic_analyzer.py /tmp/suspicious_traffic.pcap > /tmp/traffic_analysis.json
  
  # Auto-classification
  anomaly_score=$(jq '.anomaly_score' /tmp/traffic_analysis.json)
  if (( $(echo "$anomaly_score > 0.9" | bc -l) )); then
    echo "🚨 HIGH ANOMALY: Score $anomaly_score - implementing defensive measures"
    
    # Activate enhanced WAF rules
    kubectl patch configmap waf-rules -n prod --patch='
    data:
      security.conf: |
        SecRuleEngine On
        SecRule ARGS "@detectSQLi" "id:1001,phase:2,block,msg:SQL Injection Attack"
        SecRule ARGS "@detectXSS" "id:1002,phase:2,block,msg:XSS Attack"
        SecRule REQUEST_HEADERS:User-Agent "@contains bot" "id:1003,phase:1,block,msg:Bot Traffic"
    '
    
    # CEO security alert for high-risk patterns
    curl -X POST $CEO_ALERT_WEBHOOK \
      -d "{\"text\":\"👑 CEO SECURITY ALERT: High anomaly score $anomaly_score detected - auto-defenses activated\"}"
  fi
}
```

### Infrastructure Auto-Healing
```bash
#!/bin/bash
# AUTO-MITIGATION: Infrastructure issues

manage_disk_space() {
  echo "🔧 AUTO-CLEANUP: Disk space management"
  
  # Log rotation
  find /var/log -name "*.log" -mtime +7 -delete
  journalctl --vacuum-time=7d
  
  # Temp file cleanup
  find /tmp -type f -mtime +1 -delete
  find /var/tmp -type f -mtime +3 -delete
  
  # Docker cleanup
  docker system prune -f
  docker volume prune -f
  
  # Application-specific cleanup
  kubectl exec -n prod deployment/sandra-api -- \
    rm -rf /app/logs/*.log.*
  
  # Archive old data
  pg_dump sandra_db | gzip > /backups/sandra_$(date +%Y%m%d).sql.gz
  psql -d sandra_db -c "DELETE FROM logs WHERE created_at < NOW() - INTERVAL '30 days'"
  
  echo "$(date): Disk cleanup completed - freed $(df -h / | awk 'NR==2{print $4}') space" >> /var/log/auto-maintenance.log
}

renew_ssl_certificates() {
  echo "🔧 AUTO-SECURITY: SSL certificate renewal"
  
  # Automated ACME challenge
  certbot renew --nginx --quiet
  
  # Verify renewal success
  if [ $? -eq 0 ]; then
    echo "✅ SSL certificates renewed successfully"
    
    # Reload nginx
    nginx -s reload
    
    # Update Kubernetes secrets
    kubectl create secret tls sandra-tls \
      --cert=/etc/letsencrypt/live/sandra.local/fullchain.pem \
      --key=/etc/letsencrypt/live/sandra.local/privkey.pem \
      -n prod --dry-run=client -o yaml | kubectl apply -f -
    
    echo "$(date): SSL certificates renewed and deployed" >> /var/log/auto-security.log
  else
    echo "❌ SSL renewal failed - ESCALATING"
    curl -X POST $SECURITY_SLACK_WEBHOOK \
      -d '{"text":"🚨 SSL RENEWAL FAILED: Manual intervention required"}'
  fi
}

optimize_database_connections() {
  echo "🔧 AUTO-OPTIMIZATION: Database connection pool"
  
  # Kill long-running queries (>5min)
  psql -d sandra_db -c "
    SELECT pg_terminate_backend(pid) 
    FROM pg_stat_activity 
    WHERE state = 'active' 
      AND now() - query_start > interval '5 minutes'
      AND query NOT LIKE '%pg_stat_activity%'
  "
  
  # Optimize connection pool settings
  kubectl patch configmap postgres-config -n prod --patch='
  data:
    postgresql.conf: |
      max_connections = 200
      shared_buffers = 256MB
      effective_cache_size = 1GB
      work_mem = 4MB
      maintenance_work_mem = 64MB
  '
  
  # Restart postgres to apply config
  kubectl rollout restart statefulset/postgres -n prod
  
  echo "$(date): Database connections optimized" >> /var/log/auto-optimization.log
}
```

---

## 📊 ESCALATION AUTOMÁTICA

### HITL Triggers
```yaml
escalation_rules:
  auto_mitigation_failed:
    condition: "3 consecutive auto-healing attempts failed"
    action: "alert_tech_leads"
    severity: "high"
    
  critical_threshold_breach:
    condition: "SLO breach >15min sustained"
    action: "alert_cto_cio"
    severity: "critical"
    
  security_incident:
    condition: "anomaly_score > 0.9 OR multiple_failed_mitigations"
    action: "alert_security_team + ceo"
    severity: "critical"
    
  revenue_impact:
    condition: "estimated_loss > €100/hour"
    action: "alert_ceo_immediate"
    severity: "critical"
```

### Alert Routing
```bash
#!/bin/bash
# ESCALATION ROUTING

send_escalation() {
  local severity=$1
  local message=$2
  local evidence_link=$3
  
  case $severity in
    "critical")
      # CEO immediate alert
      curl -X POST $CEO_SMS_API \
        -d "🚨 CRITICAL: $message - Evidence: $evidence_link"
      
      # CTO/CIO alert
      curl -X POST $EXECUTIVE_SLACK \
        -d "{\"text\":\"👑 EXECUTIVE ALERT: $message\", \"attachments\":[{\"color\":\"danger\",\"text\":\"Evidence: $evidence_link\"}]}"
      ;;
      
    "high")
      # Tech leads
      curl -X POST $TECH_SLACK \
        -d "{\"text\":\"🚨 HIGH SEVERITY: $message\", \"attachments\":[{\"color\":\"warning\",\"text\":\"Evidence: $evidence_link\"}]}"
      ;;
      
    "medium")
      # Team notifications
      curl -X POST $TEAM_SLACK \
        -d "{\"text\":\"⚠️ MEDIUM: $message - Evidence: $evidence_link\"}"
      ;;
  esac
  
  # Always log to audit trail
  echo "$(date): ESCALATION [$severity] $message" >> /var/log/escalations.log
}
```

---

**👁️ WATCHERS & AUTO-MITIGACIÓN SISTEMA CONFIGURADO**  
**Cobertura**: Performance + Security + Infrastructure  
**Escalation**: Automática según severidad + fallos  
**George Thomas - CODE Coordinador**  
**Autonomous Bastion IA auto-healing activo 24/7**
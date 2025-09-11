# 🌙 NIGHTPULSE PILOTO 20:00-22:30 - Coordinación Final

**Coordinador**: George Thomas (CODE) - coordino, no programo  
**Timeline**: 20:00-22:30 CEST (2.5h window)  
**Scope**: 3 listings prioritarios con guardarraíles activos  
**Objetivo**: Validar automatización precios + evidencias 23:00

---

## 🏠 3 LISTINGS PRIORITARIOS CONFIGURADOS

### Listing Selection Criteria
```yaml
selection_requirements:
  margin_minimum: "≥35% (buffer sobre 30% threshold)"
  visibility_high: "High search ranking + booking frequency"
  seasonality_optimal: "Otoño Montanejos peak demand"
  competition_manageable: "Price elasticity favorable"
  
geographic_focus:
  primary: "Montanejos thermal location"
  secondary: "Valencia province rural"
  tertiary: "Costa Azahar properties"
```

### Listing 1: Montanejos Thermal Villa
```yaml
id: "VT_MONT_001"
location: "Montanejos, Castellón"
type: "Villa familiar termal"
current_metrics:
  base_price: "€120/night"
  margin_current: "38% (€46.80 profit)"
  occupancy_7d: "67% (optimal for pulse)"
  competition_density: "Medium (6 similares)"
  
pulse_configuration:
  price_floor: "€108 (30% margin protection)"
  price_ceil: "€145 (20% premium maximum)"
  amplitude: "±6% (€7.20 variance)"
  steps_planned: "8 cambios en 120min"
  jitter_range: "12-18min intervals"
```

### Listing 2: Valencia Rural Experience
```yaml
id: "VR_VAL_003"
location: "Xàtiva, Valencia"
type: "Casa rural experiencial"
current_metrics:
  base_price: "€85/night"
  margin_current: "42% (€35.70 profit)"
  occupancy_7d: "71% (high demand window)"
  competition_density: "Low (3 similares)"
  
pulse_configuration:
  price_floor: "€75 (30% margin protection)"
  price_ceil: "€98 (15% premium maximum)"
  amplitude: "±5% (€4.25 variance)"
  steps_planned: "7 cambios en 120min"
  jitter_range: "10-20min intervals"
```

### Listing 3: Costa Azahar Beach House
```yaml
id: "CB_AZA_007"
location: "Peñíscola, Castellón"
type: "Casa playa familiar"
current_metrics:
  base_price: "€95/night"
  margin_current: "35% (€33.25 profit)"
  occupancy_7d: "58% (moderate, good for testing)"
  competition_density: "High (12 similares)"
  
pulse_configuration:
  price_floor: "€85 (30% margin protection)"
  price_ceil: "€105 (10% premium maximum)"
  amplitude: "±4% (€3.80 variance)"
  steps_planned: "6 cambios en 120min"
  jitter_range: "15-22min intervals"
```

---

## 🛡️ GUARDARRAÍLES ACTIVOS

### Business Protection Rules
```yaml
margin_protection:
  hard_stop: "30% minimum margin"
  warning_threshold: "32% margin (yellow alert)"
  escalation: "CEO notification if <31%"
  
pricing_boundaries:
  floor_calculation: "costs * 1.35 (35% markup minimum)"
  ceil_calculation: "market_rate * 1.15 (15% premium max)"
  variance_limit: "±7% maximum single change"
  
sequence_controls:
  max_changes: "10 per listing per 120min window"
  total_duration: "120min maximum pulse sequence"
  cool_down: "30min minimum between sequences"
```

### Market Compliance
```yaml
platform_tos:
  airbnb_compliance: "Official API only, no scraping"
  booking_compliance: "Channel manager integration"
  rate_limiting: "Respect platform API limits"
  realistic_pricing: "No artificial manipulation flags"
  
monitoring_thresholds:
  api_429_rate: "5% maximum (pause 30min if exceeded)"
  response_timeout: "30s maximum wait time"
  retry_attempts: "3 max per request"
  circuit_breaker: "Activate on 3 consecutive failures"
```

### Auto-Stop Triggers
```yaml
booking_received:
  condition: "New booking detected during pulse"
  action: "Immediate sequence stop + price anchor"
  anchor_price: "Current step price (no final -1%)"
  logging: "Timestamp + booking details + stop reason"
  
roas_degradation:
  condition: "ROAS < 2.5 calculated"
  action: "Conservative mode + amplitude reduction"
  adjustment: "±2% variance maximum (reduced risk)"
  
suspicious_activity:
  condition: "Unusual platform response patterns"
  action: "Immediate pause + manual review required"
  escalation: "Security team + CEO notification"
```

---

## 🤖 N8N AUTOMATION DEPLOYMENT

### Workflow Configuration
```json
{
  "workflow_name": "NightPulse_Piloto_3Listings",
  "trigger": {
    "type": "cron",
    "schedule": "0 20 * * *",
    "timezone": "Europe/Madrid"
  },
  "variables": {
    "listings": ["VT_MONT_001", "VR_VAL_003", "CB_AZA_007"],
    "pulse_duration": 120,
    "max_steps": 10,
    "jitter_min": 10,
    "jitter_max": 22
  },
  "nodes": [
    {
      "name": "Initialize_Pulse",
      "type": "Function",
      "code": "return items.map(item => ({...item, pulse_active: true, start_time: new Date()}))"
    },
    {
      "name": "Guardrails_Check",
      "type": "Function", 
      "code": "return items.filter(item => item.margin >= 0.30 && item.pulse_changes < 10)"
    },
    {
      "name": "Generate_Price_Step",
      "type": "Function",
      "code": "const variance = (Math.random() - 0.5) * 2 * item.amplitude; return {...item, next_price: item.base_price * (1 + variance)}"
    },
    {
      "name": "Apply_Price_Change",
      "type": "HTTP Request",
      "url": "https://yama-3.sandra.local/api/pricing/update",
      "method": "PATCH"
    },
    {
      "name": "Wait_Jitter",
      "type": "Wait",
      "duration": "{{Math.floor(Math.random() * ({{$node.jitter_max}} - {{$node.jitter_min}}) + {{$node.jitter_min}}) * 60}}",
      "unit": "seconds"
    },
    {
      "name": "Check_Bookings",
      "type": "HTTP Request",
      "url": "https://yama-3.sandra.local/api/bookings/recent",
      "method": "GET"
    },
    {
      "name": "Stop_On_Booking",
      "type": "IF",
      "condition": "{{$node.Check_Bookings.json.new_bookings > 0}}",
      "true": "Anchor_Current_Price",
      "false": "Continue_Sequence"
    },
    {
      "name": "Final_Anchor",
      "type": "Function",
      "code": "return {...item, final_price: item.base_price * 0.99, reason: 'nightpulse_discount'}"
    }
  ]
}
```

### Yama-3 Integration Endpoints
```yaml
api_endpoints:
  pricing_update:
    url: "https://yama-3.sandra.local/api/pricing/update"
    method: "PATCH"
    payload: "listing_id, new_price, pulse_id, timestamp"
    
  booking_check:
    url: "https://yama-3.sandra.local/api/bookings/recent"
    method: "GET"
    params: "listing_ids[], window_minutes=10"
    
  telemetry_log:
    url: "https://yama-3.sandra.local/api/telemetry/nightpulse"
    method: "POST"
    payload: "pulse_data, metrics, events, errors"
    
  guardrails_validate:
    url: "https://yama-3.sandra.local/api/guardrails/check"
    method: "POST"
    payload: "listing_id, proposed_price, current_margin"
```

---

## 📊 MONITORING DASHBOARD

### Real-time Metrics
```yaml
dashboard_url: "https://monitoring.sandra.local/nightpulse"
update_frequency: "30 seconds real-time"

key_metrics:
  active_pulses:
    display: "Count listings currently in pulse"
    alert: "If >3 (piloto limit)"
    
  price_variance:
    display: "Current ±% from base price per listing"
    alert: "If >7% amplitude exceeded"
    
  booking_events:
    display: "Real-time booking notifications"
    alert: "Immediate stop-sequence trigger"
    
  api_health:
    display: "429 rate + response times"
    alert: "If >5% 429 rate sustained 5min"
    
  business_impact:
    display: "Views delta + saves delta + revenue"
    update: "Every 15min aggregation"
```

### Alert Configuration
```yaml
critical_alerts:
  margin_breach:
    trigger: "Margin <31% any listing"
    action: "Immediate stop + CEO SMS"
    
  api_failure:
    trigger: "3 consecutive API failures"
    action: "Circuit breaker + tech team alert"
    
  booking_detected:
    trigger: "New booking during pulse"
    action: "Stop sequence + log booking details"
    
medium_alerts:
  high_429_rate:
    trigger: ">5% 429 responses 5min"
    action: "Pause 30min + retry"
    
  unusual_patterns:
    trigger: "Anomaly detection threshold"
    action: "Conservative mode + review queue"
```

---

## 📈 EVIDENCE COLLECTION

### Baseline Capture (19:45-20:00)
```yaml
pre_pulse_metrics:
  listing_states:
    - current_prices: "€120, €85, €95"
    - occupancy_rates: "67%, 71%, 58%"
    - competitor_prices: "Market positioning"
    - view_counts: "24h baseline"
    - save_counts: "24h baseline"
    
  platform_health:
    - api_response_times: "Baseline latency"
    - 429_rate: "Pre-pulse rate limiting"
    - booking_frequency: "Recent booking patterns"
```

### During Pulse Tracking (20:00-22:30)
```yaml
real_time_data:
  price_changes:
    - timestamp: "Each price change applied"
    - old_price: "Previous price"
    - new_price: "Applied price"
    - variance: "±% from base"
    - api_response: "Success/failure + latency"
    
  engagement_metrics:
    - view_spikes: "15min aggregation windows"
    - save_increases: "Favoriting behavior"
    - inquiry_messages: "Direct booking interest"
    - competitor_reactions: "Market response"
    
  system_health:
    - api_429_events: "Rate limiting encounters"
    - circuit_breaker: "Auto-protection activations"
    - error_logs: "Detailed failure analysis"
```

### Post-Pulse Analysis (22:30-23:00)
```yaml
impact_assessment:
  business_metrics:
    - views_delta: "+X% vs 7d average"
    - saves_delta: "+X% vs 7d average"
    - bookings_during: "Count + timing"
    - revenue_impact: "€X incremental"
    
  technical_performance:
    - sequence_completion: "X/3 listings completed"
    - average_changes: "X changes per listing"
    - stop_events: "Booking triggers + reasons"
    - final_anchor: "Base -1% application success"
    
  compliance_validation:
    - tos_violations: "0 target"
    - api_health: "429 rate final"
    - margin_protection: "Minimum maintained"
    - guardrails_activations: "Protection events"
```

---

## 📋 REPORT 23:00 TEMPLATE

### Executive Summary
```
🌙 NIGHTPULSE PILOTO REPORT - 2025-09-11

📊 EXECUTION SUMMARY:
• Listings ejecutados: [X]/3 completados
• Duration total: 20:00-22:30 (2.5h window)
• Price changes: [X] total aplicados
• Bookings durante pulse: [X] (stops: [X])

📈 BUSINESS IMPACT:
• Views delta: +[X]% vs 7d avg (target +15%)
• Saves delta: +[X]% vs 7d avg (target +10%)
• Revenue ventana: €[X] (+[X]% vs baseline)
• Booking conversion: [X] nuevas reservas

🛡️ COMPLIANCE & GUARDRAILS:
• 429 rate: [X]% (<5% target) ✅❌
• Margin protection: [X]% min maintained (≥30%) ✅❌
• API health: [X]ms avg response ✅❌
• TOS violations: [X] (0 target) ✅❌

🚨 EVENTS & ALERTS:
[Lista eventos críticos + resoluciones]

RECOMENDACIÓN: GO/ADJUST/EXPAND para full automation
```

### Detailed Metrics by Listing
```
📋 LISTING VT_MONT_001 (Montanejos Villa):
Base: €120 → Final: €[X] (base -1% = €118.80 target)
Changes: [X] aplicados en [X] min
Stop reason: [booking/completed/manual]
Views: +[X]% | Saves: +[X]% | Bookings: [X]

📋 LISTING VR_VAL_003 (Valencia Rural):
Base: €85 → Final: €[X] (base -1% = €84.15 target)
Changes: [X] aplicados en [X] min
Stop reason: [booking/completed/manual]
Views: +[X]% | Saves: +[X]% | Bookings: [X]

📋 LISTING CB_AZA_007 (Costa Azahar):
Base: €95 → Final: €[X] (base -1% = €94.05 target)
Changes: [X] aplicados en [X] min
Stop reason: [booking/completed/manual]
Views: +[X]% | Saves: +[X]% | Bookings: [X]
```

### Technical Performance
```
🔧 TECHNICAL EXECUTION:
• N8n workflow: [success/partial/failed]
• Yama-3 integration: [X]% uptime
• API calls total: [X] (success: [X]%, 429: [X]%, errors: [X]%)
• Circuit breaker activations: [X]
• Guardrails triggers: [X] (margin: [X], booking: [X], other: [X])

💡 LESSONS LEARNED:
• [Key insights from piloto execution]
• [Technical improvements identified]
• [Business optimization opportunities]

🚀 NEXT STEPS:
• Full automation GO/NO-GO decision
• Scale to [X] additional listings
• [Specific improvements for v2]
```

---

## 🎯 SUCCESS CRITERIA PILOTO

### Primary Objectives
```
☐ 3 listings execute pulse sequence without critical failures
☐ Margin protection maintained ≥30% all listings
☐ Stop-on-booking mechanism functional if triggered
☐ Final anchor base -1% applied successfully
☐ No TOS violations or platform warnings
```

### Performance Targets
```
☐ Views increase ≥10% vs 7d average
☐ Saves increase ≥5% vs 7d average
☐ API 429 rate <5% sustained
☐ System uptime >95% during window
☐ Evidence collection 100% complete
```

### Compliance & Risk
```
☐ Guardarraíles activate correctly when tested
☐ No margin below 30% any listing any time
☐ Circuit breaker functions on API failures
☐ All price changes logged with timestamps
☐ CEO report 23:00 complete with evidence
```

---

**🌙 NIGHTPULSE PILOTO COORDINACIÓN FINAL**  
**3 listings configured + guardarraíles active**  
**20:00-22:30 execution + 23:00 evidence report**  
**George Thomas - CODE Coordinador**  
**Standing Orders: Sin improvisar + evidencias obligatorias CEO**
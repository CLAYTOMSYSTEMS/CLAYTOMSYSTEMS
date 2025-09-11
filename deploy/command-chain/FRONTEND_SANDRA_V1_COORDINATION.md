# 💻 FRONTEND SANDRA V1 STUDIO - Coordinación Técnica

**Escuadrón**: SANDRA-FE-01 (frontend IA)  
**Coordinador**: George Thomas (CODE) - coordino, no programo  
**Deadline**: 18:30 CEST (máx 19:00 si ajuste lip-sync)  
**Objetivo**: Sandra operativa entorno CEO con control total

---

## 🎯 TARGET DEPLOYMENT

### URL Objetivo
```
https://sandra.local/studio
├── Certificado HTTPS válido
├── CORS sandra.local únicamente  
├── Permisos cámara/mic controlados
└── Acceso staging credentials
```

### Grid Layout 2×2
```yaml
layout_structure:
  top_left: "Chat Module"
  top_right: "Voice Module"  
  bottom_left: "Avatar Module"
  bottom_right: "Camera Module"
  
additional_controls:
  bottom_center: "Elevar a llamada button"
  top_bar: "Status bar (conexión/latencia/tokens/errores)"
```

---

## 🔧 MÓDULOS ESPECÍFICOS

### 1. Chat Module
```yaml
functionality:
  input: "Text input field + send button"
  output: "Response display area"
  history: "Lateral sidebar conversation log"
  
integration:
  endpoint: "Yama-3 /chat"
  method: "POST with streaming response"
  auth: "Bearer token TTL corto"
  
ui_elements:
  placeholder: "Escribe tu mensaje..."
  send_button: "Enviar / Enter key"
  history_panel: "Scrollable conversation log"
  typing_indicator: "Sandra is typing..."
```

### 2. Voice Module  
```yaml
functionality:
  ptt: "Push-to-Talk button"
  vad: "Voice Activity Detection"
  tts: "ElevenLabs streaming playback"
  
integration:
  endpoint: "Yama-3 /realtime-voice"
  streaming: "WebSocket connection"
  audio_format: "PCM 16-bit 44.1kHz"
  
ui_elements:
  ptt_button: "Hold to speak / Click to toggle"
  vad_indicator: "Voice level visualization"
  tts_status: "Playing / Buffer / Ready"
  echo_control: "Echo cancellation active"
```

### 3. Avatar Module
```yaml
functionality:
  video_player: "HTML5 video element"
  phoneme_sync: "Real-time lip-sync markers"
  integration_test: "Load GV_Montanejos_Test_v1.mp4"
  
integration:
  endpoint: "Yama-3 /avatar/phonemes"
  video_source: "Staging DAM + local cache"
  sync_tolerance: "±150ms target (±200ms acceptable)"
  
ui_elements:
  video_container: "Responsive player"
  sync_controls: "Play/pause/scrub"
  phoneme_display: "Visual sync indicators"
  quality_selector: "Auto/720p/1080p"
```

### 4. Camera Module
```yaml
functionality:
  toggle: "ON/OFF camera access"
  snapshot: "5-10s interval capture"
  vision_analysis: "Llama-3 processing"
  
integration:
  endpoint: "Yama-3 /vision"
  capture_format: "JPEG base64"
  analysis_response: "JSON structured data"
  
ui_elements:
  camera_preview: "Live video feed"
  toggle_button: "Camera ON/OFF"
  snapshot_indicator: "Capture timing"
  analysis_display: "Vision results overlay"
```

---

## 🛡️ SEGURIDAD YAMA-3

### Backend Integration
```yaml
endpoints_required:
  - path: "/chat"
    method: "POST"
    auth: "Bearer token"
    payload: "text message + context"
    
  - path: "/realtime-voice"  
    method: "WebSocket"
    auth: "Bearer token"
    payload: "audio stream PCM"
    
  - path: "/vision"
    method: "POST" 
    auth: "Bearer token"
    payload: "image base64 + prompt"
    
  - path: "/avatar/phonemes"
    method: "POST"
    auth: "Bearer token" 
    payload: "text for phoneme generation"
    
  - path: "/telemetry"
    method: "POST"
    auth: "Bearer token"
    payload: "metrics + performance data"
```

### Token Management
```yaml
security_model:
  storage: "Server-side only, never client"
  ttl: "Short-lived tokens (15-30 minutes)"
  scopes: "Granular permissions per endpoint"
  refresh: "Automatic token renewal"
  
client_security:
  cors: "sandra.local origin only"
  https: "Mandatory for all connections"
  permissions: "Camera/mic with explicit user consent"
  localStorage: "No sensitive data storage"
```

---

## 📊 CONTROL BAR & TELEMETRÍA

### Status Bar Elements
```yaml
connection_status:
  indicator: "✅ Connected / ❌ Disconnected / ⚠️ Reconnecting"
  websocket: "Real-time connection health"
  
performance_metrics:
  latency: "p95 chat response time (ms)"
  tts_start: "Time to first audio (ms)"
  reconnections: "Count + frequency"
  frame_rate: "Avatar video FPS"
  
resource_usage:
  tokens_per_minute: "API consumption rate"
  error_count: "Failed requests counter"
  bandwidth: "Upload/download usage"
```

### Elevar a Llamada Button
```yaml
functionality:
  mode_switch: "Text chat → Full conversational"
  continuous: "Voice + avatar + vision simultaneous"
  priority: "Enhanced resource allocation"
  
ui_behavior:
  state_normal: "Elevar a llamada"
  state_active: "En llamada (finalizar)"
  visual_feedback: "Mode indicator + enhanced UI"
  
integration:
  endpoint_coordination: "All services optimized"
  resource_management: "Priority queue activation"
  quality_enhancement: "Lower latency + higher quality"
```

---

## 🎬 DEMO SCRIPT (1 MINUTO)

### Secuencia Demostración
```yaml
step_1_video: "10s"
  action: "Load and play GV_Montanejos_Test_v1.mp4"
  validation: "Video loads, audio clear, lip-sync visible"
  
step_2_ptt: "15s"  
  action: "Push-to-talk saludo 'Hola Sandra'"
  validation: "Audio captured, sent, TTS response received"
  
step_3_camera: "15s"
  action: "Activate camera, ask question about visible scene"
  validation: "Camera ON, snapshot taken, Llama-3 vision response"
  
step_4_conversation: "15s"
  action: "Text + voice response demonstration"
  validation: "Multimodal interaction, smooth transitions"
  
step_5_telemetry: "5s"
  action: "Show metrics panel, performance indicators"
  validation: "Real-time data display, all systems green"
```

### Demo Environment Setup
```bash
# Staging credentials preparation
DEMO_USER="ceo_demo"
DEMO_PASS="sandra_v1_2025"
DEMO_URL="https://sandra.local/studio"

# Pre-flight checklist
echo "🔍 Pre-demo validation:"
echo "✅ HTTPS certificate valid"
echo "✅ Yama-3 endpoints responding" 
echo "✅ Video file accessible"
echo "✅ Audio permissions granted"
echo "✅ Camera permissions granted"
echo "✅ Metrics dashboard operational"
```

---

## 📈 MÉTRICAS PANEL

### Real-time Monitoring
```yaml
performance_dashboard:
  layout: "Overlay panel / Separate metrics view"
  update_frequency: "Real-time (1s intervals)"
  
metrics_displayed:
  chat_performance:
    - "p95 response latency (ms)"
    - "Success rate (%)"
    - "Error breakdown by type"
    
  voice_performance:
    - "TTS start time (ms)"
    - "Audio quality score"
    - "Dropout events count"
    
  avatar_performance:
    - "Video frame rate (FPS)"
    - "Lip-sync accuracy (ms)"
    - "Rendering lag (ms)"
    
  camera_performance:
    - "Capture frequency (s)"
    - "Vision processing time (ms)"
    - "Analysis accuracy score"
```

### Historical Tracking
```yaml
session_analytics:
  duration: "Total session time"
  interactions: "Count by modality"
  quality_scores: "Average performance metrics"
  errors: "Issue log + severity"
  
export_capabilities:
  format: "JSON metrics export"
  timeframe: "Session / hourly / daily"
  granularity: "Per-interaction detail"
```

---

## ✅ CRITERIOS ACEPTACIÓN

### Core Functionality
```
☐ Video carga y reproduce correctamente
☐ Lip-sync phonemes aplicados con ±150ms (±200ms acceptable)
☐ PTT y VAD funcionan sin eco
☐ Camera ON/OFF toggle operativo
☐ Llamada /vision Llama-3 exitosa
☐ Botón "elevar a llamada" activa modo conversacional
```

### Security Compliance
```
☐ Sin claves en código cliente
☐ CORS limitado a sandra.local
☐ HTTPS válido y funcional
☐ Tokens TTL corto funcionando
☐ Permisos cámara/mic controlados
```

### Performance Standards
```
☐ Panel métricas operativo y preciso
☐ p95 chat < 800ms target
☐ TTS inicio < 700ms target
☐ Reconexiones < 2% por sesión
☐ Avatar frame-rate estable (24-30 FPS)
```

### User Experience
```
☐ Grid 2×2 layout responsive
☐ Controles intuitivos y accesibles
☐ Status bar informativos
☐ Demo script ejecutable 1 minuto
☐ Error handling graceful
```

---

## 🚨 CONTINGENCY PLANNING

### Lip-sync Issues
```yaml
problem: "±150ms target no alcanzado"
solution: "Aceptar ±200ms con compromiso parche v1.1 < 60min"
timeline: "Mantener deadline 18:30, documentar issue"
```

### Integration Failures
```yaml
yama3_connectivity:
  problem: "Endpoints no responden"
  solution: "Fallback mock responses + retry logic"
  
video_loading:
  problem: "GV_Montanejos_Test_v1.mp4 no carga"
  solution: "Alternative video source + format check"
  
permissions:
  problem: "Camera/mic access denegado"
  solution: "Guided permission flow + fallback modes"
```

### Performance Issues
```yaml
latency_high:
  problem: "Response times > targets"
  solution: "Connection optimization + caching"
  
audio_quality:
  problem: "Echo o distorsión"
  solution: "Audio processing adjustment + hardware check"
```

---

**💻 FRONTEND SANDRA V1 STUDIO - COORDINATION ACTIVE**  
**Timeline**: 90 minutes to delivery (max 19:00)  
**Integration**: 4 modules + security + metrics  
**George Thomas - CODE Coordinador**  
**Status**: Technical implementation + demo preparation**
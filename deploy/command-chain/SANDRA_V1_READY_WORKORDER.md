# 🪖 WORK ORDER: SANDRA V1 READY - Activación Inmediata

**Mandato**: CEO Clay Thomas → CTO & CIO → CODE Coordinador  
**Escuadrones**: VIDEO-GV-01 (guías creativas) + SANDRA-FE-01 (frontend IA)  
**Timeline**: HOY 18:00-18:30 CEST deliveries  
**Objetivo**: Validar estética + voz + sincronización antes de escalar

---

## 🎯 FUENTE ÚNICA DE VERDAD (SUv)

### Assets Oficiales CEO
- **Avatares + ID voz**: `C:\Users\clayt\Downloads\` (IDs exactos entregados CEO)
- **Logos oficiales**: 
  - `/mnt/data/400JpgdpiLogoCroppedBW.jpg`
  - `/mnt/data/400PngdpiLogoCroppedBW.png`
- **Seguridad**: Claves encapsuladas Yama-3 (nunca en cliente)

---

## A) 🎬 PRIMER VIDEO VALIDACIÓN (ENTREGA 18:00 CEST)

### Especificación Técnica
```yaml
objetivo: "Validar estética + voz + sincronización"
duracion: "12-15 segundos"
formato: "vertical 1080×1920, 24/30 fps, H.264, 12-20 Mbps"

guion_sandra: |
  "Bienvenidos a Montanejos con GuestsValencia. 
   Aguas termales, naturaleza y reserva directa sin comisiones."

imagen: "Montanejos otoñal (río/termales/verde musgo)"
vestuario: "tonos tierra (prototipo)"
musica: "instrumental suave (-18 LUFS integrados, picos -1 dBTP)"

branding:
  logo: "GuestsValencia esquina"
  cta_final: "2s - Reserva directa + WhatsApp"
```

### Entregables VIDEO-GV-01
- ✅ `GV_Montanejos_Test_v1.mp4` (vertical)
- ✅ `GV_Montanejos_Test_v1_square.mp4` (1080×1080 IG feed)
- ✅ Subtítulos `subtitulos.srt` (ES)
- ✅ 3 miniaturas 1280×720 (`thumb1.jpg`, `thumb2.jpg`, `thumb3.jpg`)
- ✅ Hoja técnica (bitrate, loudness, color)
- ✅ Upload staging DAM (NO publicar redes)

### Criterios Aceptación
```
☐ Lip-sync ±150ms (aceptable ±200ms v1 con parche v1.1 <60min)
☐ Voz clara sin artefactos; música por debajo
☐ Brand correcto (solo GuestsValencia; CTA visible área segura)
☐ Look&feel otoñal Montanejos; sin flicker/ghosting
☐ Archivo reproduce móvil sin cortes
```

---

## B) 💻 FRONTEND SANDRA V1 (ENTREGA 18:30 CEST)

### Objetivo
Ver Sandra operativa en entorno CEO con video preparado + control total

### Alcance v1 Staging
```yaml
url: "https://sandra.local/studio (HTTPS)"
layout: "grid 2×2 módulos visibles una pantalla"

modulos:
  chat:
    descripcion: "texto ↔ respuesta, historial lateral"
  voz:
    descripcion: "Push-to-Talk + VAD; TTS 11Labs streaming"
  avatar:
    descripcion: "reproductor video validación + marcas fonemas lip-sync"
  camara:
    descripcion: "toggle; snapshot 5-10s → /vision Llama-3"

controles:
  elevar_llamada: "botón modo conversacional continuo"
  barra_estado: "conexión ✅, latencia ms, tokens/min, errores"

branding:
  logo: "GuestsValencia"
  tema: "limpio"
  accesibilidad: "AA"
```

### Integración Seguridad
```yaml
backend_yama3:
  endpoints:
    - "/chat"
    - "/realtime-voice" 
    - "/vision"
    - "/avatar/phonemes"
    - "/telemetry"

seguridad:
  claves: "solo servidor (tokens TTL corto, scopes)"
  cors: "sandra.local únicamente"
  permisos: "cámara/mic solo sandra.local"
```

### Entregables SANDRA-FE-01
- ✅ URL staging + credenciales pruebas
- ✅ Guía demo 1min:
  1. Reproducir video
  2. PTT saludo
  3. Pregunta con cámara
  4. Respuesta voz+texto
  5. Ver telemetría
- ✅ Métricas overlay/panel: p95 chat, inicio TTS, reconexiones, frame-rate avatar

### Criterios Aceptación
```
☐ Video carga + sincroniza fonemas
☐ PTT y VAD funcionan; eco controlado
☐ Cámara ON/OFF + llamada /vision OK
☐ Sin claves cliente; CORS correcto; HTTPS válido
☐ Panel métricas operativo
```

---

## 📡 BROADCASTS INMEDIATOS

### A CODE (coordinador; no programa)
```
📋 WORK ORDER SANDRA V1 READY

CODE, activa VIDEO-GV-01 y SANDRA-FE-01

DEADLINES:
• 18:00 CEST: video test staging + .srt + miniaturas
• 18:30 CEST: frontend https://sandra.local/studio + video integrado + métricas

Evidencias: #sandra-fe + #command-chain-status
Sin improvisar - Coordinación solo
```

### A VIDEO-GV-01 (guías creativas)
```
🎬 VIDEO VALIDACIÓN MONTANEJOS - ENTREGA 18:00

DELIVERABLES:
• GV_Montanejos_Test_v1.mp4 (12-15s vertical)
• Versión cuadrada 1080×1080
• Subtítulos .srt + 3 thumbnails
• Hoja técnica completa

SPECS:
• Guion: "Bienvenidos a Montanejos con GuestsValencia. Aguas termales, naturaleza y reserva directa sin comisiones"
• Estética: otoñal, tonos tierra
• Audio: música -18 LUFS, voz clara
• Lip-sync: ±150ms target (±200ms aceptable v1)
• CTA final: 2s "Reserva directa" + WhatsApp

ASSETS: C:\Users\clayt\Downloads\ (IDs exactos CEO)
LOGOS: /mnt/data/ archivos oficiales
Upload: staging DAM - NO PUBLICAR redes
```

### A SANDRA-FE-01 (frontend IA)
```
💻 FRONTEND SANDRA V1 STUDIO - ENTREGA 18:30

URL TARGET: https://sandra.local/studio

MÓDULOS GRID 2×2:
• Chat: texto ↔ respuesta + historial
• Voz: PTT/VAD + TTS 11Labs streaming
• Avatar: video test + fonemas lip-sync
• Cámara: toggle + snapshots → Llama-3 vision

CONTROLES:
• Botón "Elevar a llamada" conversacional
• Barra estado: conexión/latencia/tokens/errores

SEGURIDAD YAMA-3:
• Endpoints: /chat, /realtime-voice, /vision, /avatar/phonemes, /telemetry
• Tokens TTL corto + scopes
• Sin claves cliente
• CORS sandra.local only

ENTREGABLES:
• URL + credenciales pruebas
• Guía demo 1min (5 pasos)
• Métricas panel: p95 chat, TTS, reconexiones, frame-rate

DEADLINE: 18:30 CEST (máx 19:00 si ajuste lip-sync)
```

---

## 🎯 SECUENCIA DECISIÓN POST-REVIEW CEO

### Si OK Video + Frontend
```
✅ GO para paquete 6 reels + 1 largo
📋 Plan Otoño Montanejos
🚀 Escalado producción autorizado
```

### Si Ajustes Necesarios
```
🔧 VIDEO-GV-01: rev v1.1 en 60-90min
🔧 SANDRA-FE-01: parches sync/voz
⏱️ Timeline ajuste mantenido
```

---

## 📊 COORDINACIÓN CODE

### Timeline Management
```
16:50 → Broadcasts distribuidos
17:00-18:00 → VIDEO-GV-01 production
17:30-18:30 → SANDRA-FE-01 integration
18:00 → Video validation delivery
18:30 → Frontend demo ready
18:00-19:00 → CEO review window
```

### Dependencies
- **Video → Frontend**: Video file needed for avatar module integration
- **Assets → Both**: CEO materials in Downloads + logos official
- **Yama-3 → Frontend**: Backend endpoints + security layer
- **Staging → Both**: DAM upload + sandra.local deployment

### Risk Mitigation
- **Lip-sync tolerance**: ±200ms acceptable v1, parche v1.1 <60min
- **Timeline buffer**: 18:30 max 19:00 if adjustments needed
- **Quality gates**: Criterios aceptación no negotiable
- **Backup plan**: Fallback scenarios if delivery issues

---

## 📋 EVIDENCE PACKAGE PREPARATION

### For CEO Review 18:00-19:00
```
📁 SANDRA_V1_VALIDATION/
├── video_test/
│   ├── GV_Montanejos_Test_v1.mp4
│   ├── GV_Montanejos_Test_v1_square.mp4
│   ├── subtitulos.srt
│   ├── thumb1.jpg, thumb2.jpg, thumb3.jpg
│   └── hoja_tecnica.md
├── frontend_demo/
│   ├── url_staging_credentials.txt
│   ├── guia_demo_1min.md
│   ├── metricas_panel_screenshot.png
│   └── integration_test_results.json
└── coordination/
    ├── timeline_execution.md
    ├── quality_checklist.md
    └── next_steps_decision.md
```

---

**🪖 WORK ORDER SANDRA V1 READY - COORDINATION ACTIVE**  
**VIDEO-GV-01 + SANDRA-FE-01 activated parallel execution**  
**George Thomas - CODE Coordinador**  
**Standing Orders: Sin improvisar + evidencias obligatorias**
# 🛡️ ESCUADRÓN SANDRA-FE-01 - FRONTEND IA ESPECIALIZADO

## Mandato CEO: Sandra Frontend v0.1 en 60 minutos
**Coordinador**: George Thomas (CODE) - Solo coordina, no programa ni mergea

---

## 👥 NÚCLEO TÉCNICO FRONTEND (7 ROLES)

### 🔧 **TL Frontend** (Owner técnico)
- **Responsabilidad**: Build completo en 1h + arquitectura Next.js/React
- **Authority**: Merge approval + decisiones técnicas
- **Deliverable**: MVP funcional staging con HTTPS
- **Framework**: Next.js/React (o Vite si preferido)

### 🎵 **FE WebRTC/Media**
- **Responsabilidad**: Micro, altavoz, cámara, lip-sync
- **Especialización**: WebRTC + MediaDevices + WebAudio
- **Features**: PTT + VAD + TTS streaming
- **Audio**: Control eco <-25dB + latencia <150ms

### 🎨 **FE UI/UX**
- **Responsabilidad**: Layout, estados, accesibilidad AA
- **Design**: Grid 2x2 (Chat/Voz/Avatar/Cámara)
- **Standards**: Contraste AA + foco visible + Space=PTT
- **Branding**: Logo GuestsValencia + tema oscuro/claro

### 🔌 **FE Integrations**
- **Responsabilidad**: APIs via Yama-3 + token management
- **Services**: 11Labs (voz) + GPT-4 (chat) + Llama 3 (vision)
- **Security**: Tokens servidor (.env) - nunca cliente
- **Gateway**: Yama-3 orquestación + scoped access

### 🚀 **DevOps**
- **Responsabilidad**: .env + staging + dominio interno + HTTPS
- **Domain**: sandra.local (o similar internal)
- **Deploy**: Staging automático + CI pipeline
- **Security**: SSL certificates + CORS config

### ✅ **QA Exprés**
- **Responsabilidad**: Pruebas 15min - voz/vídeo/cámara/caídas
- **Testing**: Chat <1.5s + PTT/VAD + lip-sync ±150ms
- **Checklist**: Funcionalidad + errores + reconexión automática
- **Report**: Métricas latencia + % reconexiones

### 📋 **PM de Entrega**
- **Responsabilidad**: Timebox 60min + checklist + Go/No-Go
- **Tracking**: Progress cada 15min + bloqueos escalation
- **Demo**: Script "Hola Sandra" + PTT + vision test
- **DoD**: Staging HTTPS + informe 1 página

---

## 🤖 IAs TÉCNICAS DE APOYO

### 📈 **Lighthouse-Bot**
- **Función**: Performance checks + Core Web Vitals
- **Target**: Score ≥80 (MVP fast iteration)
- **Reports**: Automático cada commit
- **Focus**: Rendering + media optimization

### 🔍 **A11y-Bot**
- **Función**: Accesibilidad AA compliance
- **Checks**: Contraste + foco + keyboard navigation
- **Standards**: WCAG AA minimum
- **Integration**: PTT keyboard shortcuts

### 🔗 **Link-Checker**
- **Función**: API endpoints + media sources
- **Coverage**: Yama-3 gateway + avatar assets
- **Validation**: WebRTC + media permissions
- **Alerts**: Integration failures

---

## 🧩 ARQUITECTURA MVP (60 minutos)

### Frontend Client (Next.js/React)
```
src/
├── components/
│   ├── ChatPanel/          # Texto ↔ respuesta + historial
│   ├── CallPanel/          # PTT + VAD + audio controls
│   ├── AvatarPlayer/       # Video local + lip-sync
│   ├── CameraCapture/      # Fotograma → vision cada 5-10s
│   └── StatusBar/          # Conexión + latencia + tokens/min
├── services/
│   ├── yama3-gateway.js    # API client integration
│   ├── webrtc-handler.js   # Media + audio processing
│   └── lip-sync.js         # Basic phoneme timing
└── assets/
    ├── logos/              # GuestsValencia official
    └── avatars/            # Local video files
```

### Backend Gateway (Yama-3)
```
Endpoints:
POST /chat              # GPT-4 texto orquestación
WS   /realtime-voice    # 11Labs STT+TTS streaming  
POST /vision            # Llama 3 imagen + texto
GET  /avatar/phonemes   # Lip-sync timing signals
POST /telemetry         # Frontend events + metrics
```

---

## 📦 ASSETS & INPUTS

### ✅ Logos Oficiales (Ya listos)
- **JPG**: 400JpgdpiLogoCroppedBW.jpg
- **PNG**: 400PngdpiLogoCroppedBW.png
- **Ubicación**: Recibidos por CEO
- **Implementación**: FE UI/UX

### ✅ Avatares + Voz IDs
- **Carpeta**: C:\Users\clayt\Downloads\
- **Content**: Avatar videos + voice IDs CEO
- **Usage**: Exactamente IDs proporcionados
- **Processing**: FE WebRTC/Media

### ✅ Textos Base
- **Source**: GuestsValencia existentes
- **Purpose**: Saludo inicial + system prompts
- **Integration**: FE Integrations + Content

---

## 🔒 CONFIGURACIÓN SEGURIDAD

### .env (Servidor/Gateway)
```bash
YAMA3_GATEWAY_URL=
YAMA3_API_KEY=
OPENAI_API_KEY=            # GPT-4
ELEVENLABS_API_KEY=
LLAMA3_ENDPOINT_URL=       # visión
JWT_AUDIENCE=frontend.sandra
JWT_TTL_SECONDS=600
CORS_ALLOW_ORIGINS=https://sandra.local
```

### Security Rules
- **Tokens**: NUNCA en cliente, solo servidor
- **Scopes**: Limited access via Yama-3
- **TTL**: 600 segundos auto-expire
- **CORS**: Restringido a sandra.local

---

## 🎯 MVP FEATURES (4 BLOQUES)

### 1. Chat Panel
- **Input**: Texto + stream respuesta
- **Display**: Historial lateral scrollable
- **API**: POST /chat via Yama-3
- **Response**: <1.5s target latency

### 2. Call Panel  
- **PTT**: Hold to talk button
- **VAD**: Auto voice detection (opcional)
- **TTS**: 11Labs streaming playback
- **Audio**: Echo control <-25dB

### 3. Avatar Player
- **Video**: Local file from Downloads
- **Lip-sync**: Basic phoneme timing
- **Controls**: Play/pause + sync indicators  
- **Timing**: ±150ms acceptable sync

### 4. Camera Capture
- **Permission**: Camera access prompt
- **Frequency**: Fotograma cada 5-10s
- **API**: POST /vision (multipart)
- **Toggle**: ON/OFF user control

### Status Bar
- **Connection**: ✅ conectado / ⏳ reconectando
- **Usage**: Tokens/min counter
- **Latency**: Response time ms
- **Health**: System status indicators

---

## ⚡ LIP-SYNC ESTRATEGIA (v0.1 Básico)

### Simple Approach
1. **Phoneme Timing**: GET /avatar/phonemes?id=<avatar_id>
2. **CSS Animation**: Máscara boca + timing marks
3. **Video Overlay**: Animated mouth sync if needed
4. **Tolerance**: ±150ms acceptable MVP

### Future v0.2
- 11Labs phoneme integration
- Advanced facial animation
- Real-time rendering optimization

---

## ✅ QA EXPRÉS CHECKLIST (15 minutos)

### Funcionalidad Core
- [ ] Chat: Request/response <1.5s staging
- [ ] Voz: PTT + VAD funcionan + eco <-25dB
- [ ] Avatar: Play/pausa + lip-sync ±150ms
- [ ] Cámara: Permiso + fotogramas → /vision

### Error Handling
- [ ] Mensajes claros + user-friendly
- [ ] Reconexión automática
- [ ] Fallback graceful degradation

### Accesibilidad
- [ ] Teclado completo (Space=PTT)
- [ ] Lector pantalla en Chat
- [ ] Contraste AA compliant

---

## 🎬 DEMO SCRIPT (DoD)

### Test Scenario
1. **Text Chat**: "Hola Sandra, soy Clay..."
2. **PTT Voice**: "¿Qué ves en esta imagen?" (muestra cámara)
3. **Response**: Sandra responde voz + texto + avatar sync
4. **Validation**: Latencia + sync + funcionalidad

### Success Criteria
- All 4 panels functional
- Audio/video sync acceptable  
- No critical errors
- Performance adequate

---

## 📊 DEFINITION OF DONE (v0.1)

### Deliverables
- [ ] Deploy staging HTTPS (sandra.local)
- [ ] Demo script ejecutable
- [ ] Informe 1 página: latencia media + % reconexiones + errores
- [ ] All QA exprés items passed

### Approval Process
- [ ] TL Frontend + QA approval
- [ ] PM demo validation
- [ ] CEO Go/No-Go antes producción

---

## ⏱️ TIMELINE (60 MINUTOS)

### 0-15min: Setup + Architecture
- Branch creation + basic structure
- Component scaffolding
- API integration setup

### 15-35min: Core Development  
- 4 panels implementation
- Yama-3 integration
- Basic UI/UX

### 35-50min: Integration + Testing
- Lip-sync basic implementation
- QA exprés execution
- Bug fixes critical

### 50-60min: Deploy + Demo
- Staging deployment HTTPS
- Demo script testing
- Report generation

---

**🚨 ESTADO**: SANDRA-FE-01 ACTIVADO  
**COORDINADOR**: George Thomas - LISTO  
**OBJETIVO**: MVP en 60 minutos  
**RESTRICCIÓN**: No producción sin CEO OK

Sin improvisar - Ejecutando orden directa CEO.
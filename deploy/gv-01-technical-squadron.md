# 🛡️ ESCUADRÓN WEB GV-01 - ESPECIALISTAS TÉCNICOS WEB

## Mandato CEO: Reconstruir Web GuestsValencia
**Coordinador**: George Thomas (CODE) - Solo coordina, no programa ni mergea

---

## 👥 NÚCLEO TÉCNICO (8 ROLES ESPECIALIZADOS)

### 🔧 **TL Frontend** (Owner técnico)
- **Responsabilidad**: Arquitectura, revisión PRs, protección rama main
- **Autoridad**: Decisiones técnicas + merge approval
- **Stack**: Mantener existente, sin refactors
- **Branch**: feature/gv-rebuild ownership

### 💻 **Frontend Dev #1**
- **Responsabilidad**: Maquetación, componentes core, responsive
- **Especialización**: React/Vue components, CSS Grid/Flexbox
- **Prioridad**: Mobile-first development
- **Performance**: Bundle optimization, lazy loading

### 💻 **Frontend Dev #2**  
- **Responsabilidad**: Performance, interactividad, animaciones
- **Especialización**: Performance tuning, Core Web Vitals
- **Tools**: Webpack/Vite optimization, component lazy loading
- **Testing**: Cross-browser compatibility

### 🎨 **UX/UI Specialist**
- **Responsabilidad**: Layout, sistema visual, accesibilidad AA
- **Deliverables**: Handoff a frontend, design system
- **Standards**: WCAG AA compliance, contraste, legibilidad
- **Brand**: Identidad GuestsValencia (sin redesign)

### 📝 **Content Integrator**
- **Responsabilidad**: Insertar textos antiguos + assets CEO
- **Fuente única**: C:\Users\clayt\Downloads + logos oficiales
- **Restricción**: NO reescribir, solo integrar tal cual
- **Formato**: Maintain original copy integrity

### 📊 **SEO/Performance Specialist**
- **Responsabilidad**: Metadatos, schema.org, Core Web Vitals
- **Deliverables**: sitemap.xml, robots.txt, structured data
- **Schema**: LodgingBusiness/Hotel/LocalBusiness
- **Images**: WebP/AVIF + srcset optimization

### ✅ **QA Funcional & UX**
- **Responsabilidad**: Pruebas flujos, enlaces, móviles, checklist
- **Authority**: Puede bloquear release si falla DoD
- **Testing**: Cross-device, funcionalidad, accessibility
- **Reports**: QA checklist por fase + bloqueos

### 🚀 **DevOps Engineer**
- **Responsabilidad**: Staging, previews PR, cache/CDN, rollback
- **Infrastructure**: CI/CD, deployment pipeline
- **Monitoring**: Uptime alerts, performance monitoring
- **Security**: Branch protection, access control

### 📋 **PM de Entrega**
- **Responsabilidad**: Planning, daily updates, control alcance
- **Canal**: #gv-web-rebuild management
- **Cadencia**: 2 updates/día (mañana/tarde)
- **Escalation**: Bloqueos inmediatos a George Thomas

---

## 🤖 IAs TÉCNICAS DE APOYO (NO MARKETING)

### 🔍 **A11y-Bot**
- **Función**: WCAG compliance + contraste validation
- **Output**: Tickets automáticos con fallos accessibility
- **Standards**: AA level minimum
- **Integration**: PR checks + reports

### 📈 **Lighthouse-Bot**
- **Función**: Performance measurements por commit
- **Métricas**: Performance/SEO/Best-Practices/Accessibility ≥85
- **Reports**: Adjunta reportes detallados cada PR
- **Alerts**: Performance regression warnings

### 📋 **Schema-Bot**
- **Función**: Valida schema.org markup
- **Types**: LodgingBusiness/Hotel/LocalBusiness
- **Validation**: Google Rich Results testing
- **Output**: Structured data compliance reports

### 🔗 **Link-Checker**
- **Función**: Rastrea enlaces rotos interno/externo
- **Coverage**: Todo el sitio + navegación
- **Frequency**: Every PR + daily scheduled
- **Reports**: Broken links summary + fix recommendations

### 🖼️ **Image-Pipeline**
- **Función**: Genera variantes responsive + optimización
- **Formats**: AVIF/WebP + fallbacks
- **Output**: srcset automation + weight optimization
- **Performance**: Lazy loading + progressive enhancement

---

## 🛡️ GUARDARRAÍLES TÉCNICOS

### Branch Strategy
```
main (protected)
├── feature/gv-rebuild (working branch)
    ├── feature/gv-home
    ├── feature/gv-alojamientos  
    ├── feature/gv-experiencias
    └── feature/gv-contacto
```

### Protection Rules
- **PR obligatorio** a main
- **2 revisiones mínimas**: TL Frontend + QA
- **CI checks**: Build + tests + Lighthouse
- **Preview**: Staging automático por PR

### CODEOWNERS
```
* @tl-frontend @qa-funcional
/src/ @tl-frontend @frontend-dev-1 @frontend-dev-2
/content/ @content-integrator
/public/ @seo-performance
/.github/ @devops-engineer
```

---

## 📋 FUENTE ÚNICA DE VERDAD

### ✅ Textos Aprobados
- **Origen**: CEO Clay Thomas (textos antiguos)
- **Ubicación**: C:\Users\clayt\Downloads
- **Uso**: Exactamente 1:1, sin modificaciones
- **Validación**: Content Integrator responsible

### ✅ Logos Oficiales
- **JPG**: 400JpgdpiLogoCroppedBW.jpg
- **PNG**: 400PngdpiLogoCroppedBW.png  
- **Fuente**: Enviados por CEO
- **Implementación**: UX/UI + Frontend Devs

### ✅ Assets Adicionales
- **Carpeta**: C:\Users\clayt\Downloads (CEO)
- **Contenido**: Fotos alojamientos, datos contacto
- **Processing**: Image-Pipeline optimization
- **Approval**: Solo assets aprobados CEO

---

## 🎯 FASES ENTREGA (GO/NO-GO CEO)

### FASE A: "Proof of Vision"
**Objetivo**: Home + ficha Montanejos operativas staging

**Scope**:
- Home: hero + CTA "Reservar ahora" + propuesta valor sin comisiones
- Ficha Montanejos: texto antiguo + fotos + amenities + WhatsApp
- Responsive: Mobile-first + desktop
- Performance: <2.5s carga 4G + Lighthouse ≥85

**QA Checklist A**:
- [ ] Logo/identidad correctos
- [ ] Copys idénticos textos antiguos  
- [ ] Enlaces + WhatsApp funcionales
- [ ] Meta/OG tags completos
- [ ] Lighthouse report ≥85 adjunto

### FASE B: "Contenido Completo"
**Objetivo**: Todas secciones con textos antiguos

**Scope**:
- Páginas: Inicio/Alojamientos/Experiencias/Reservas/Contacto
- Navigation: Menu completo + enlaces internos
- SEO: sitemap.xml + robots.txt + schema.org
- Images: Optimizadas + srcset responsive

**QA Checklist B**:
- [ ] Navegación completa funcional
- [ ] Enlaces internos/externos OK
- [ ] Formularios + WhatsApp operativos
- [ ] Schema.org validado
- [ ] Images optimized + responsive

### FASE C: "Endurecimiento & Release Prep"  
**Objetivo**: Preparación producción

**Scope**:
- Performance: CDN/cache + compresión + prefetch
- Monitoring: Uptime alerts + performance tracking
- Backup: Build archivado + rollback plan
- Security: Hardening + access control

**Definition of Done**:
- [ ] CEO approval por escrito
- [ ] PR final aprobado TL + QA + DevOps
- [ ] Tag release-gv-v1 + rollback plan
- [ ] Producción deployment ready

---

## 📞 COMUNICACIÓN OPERATIVA

### Canal Principal
- **Discord**: #gv-web-rebuild
- **Status**: Pinned updates + progress tracking
- **Escalation**: George Thomas (Coordinador)

### Update Format (2x/día)
```
🟢 AVANCES: [completados últimas 12h]
🟡 BLOQUEOS: [impedimentos requieren escalation]
🔵 PRÓXIMOS: [siguientes 12h priorities]  
🟠 RIESGOS: [potenciales problems + mitigation]
```

### Demo Go/No-Go
- **Entrega**: Staging link + QA report (1 página)
- **Decisor**: CEO Clay Thomas
- **Process**: Demo → QA validation → CEO approval → next phase

---

## ⚡ ESTADO ACTIVACIÓN

**ESCUADRÓN WEB GV-01**: ✅ TÉCNICOS ASIGNADOS  
**8 ROLES NÚCLEO**: ✅ ESPECIALIZADOS WEB  
**5 IAs TÉCNICAS**: ✅ QA/PERFORMANCE/SEO  
**COORDINADOR**: George Thomas - ACTIVO  

**PRÓXIMO PASO**: Configurar branch feature/gv-rebuild + establecer fuente única verdad

Sin improvisar - Esperando textos antiguos CEO para inicio FASE A.

**DIFERENCIA CLAVE**: Este equipo es 100% técnico web (no marketing), especializado en desarrollo front-end, performance, SEO y QA funcional.
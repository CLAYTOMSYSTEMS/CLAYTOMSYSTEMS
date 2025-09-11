# 🎬 VIDEO VALIDACIÓN MONTANEJOS - Coordinación Activa

**Escuadrón**: VIDEO-GV-01 (guías creativas)  
**Coordinador**: George Thomas (CODE) - coordino, no produzco  
**Deadline**: 18:00 CEST - 70 minutos execution window  
**Objetivo**: Validar estética + voz + sincronización Sandra

---

## 🎯 ESPECIFICACIONES TÉCNICAS PRECISAS

### Video Principal
```yaml
archivo: "GV_Montanejos_Test_v1.mp4"
duracion: "12-15 segundos exactos"
formato: 
  resolucion: "1080×1920 (vertical)"
  fps: "24 o 30 fps"
  codec: "H.264"
  bitrate: "12-20 Mbps"
  
audio:
  loudness: "-18 LUFS integrados"
  picos: "-1 dBTP máximo"
  mix: "voz clara + música instrumental suave por debajo"
```

### Guión Sandra (EXACTO)
```
"Bienvenidos a Montanejos con GuestsValencia. 
Aguas termales, naturaleza y reserva directa sin comisiones."
```

### Estética Visual
```yaml
locacion: "Montanejos otoñal"
elementos:
  - "río con aguas termales"
  - "paisaje verde musgo"
  - "ambiente natural otoñal"
vestuario_sandra:
  - "tonos tierra"
  - "prototipo estacional"
branding:
  logo: "GuestsValencia en esquina"
  cta_final: "2 segundos - Reserva directa + WhatsApp"
```

---

## 📦 ASSETS FUENTE ÚNICA VERDAD

### Materiales CEO (Ubicación Exacta)
```bash
# Avatar + Voice IDs
AVATAR_PATH="C:\Users\clayt\Downloads\"
# Usar exactamente los IDs entregados por CEO
# NO improvisar - solo archivos especificados

# Logos Oficiales
LOGO_JPG="/mnt/data/400JpgdpiLogoCroppedBW.jpg"
LOGO_PNG="/mnt/data/400PngdpiLogoCroppedBW.png"
# Solo estos logos - brand consistency crítica
```

### Verification Assets
```bash
# Verificar disponibilidad assets antes de iniciar producción
if [ -d "C:\Users\clayt\Downloads\" ]; then
  echo "✅ Avatar assets directory accessible"
  ls "C:\Users\clayt\Downloads\" | head -10  # List first 10 files
else
  echo "❌ ESCALATION: Avatar assets not accessible"
fi

if [ -f "/mnt/data/400JpgdpiLogoCroppedBW.jpg" ]; then
  echo "✅ Logo JPG available"
else
  echo "❌ ESCALATION: Logo JPG missing"
fi
```

---

## 🎬 PRODUCTION PIPELINE

### Phase 1: Pre-Production (5min)
```yaml
asset_verification:
  - avatar_id_selection: "from CEO Downloads folder"
  - voice_id_validation: "exact CEO specifications"
  - logo_integration: "GuestsValencia brand consistency"
  - script_timing: "12-15s with natural pacing"

technical_setup:
  - render_settings: "1080×1920 H.264 12-20Mbps"
  - audio_levels: "-18 LUFS music, clear voice"
  - lip_sync_target: "±150ms (acceptable ±200ms)"
  - quality_preset: "high for final delivery"
```

### Phase 2: Production (45min)
```yaml
video_generation:
  - avatar_rendering: "Sandra with autumn Montanejos background"
  - voice_synthesis: "clear pronunciation, natural rhythm"
  - lip_sync_calibration: "phoneme alignment optimization"
  - background_integration: "thermal waters + moss green nature"

audio_production:
  - voice_track: "clean recording, no artifacts"
  - music_bed: "instrumental, -18 LUFS, supporting"
  - mixing: "voice prominence, music complement"
  - loudness_normalization: "broadcast standards"

visual_composition:
  - logo_placement: "corner position, readable"
  - cta_animation: "final 2s, clear call-to-action"
  - color_grading: "autumn warmth, natural tones"
  - quality_check: "no flicker, ghosting, artifacts"
```

### Phase 3: Post-Production (15min)
```yaml
format_variants:
  - vertical_primary: "GV_Montanejos_Test_v1.mp4"
  - square_instagram: "GV_Montanejos_Test_v1_square.mp4 (1080×1080)"
  
subtitles:
  - format: "subtitulos.srt"
  - language: "Spanish"
  - timing: "precise word alignment"
  - style: "readable, non-intrusive"

thumbnails:
  - thumb1: "opening frame 1280×720"
  - thumb2: "mid-action 1280×720" 
  - thumb3: "cta frame 1280×720"
  - quality: "high resolution, compelling"

technical_sheet:
  - bitrate_actual: "measured output"
  - loudness_verification: "LUFS measurement"
  - color_profile: "color space documentation"
  - file_size: "delivery optimization"
```

---

## ✅ CRITERIOS ACEPTACIÓN (CHECKLIST)

### Technical Quality
```
☐ Lip-sync precision: ±150ms target (±200ms acceptable v1)
☐ Audio clarity: Voice clear, no artifacts
☐ Music integration: Instrumental below voice, -18 LUFS
☐ Video quality: No flicker, ghosting, compression artifacts
☐ Mobile playback: Smooth reproduction on mobile devices
```

### Brand Compliance
```
☐ Logo placement: GuestsValencia visible, corner position
☐ CTA visibility: "Reserva directa" + WhatsApp in safe area
☐ Brand consistency: Only GuestsValencia branding
☐ Aesthetic alignment: Autumn Montanejos look & feel
☐ Script accuracy: Exact guion delivery, natural pace
```

### Technical Specifications
```
☐ Format compliance: 1080×1920 vertical + 1080×1080 square
☐ Duration accuracy: 12-15 seconds exactly
☐ Codec standards: H.264, 12-20 Mbps bitrate
☐ Audio standards: -18 LUFS integrated, -1 dBTP peaks
☐ File deliverables: MP4 + SRT + 3 thumbnails + technical sheet
```

---

## 📊 COORDINATION MONITORING

### Progress Tracking
```yaml
milestone_checkpoints:
  "17:05": "Asset verification complete"
  "17:15": "Pre-production setup done"
  "17:45": "Main production render complete"
  "17:55": "Variants + subtitles ready"
  "18:00": "Upload to staging DAM complete"

quality_gates:
  technical_review: "Lip-sync + audio + visual quality"
  brand_review: "Logo + CTA + aesthetic compliance"
  delivery_review: "All formats + files present"
```

### Risk Management
```yaml
potential_issues:
  lip_sync_accuracy:
    risk: "±150ms target difficult"
    mitigation: "±200ms acceptable v1, patch v1.1 <60min"
  
  asset_access:
    risk: "CEO materials not accessible"
    mitigation: "Immediate escalation + alternative sources"
  
  render_time:
    risk: "Production exceeds timeline"
    mitigation: "Parallel processing + quality preset adjustment"
  
  upload_failure:
    risk: "Staging DAM issues"
    mitigation: "Alternative delivery method + immediate alert"
```

---

## 📡 STAGING DAM UPLOAD

### Delivery Structure
```
📁 SANDRA_V1_VIDEO_VALIDATION/
├── primary/
│   └── GV_Montanejos_Test_v1.mp4
├── variants/
│   └── GV_Montanejos_Test_v1_square.mp4
├── subtitles/
│   └── subtitulos.srt
├── thumbnails/
│   ├── thumb1.jpg
│   ├── thumb2.jpg
│   └── thumb3.jpg
└── technical/
    └── hoja_tecnica.md
```

### Upload Protocol
```bash
# Staging DAM upload - NO PUBLIC PUBLISH
DAM_STAGING="https://staging-dam.claytomsystems.com/sandra-v1/"

# Upload sequence
echo "📤 Uploading to staging DAM..."
upload_file "GV_Montanejos_Test_v1.mp4" "$DAM_STAGING/primary/"
upload_file "GV_Montanejos_Test_v1_square.mp4" "$DAM_STAGING/variants/"
upload_file "subtitulos.srt" "$DAM_STAGING/subtitles/"
upload_file "thumb*.jpg" "$DAM_STAGING/thumbnails/"
upload_file "hoja_tecnica.md" "$DAM_STAGING/technical/"

echo "✅ Upload complete - staging only, no social media publish"
```

---

## 🚨 ESCALATION PROTOCOLS

### Technical Issues
```yaml
lip_sync_problems:
  action: "Continue with ±200ms tolerance"
  notify: "CEO acceptance criteria adjusted"
  
asset_unavailable:
  action: "Immediate escalation to CEO"
  fallback: "None - CEO assets required"
  
render_failure:
  action: "Alternative pipeline + quality adjustment"
  timeline: "Maintain 18:00 deadline"
```

### Quality Issues
```yaml
audio_artifacts:
  action: "Re-render with clean voice track"
  fallback: "Manual cleanup if time permits"
  
visual_quality:
  action: "Adjust render settings + re-export"
  priority: "Mobile playback smoothness critical"
  
brand_compliance:
  action: "No compromise - fix immediately"
  escalation: "CEO approval required for any deviation"
```

---

**🎬 VIDEO VALIDATION MONTANEJOS - COORDINATION ACTIVE**  
**Timeline**: 70 minutes to delivery  
**Quality gates**: Technical + Brand + Delivery compliance  
**George Thomas - CODE Coordinador**  
**Status**: Monitoring production pipeline + quality checkpoints**
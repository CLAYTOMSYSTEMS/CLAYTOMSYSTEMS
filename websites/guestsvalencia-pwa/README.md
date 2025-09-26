# GuestsValencia PWA Pro+

Una aplicación web progresiva (PWA) de próxima generación para la gestión de alojamientos premium con Sandra IA integrada.

## 🚀 Características

- **Next.js 14** con App Router y TypeScript
- **Sandra IA Pro+** con 5 chatbots especializados
- **Integración de voz** (TTS/STT) con ElevenLabs y Deepgram
- **Dashboards avanzados** para administradores y propietarios
- **PWA nativa** con soporte offline
- **API completa** para chat, voz y webhooks de Twilio
- **TailwindCSS** para diseño responsivo

## 🏗️ Estructura del Proyecto

```
websites/guestsvalencia-pwa/
├── public/                 # Archivos estáticos
│   ├── manifest.json      # Manifiesto PWA
│   ├── service-worker.js  # Service Worker
│   └── alojamientos/      # Imágenes de apartamentos
├── src/
│   ├── app/               # App Router de Next.js
│   │   ├── api/           # API Routes
│   │   │   ├── chat/      # Chat con OpenAI
│   │   │   ├── tts/       # Text-to-Speech
│   │   │   ├── stt/       # Speech-to-Text
│   │   │   └── twilio/    # Webhooks Twilio
│   │   ├── alojamientos/  # Páginas de alojamientos
│   │   ├── sandra/        # Chat con Sandra IA
│   │   └── dashboard/     # Dashboards admin/owner
│   ├── components/        # Componentes React
│   └── lib/              # Utilidades y clientes API
├── styles/               # Estilos globales
└── netlify.toml         # Configuración Netlify
```

## 🛠️ Desarrollo Local

### Requisitos Previos

- Node.js 18 o superior
- npm o yarn

### Instalación

```bash
# Navegar al directorio del proyecto
cd websites/guestsvalencia-pwa

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Configurar las API keys en .env
# Ver sección "Variables de Entorno" más abajo
```

### Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Build de Producción

```bash
npm run build
npm start
```

## 🔧 Variables de Entorno

Copia `.env.example` a `.env` y configura las siguientes variables:

```env
# CORS
ALLOW_ORIGIN=*

# APIs de IA
OPENAI_API_KEY=tu_openai_api_key
OPENAI_MODEL_DEFAULT=gpt-4o-mini
OPENAI_MODEL_GUEST=gpt-4o
OPENAI_MODEL_VISITOR=gpt-3.5-turbo

# Servicios de voz
DEEPGRAM_API_KEY=tu_deepgram_api_key
ELEVENLABS_API_KEY=tu_elevenlabs_api_key
ELEVENLABS_VOICE_ID=tu_voice_id

# Twilio
TWILIO_ACCOUNT_SID=tu_twilio_sid
TWILIO_AUTH_TOKEN=tu_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Base de datos
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_key

# Límites de texto
LIMIT_GUEST_TXT=1000
LIMIT_PREMIUN_TXT=5000
LIMIT_VISITOR_TXT=300
```

## 🌐 Despliegue en Netlify

### Configuración de Subdirectorio

Esta PWA está diseñada para desplegarse como un subdirectorio en Netlify:

1. **Crear un nuevo sitio en Netlify**
2. **Configurar el directorio de build**: `websites/guestsvalencia-pwa`
3. **Comando de build**: `npm run build`
4. **Directorio de publicación**: `.next` (manejado por el plugin)

### Variables de Entorno en Netlify

Configura todas las variables de entorno listadas arriba en la sección "Environment variables" de tu sitio en Netlify.

### Plugin de Next.js

El `netlify.toml` incluye automáticamente el plugin `@netlify/plugin-nextjs` para soporte completo de Next.js en Netlify.

## 🤖 Sandra IA - Chatbots Especializados

La aplicación incluye 5 chatbots especializados:

1. **Clientes** - FAQ y gestión de reservas
2. **Check-in/out** - Proceso automático de llegada/salida
3. **Soporte** - Asistencia técnica (WiFi, TV, etc.)
4. **Propietarios** - Gestión de precios y disponibilidad
5. **Monitoreo** - Supervisión de sistemas y pagos

## 📱 PWA Features

- **Instalación nativa** en dispositivos móviles y desktop
- **Funcionalidad offline** básica
- **Service Worker** para caché de recursos
- **Manifiesto PWA** completo
- **Iconos optimizados** para diferentes dispositivos

## 🎯 API Endpoints

- `POST /api/chat` - Chat con Sandra IA
- `POST /api/tts` - Text-to-Speech con ElevenLabs
- `POST /api/stt` - Speech-to-Text con Deepgram
- `POST /api/twilio/in` - Webhook entrada Twilio
- `POST /api/twilio/out` - Webhook salida Twilio

## 📊 Dashboards

### Dashboard Administrador (`/dashboard/admin`)
- KPIs operativos
- Estadísticas de Sandra IA
- Estado del sistema
- Actividad en tiempo real

### Dashboard Propietario (`/dashboard/owner`)
- Métricas de ingresos
- Ocupación por propiedad
- Sugerencias de optimización de Sandra IA
- Análisis de rendimiento

## 🔒 Seguridad

- Validación de CORS configurable
- Manejo seguro de API keys
- Rate limiting (pendiente)
- Autenticación con Supabase (preparado)

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Serverless Functions
- **IA**: OpenAI GPT-4, ElevenLabs TTS, Deepgram STT
- **Base de datos**: Supabase (preparado)
- **Comunicaciones**: Twilio
- **Despliegue**: Netlify con plugin Next.js
- **PWA**: Service Worker, Manifest

## 📄 Licencia

© 2024 GuestsValencia PWA Pro+. Todos los derechos reservados.
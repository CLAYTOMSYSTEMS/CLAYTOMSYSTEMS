# 🔐 Configurar Secrets para Extracción

## Pasos para activar los workflows:

### 1. Ir a Settings del repositorio
```
https://github.com/CLAYTOMSYSTEMS/CLAYTOMSYSTEMS/settings/secrets/actions
```

### 2. Añadir estos secrets:

#### **OPENAI_API_KEY**
```
sk-proj-tu-clave-openai-aqui
```

#### **GITHUB_TOKEN** (opcional - ya está disponible)
```
Ya está configurado automáticamente
```

### 3. Habilitar GitHub Actions
- Ir a Settings → Actions → General
- Permitir "All actions and reusable workflows"
- Dar permisos de escritura a GITHUB_TOKEN

## 🚀 Cómo usar:

### Método 1: Comentarios en Issues
Crear un issue y comentar:
```
@extract barge-in
@extract proxy
@extract llm
@extract full
```

### Método 2: Workflow Manual
- Ir a Actions tab
- Seleccionar "ChatGPT Code Extractor"
- Click "Run workflow"
- Elegir tipo de extracción

### Método 3: Automático
Los workflows se activan automáticamente cuando:
- Se crea un issue
- Se hace un comentario
- Se abre un PR

## 📋 Tipos de extracción disponibles:
- **barge-in**: Sistema de interrupciones WebRTC/VAD
- **proxy-system**: Sistema de proxy y APIs
- **llm-config**: Configuración LLM personalizada
- **full-architecture**: Arquitectura completa Sandra IA 7.0
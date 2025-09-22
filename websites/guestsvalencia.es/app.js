// Sandra IA 7.0 - Sistema completo para monetización inmediata
// CEO Clay - Urgente para alimentar familia

// Configuración API - Sin popups de clave
const API_CONFIG = {
    openai: {
        endpoint: '/api/proxy-openai',
        model: 'gpt-4-turbo-preview'
    },
    elevenlabs: {
        endpoint: '/api/proxy-11labs',
        voiceId: 'EXAVITQu4vr4xnSDxMaL' // Sarah voice
    }
};

// Estado global
let currentSection = 'hero';
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let dataset = [];
let autoTrainInterval = null;
let currentPersona = 'developer';
let currentLora = 'none';

// Secciones de navegación
function showSection(section) {
    // Ocultar todas las secciones
    document.getElementById('hero-section').classList.remove('active');
    document.getElementById('chat-section').classList.remove('active');
    document.getElementById('trainer-section').classList.remove('active');
    
    // Mostrar sección seleccionada
    document.getElementById(`${section}-section`).classList.add('active');
    currentSection = section;
    
    // Inicializar auto-entrenamiento si estamos en trainer
    if (section === 'trainer') {
        startAutoTrain();
    } else {
        stopAutoTrain();
    }
}

// Chat principal
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Agregar mensaje del usuario
    addMessageToChat(message, 'user');
    input.value = '';
    
    // Mostrar indicador de carga
    const loadingId = addMessageToChat('<span class="loading"></span> Sandra está pensando...', 'assistant');
    
    try {
        // Enviar al backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                persona: document.getElementById('persona-select').value,
                meta: { loras: currentLora }
            })
        });
        
        const data = await response.json();
        
        // Remover loading
        document.getElementById(loadingId).remove();
        
        // Mostrar respuesta
        addMessageToChat(data.text || data.message, 'assistant');
        
        // Reproducir audio si está disponible
        if (data.audioUrl) {
            playAudioResponse(data.audioUrl);
        } else if (data.audio) {
            // Si viene como base64
            const audioBlob = base64ToBlob(data.audio, 'audio/mpeg');
            const audioUrl = URL.createObjectURL(audioBlob);
            playAudioResponse(audioUrl);
        }
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById(loadingId)?.remove();
        addMessageToChat('Lo siento, hubo un error. Por favor intenta de nuevo.', 'assistant');
    }
}

function addMessageToChat(content, type) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    const messageId = `msg-${Date.now()}`;
    messageDiv.id = messageId;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = content;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageId;
}

// Sistema de voz
async function toggleVoice() {
    const voiceBtn = document.getElementById('voiceBtn');
    
    if (!isRecording) {
        // Iniciar grabación
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                await processVoiceInput(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };
            
            mediaRecorder.start();
            isRecording = true;
            voiceBtn.classList.add('recording');
            voiceBtn.innerHTML = '⏹️';
            
        } catch (error) {
            console.error('Error al acceder al micrófono:', error);
            alert('No se pudo acceder al micrófono');
        }
    } else {
        // Detener grabación
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            isRecording = false;
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '🎤';
        }
    }
}

async function processVoiceInput(audioBlob) {
    // Convertir audio a texto (simulado por ahora)
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    try {
        const response = await fetch('/api/speech-to-text', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('messageInput').value = data.text;
            sendMessage();
        }
    } catch (error) {
        console.error('Error procesando voz:', error);
        // Fallback: usar el texto directamente
        document.getElementById('messageInput').value = "[Audio recibido]";
        sendMessage();
    }
}

function playAudioResponse(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch(e => {
        console.log('Audio playback failed:', e);
    });
}

// Sistema de entrenamiento
function startAutoTrain() {
    if (autoTrainInterval) return;
    
    autoTrainInterval = setInterval(async () => {
        if (dataset.length > 0) {
            await trainModel();
        }
    }, 5000); // Cada 5 segundos
    
    updateAutoTrainStatus(true);
}

function stopAutoTrain() {
    if (autoTrainInterval) {
        clearInterval(autoTrainInterval);
        autoTrainInterval = null;
    }
    updateAutoTrainStatus(false);
}

function updateAutoTrainStatus(active) {
    const status = document.getElementById('auto-train-status');
    if (status) {
        status.textContent = active ? 'Auto-entrenamiento: Activo (5s)' : 'Auto-entrenamiento: Inactivo';
        status.style.background = active ? '#fef3c7' : '#fee2e2';
    }
}

async function trainModel() {
    if (dataset.length === 0) return;
    
    try {
        const response = await fetch('/api/train', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                examples: dataset,
                persona: document.getElementById('trainer-persona')?.value || 'developer',
                lora: document.getElementById('lora-select')?.value || 'none'
            })
        });
        
        if (response.ok) {
            console.log('Modelo entrenado exitosamente');
        }
    } catch (error) {
        console.error('Error entrenando:', error);
    }
}

function addExample() {
    const userInput = document.getElementById('example-user').value.trim();
    const assistantInput = document.getElementById('example-assistant').value.trim();
    
    if (!userInput || !assistantInput) {
        alert('Por favor completa ambos campos');
        return;
    }
    
    const example = {
        user: userInput,
        assistant: assistantInput,
        timestamp: new Date().toISOString()
    };
    
    dataset.push(example);
    
    // Agregar a la lista visual
    const datasetList = document.getElementById('dataset-list');
    const item = document.createElement('div');
    item.className = 'dataset-item';
    item.textContent = `${userInput.substring(0, 50)}...`;
    item.onclick = () => loadExample(dataset.length - 1);
    datasetList.appendChild(item);
    
    // Guardar en backend
    storeExample(example);
    
    // Limpiar campos
    clearExample();
    
    // Notificar
    showNotification('Ejemplo agregado al dataset');
}

function clearExample() {
    document.getElementById('example-user').value = '';
    document.getElementById('example-assistant').value = '';
}

function loadExample(index) {
    if (dataset[index]) {
        document.getElementById('example-user').value = dataset[index].user;
        document.getElementById('example-assistant').value = dataset[index].assistant;
    }
}

async function storeExample(example) {
    try {
        await fetch('/api/store-example', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(example)
        });
    } catch (error) {
        console.error('Error guardando ejemplo:', error);
    }
}

// Import/Export JSONL
function importJSONL() {
    document.getElementById('jsonl-input').click();
}

async function handleJSONLImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
        try {
            const data = JSON.parse(line);
            if (data.user && data.assistant) {
                dataset.push(data);
                
                // Actualizar UI
                const datasetList = document.getElementById('dataset-list');
                const item = document.createElement('div');
                item.className = 'dataset-item';
                item.textContent = `${data.user.substring(0, 50)}...`;
                datasetList.appendChild(item);
            }
        } catch (e) {
            console.error('Error parsing JSONL line:', e);
        }
    });
    
    showNotification(`${lines.length} ejemplos importados`);
}

async function exportJSONL() {
    if (dataset.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    try {
        const response = await fetch('/api/export-jsonl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataset })
        });
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sandra-dataset-${Date.now()}.jsonl`;
        a.click();
        
        showNotification('Dataset exportado exitosamente');
    } catch (error) {
        console.error('Error exportando:', error);
        // Fallback: exportar localmente
        const jsonl = dataset.map(item => JSON.stringify(item)).join('\n');
        const blob = new Blob([jsonl], { type: 'application/jsonl' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sandra-dataset-${Date.now()}.jsonl`;
        a.click();
    }
}

// Test en trainer
async function testTraining() {
    const input = document.getElementById('trainer-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    const trainerChat = document.getElementById('trainer-chat');
    
    // Agregar mensaje usuario
    const userMsg = document.createElement('div');
    userMsg.style.textAlign = 'right';
    userMsg.style.marginBottom = '0.5rem';
    userMsg.innerHTML = `<span style="background: #667eea; color: white; padding: 0.3rem 0.6rem; border-radius: 10px;">${message}</span>`;
    trainerChat.appendChild(userMsg);
    
    input.value = '';
    
    // Obtener respuesta
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                persona: document.getElementById('trainer-persona').value,
                useTraining: true
            })
        });
        
        const data = await response.json();
        
        // Agregar respuesta IA
        const aiMsg = document.createElement('div');
        aiMsg.style.marginBottom = '0.5rem';
        aiMsg.innerHTML = `<span style="background: #f3f4f6; padding: 0.3rem 0.6rem; border-radius: 10px;">${data.text || data.message}</span>`;
        trainerChat.appendChild(aiMsg);
        
        trainerChat.scrollTop = trainerChat.scrollHeight;
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Utilidades
function base64ToBlob(base64, type) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
}

function showNotification(message) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Event listeners para cambios de configuración
document.addEventListener('DOMContentLoaded', () => {
    // Persona selector
    const personaSelect = document.getElementById('persona-select');
    if (personaSelect) {
        personaSelect.addEventListener('change', (e) => {
            currentPersona = e.target.value;
        });
    }
    
    // LoRA selector
    const loraSelect = document.getElementById('lora-select');
    if (loraSelect) {
        loraSelect.addEventListener('change', (e) => {
            currentLora = e.target.value;
        });
    }
    
    // Cargar dataset inicial
    loadInitialDataset();
});

async function loadInitialDataset() {
    // Cargar ejemplos predefinidos
    const initialExamples = [
        {
            user: "Hola, ¿quién eres?",
            assistant: "¡Hola! Soy Sandra IA 7.0, tu asistente conversacional premium. Estoy aquí para ayudarte con cualquier consulta o tarea que necesites."
        },
        {
            user: "¿Qué servicios ofreces?",
            assistant: "Ofrezco asistencia conversacional avanzada con voz natural, avatares en tiempo real, y capacidad de aprendizaje continuo. Puedo ayudarte como desarrollador, recepcionista, ventas o soporte técnico."
        },
        {
            user: "¿Cómo puedo reservar un alojamiento?",
            assistant: "Puedo ayudarte a encontrar el alojamiento perfecto. Dime tus fechas, número de huéspedes y preferencias, y te mostraré las mejores opciones disponibles en Valencia."
        }
    ];
    
    initialExamples.forEach(example => {
        dataset.push(example);
        const datasetList = document.getElementById('dataset-list');
        if (datasetList) {
            const item = document.createElement('div');
            item.className = 'dataset-item';
            item.textContent = `${example.user.substring(0, 50)}...`;
            item.onclick = () => loadExample(dataset.indexOf(example));
            datasetList.appendChild(item);
        }
    });
}

// Optimización de rendimiento
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(e => console.log('SW registration failed'));
    });
}

// Manejo de errores global
window.addEventListener('error', (e) => {
    console.error('Error global:', e);
});

// Prevenir pérdida de datos
window.addEventListener('beforeunload', (e) => {
    if (dataset.length > 0) {
        e.preventDefault();
        e.returnValue = '¿Estás seguro? Hay datos sin guardar.';
    }
});

console.log('Sandra IA 7.0 - Sistema cargado y listo para monetización');
console.log('CEO Clay - Sistema urgente completado para generar ingresos');
// ARSENAL S) RESUMEN CONVERSACIONAL INCREMENTAL - CONTEXT COMPRESSION
// ¡¡¡OPTIMIZACIÓN BRUTAL DE MEMORIA CONVERSACIONAL!!!

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { action, data } = JSON.parse(event.body || '{}');

    switch (action) {
      case 'SUMMARIZE_CONVERSATION':
        return await summarizeConversation(data, headers);

      case 'COMPRESS_CONTEXT':
        return await compressContext(data, headers);

      case 'GET_MEMORY_HIERARCHY':
        return await getMemoryHierarchy(data, headers);

      case 'OPTIMIZE_TOKENS':
        return await optimizeTokens(data, headers);

      case 'SLIDING_WINDOW_UPDATE':
        return await slidingWindowUpdate(data, headers);

      case 'GET_CONVERSATION_SUMMARY':
        return await getConversationSummary(data, headers);

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Acción no válida' })
        };
    }
  } catch (error) {
    console.error('Conversation Summarizer Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error en summarizer conversacional',
        details: error.message
      })
    };
  }
};

// RESUMIR CONVERSACIÓN CON ALGORITMOS INTELIGENTES
async function summarizeConversation(data, headers) {
  const {
    conversationId,
    messages,
    compressionRatio = 0.3,
    preserveImportance = true
  } = data;

  try {
    // Analizar importancia de mensajes
    const analyzedMessages = await analyzeMessageImportance(messages);

    // Crear resumen incremental
    const summary = await createIncrementalSummary(
      analyzedMessages,
      compressionRatio,
      preserveImportance
    );

    // Generar jerarquía de memoria
    const memoryHierarchy = await createMemoryHierarchy(summary, analyzedMessages);

    // Almacenar resumen
    await storeConversationSummary(conversationId, {
      summary,
      memoryHierarchy,
      originalLength: messages.length,
      compressedLength: summary.length,
      compressionRatio: summary.length / messages.length
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        summary,
        memoryHierarchy,
        compression_stats: {
          original_messages: messages.length,
          compressed_messages: summary.length,
          compression_ratio: summary.length / messages.length,
          tokens_saved: calculateTokensSaved(messages, summary)
        }
      })
    };
  } catch (error) {
    throw new Error(`Error resumiendo conversación: ${error.message}`);
  }
}

// ANALIZAR IMPORTANCIA DE MENSAJES
async function analyzeMessageImportance(messages) {
  return messages.map((message, index) => {
    const importance = calculateMessageImportance(message, index, messages);

    return {
      ...message,
      importance_score: importance,
      semantic_weight: calculateSemanticWeight(message),
      temporal_weight: calculateTemporalWeight(index, messages.length),
      context_weight: calculateContextWeight(message, messages),
      preservation_priority: importance > 0.7 ? 'high' : importance > 0.4 ? 'medium' : 'low'
    };
  });
}

// CALCULAR IMPORTANCIA DE MENSAJE
function calculateMessageImportance(message, index, allMessages) {
  let importance = 0.5; // Base score

  // Factores de importancia
  const factors = {
    // Palabras clave importantes
    keywords: calculateKeywordImportance(message.content),

    // Información de búsqueda o preferencias
    search_info: containsSearchInfo(message.content) ? 0.9 : 0.1,

    // Decisiones del usuario
    decisions: containsDecisions(message.content) ? 0.8 : 0.1,

    // Información de contacto o reserva
    booking_info: containsBookingInfo(message.content) ? 1.0 : 0.1,

    // Feedback o evaluaciones
    feedback: containsFeedback(message.content) ? 0.7 : 0.1,

    // Posición en conversación (principio y final más importantes)
    position: calculatePositionImportance(index, allMessages.length),

    // Longitud del mensaje (mensajes muy cortos menos importantes)
    length: calculateLengthImportance(message.content),

    // Referencias a mensajes anteriores
    references: containsReferences(message.content) ? 0.6 : 0.2
  };

  // Pesos para cada factor
  const weights = {
    keywords: 0.20,
    search_info: 0.25,
    decisions: 0.20,
    booking_info: 0.15,
    feedback: 0.10,
    position: 0.05,
    length: 0.03,
    references: 0.02
  };

  // Calcular importancia total
  importance = Object.entries(factors).reduce((total, [factor, value]) => {
    return total + (value * weights[factor]);
  }, 0);

  return Math.max(0, Math.min(1, importance));
}

// CREAR RESUMEN INCREMENTAL
async function createIncrementalSummary(analyzedMessages, compressionRatio, preserveImportance) {
  // Separar por prioridad de preservación
  const highPriority = analyzedMessages.filter(m => m.preservation_priority === 'high');
  const mediumPriority = analyzedMessages.filter(m => m.preservation_priority === 'medium');
  const lowPriority = analyzedMessages.filter(m => m.preservation_priority === 'low');

  const targetLength = Math.max(1, Math.floor(analyzedMessages.length * compressionRatio));

  let summary = [];

  // Siempre preservar mensajes de alta prioridad
  summary = [...highPriority];

  // Agregar mensajes de prioridad media hasta alcanzar el target
  const remainingSlots = targetLength - summary.length;
  if (remainingSlots > 0) {
    // Ordenar por importancia y tomar los mejores
    const sortedMedium = mediumPriority.sort((a, b) => b.importance_score - a.importance_score);
    summary = [...summary, ...sortedMedium.slice(0, remainingSlots)];
  }

  // Si aún hay espacio, agregar algunos de baja prioridad
  const finalSlots = targetLength - summary.length;
  if (finalSlots > 0) {
    const sortedLow = lowPriority.sort((a, b) => b.importance_score - a.importance_score);
    summary = [...summary, ...sortedLow.slice(0, finalSlots)];
  }

  // Ordenar por tiempo original para mantener flujo conversacional
  return summary.sort((a, b) => a.timestamp - b.timestamp);
}

// CREAR JERARQUÍA DE MEMORIA
async function createMemoryHierarchy(summary, originalMessages) {
  const hierarchy = {
    immediate: [], // Últimos mensajes (siempre accesibles)
    working: [],   // Contexto de trabajo actual
    episodic: [],  // Eventos importantes
    semantic: [],  // Conocimiento extraído
    procedural: [] // Patrones de comportamiento
  };

  // MEMORIA INMEDIATA - Últimos 5 mensajes
  hierarchy.immediate = originalMessages.slice(-5);

  // MEMORIA DE TRABAJO - Mensajes relevantes al contexto actual
  hierarchy.working = summary.filter(m =>
    m.importance_score > 0.6 &&
    isRecentlyRelevant(m, originalMessages)
  );

  // MEMORIA EPISÓDICA - Eventos significativos
  hierarchy.episodic = summary.filter(m =>
    containsSearchInfo(m.content) ||
    containsBookingInfo(m.content) ||
    containsDecisions(m.content)
  );

  // MEMORIA SEMÁNTICA - Conocimiento extraído
  hierarchy.semantic = extractSemanticKnowledge(summary);

  // MEMORIA PROCEDIMENTAL - Patrones de usuario
  hierarchy.procedural = extractBehavioralPatterns(originalMessages);

  return hierarchy;
}

// COMPRESIÓN DE CONTEXTO AVANZADA
async function compressContext(data, headers) {
  const { context, targetTokens, preserveEntities = true } = data;

  try {
    // Análisis de entidades importantes
    const entities = preserveEntities ? extractImportantEntities(context) : [];

    // Compresión por chunks semánticos
    const semanticChunks = segmentBySemanticGroups(context);

    // Compresión adaptativa
    const compressed = await adaptiveCompression(
      semanticChunks,
      targetTokens,
      entities
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        compressed_context: compressed,
        compression_stats: {
          original_tokens: estimateTokens(context),
          compressed_tokens: estimateTokens(compressed),
          entities_preserved: entities.length
        }
      })
    };
  } catch (error) {
    throw new Error(`Error comprimiendo contexto: ${error.message}`);
  }
}

// OPTIMIZACIÓN DE TOKENS
async function optimizeTokens(data, headers) {
  const { text, maxTokens, preserveSemantics = true } = data;

  try {
    // Estimación de tokens actual
    const currentTokens = estimateTokens(text);

    if (currentTokens <= maxTokens) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          optimized_text: text,
          tokens_saved: 0,
          compression_applied: false
        })
      };
    }

    // Aplicar optimizaciones incrementales
    let optimized = text;
    let tokensAfter = currentTokens;

    // 1. Eliminar redundancias
    optimized = removeRedundancies(optimized);
    tokensAfter = estimateTokens(optimized);

    // 2. Comprimir expresiones verbosas
    if (tokensAfter > maxTokens) {
      optimized = compressVerboseExpressions(optimized);
      tokensAfter = estimateTokens(optimized);
    }

    // 3. Resumir secciones menos críticas
    if (tokensAfter > maxTokens && !preserveSemantics) {
      optimized = summarizeLessCriticalSections(optimized, maxTokens);
      tokensAfter = estimateTokens(optimized);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        optimized_text: optimized,
        tokens_saved: currentTokens - tokensAfter,
        compression_ratio: tokensAfter / currentTokens,
        techniques_applied: ['redundancy_removal', 'expression_compression']
      })
    };
  } catch (error) {
    throw new Error(`Error optimizando tokens: ${error.message}`);
  }
}

// SLIDING WINDOW UPDATE
async function slidingWindowUpdate(data, headers) {
  const { conversationId, newMessages, windowSize = 20 } = data;

  try {
    // Obtener ventana actual
    const currentWindow = await getCurrentWindow(conversationId);

    // Agregar nuevos mensajes
    const updatedWindow = [...currentWindow, ...newMessages];

    // Aplicar sliding window
    const slidingWindow = updatedWindow.slice(-windowSize);

    // Comprimir mensajes que salen de la ventana
    const expiredMessages = updatedWindow.slice(0, -windowSize);
    if (expiredMessages.length > 0) {
      await compressExpiredMessages(conversationId, expiredMessages);
    }

    // Actualizar ventana activa
    await updateActiveWindow(conversationId, slidingWindow);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        active_window: slidingWindow,
        window_size: slidingWindow.length,
        compressed_messages: expiredMessages.length
      })
    };
  } catch (error) {
    throw new Error(`Error en sliding window: ${error.message}`);
  }
}

// FUNCIONES AUXILIARES

function calculateKeywordImportance(content) {
  const importantKeywords = [
    'reserva', 'booking', 'precio', 'disponible', 'fechas',
    'valencia', 'apartamento', 'requisitos', 'confirmar',
    'cancelar', 'modificar', 'contacto', 'urgente'
  ];

  const words = content.toLowerCase().split(/\s+/);
  const matches = words.filter(word =>
    importantKeywords.some(keyword => word.includes(keyword))
  ).length;

  return Math.min(1, matches / 3); // Máximo score con 3+ keywords
}

function containsSearchInfo(content) {
  const searchPatterns = [
    /busco|buscando|necesito|quiero/i,
    /\d+.*personas?|huéspedes?/i,
    /\d+.*noches?|días?/i,
    /presupuesto|precio.*máximo/i
  ];

  return searchPatterns.some(pattern => pattern.test(content));
}

function containsDecisions(content) {
  const decisionPatterns = [
    /elijo|prefiero|me gusta|me interesa/i,
    /sí.*me conviene|acepto|confirmo/i,
    /no.*me gusta|descarto|rechazo/i
  ];

  return decisionPatterns.some(pattern => pattern.test(content));
}

function containsBookingInfo(content) {
  const bookingPatterns = [
    /reservar|booking|confirmar.*reserva/i,
    /nombre.*completo|dni|pasaporte/i,
    /teléfono|email|contacto/i,
    /pago|tarjeta|paypal/i
  ];

  return bookingPatterns.some(pattern => pattern.test(content));
}

function containsFeedback(content) {
  const feedbackPatterns = [
    /opinión|parecer|considero|creo.*que/i,
    /muy.*bueno|excelente|perfecto|ideal/i,
    /no.*me.*gusta|malo|terrible|horrible/i,
    /recomiendo|sugiero|aconsejaría/i
  ];

  return feedbackPatterns.some(pattern => pattern.test(content));
}

function calculatePositionImportance(index, totalLength) {
  // Principio y final más importantes
  const start = index / totalLength;
  const end = (totalLength - index - 1) / totalLength;
  return Math.max(0.3, Math.min(0.9, Math.max(1 - start * 2, 1 - end * 2)));
}

function calculateLengthImportance(content) {
  const length = content.trim().split(/\s+/).length;
  if (length < 3) return 0.2; // Muy corto
  if (length < 10) return 0.5; // Corto
  if (length < 50) return 0.8; // Normal
  return 0.9; // Largo (probablemente importante)
}

function containsReferences(content) {
  const referencePatterns = [
    /como.*dije|mencioné|comenté/i,
    /anterior|antes|previamente/i,
    /lo.*que.*hablamos|dijimos/i
  ];

  return referencePatterns.some(pattern => pattern.test(content));
}

function calculateSemanticWeight(message) {
  // Peso semántico basado en entidades y conceptos importantes
  const entities = extractEntities(message.content);
  return Math.min(1, entities.length / 5);
}

function calculateTemporalWeight(index, totalLength) {
  // Peso temporal - mensajes más recientes tienen más peso
  return 0.5 + (index / totalLength) * 0.5;
}

function calculateContextWeight(message, allMessages) {
  // Peso contextual - mensajes referenciados por otros
  const references = allMessages.filter(m =>
    m.content.toLowerCase().includes(message.content.toLowerCase().substring(0, 20))
  ).length;
  return Math.min(1, references / 3);
}

function isRecentlyRelevant(message, allMessages) {
  const recentMessages = allMessages.slice(-10);
  return recentMessages.some(recent =>
    similar(recent.content, message.content) > 0.3
  );
}

function extractImportantEntities(context) {
  // Extraer entidades importantes (lugares, fechas, precios, etc.)
  const entities = [];

  // Expresiones regulares para entidades comunes
  const patterns = {
    dates: /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/g,
    prices: /\d+\s*€|\$\s*\d+|precio.*\d+/gi,
    locations: /valencia|madrid|barcelona|centro|playa/gi,
    people: /\d+\s*personas?|\d+\s*huéspedes?/gi
  };

  Object.entries(patterns).forEach(([type, pattern]) => {
    const matches = context.match(pattern) || [];
    entities.push(...matches.map(match => ({ type, value: match })));
  });

  return entities;
}

function estimateTokens(text) {
  // Estimación aproximada de tokens (1 token ≈ 4 caracteres para español)
  return Math.ceil(text.length / 4);
}

function calculateTokensSaved(original, compressed) {
  const originalTokens = original.reduce((sum, msg) => sum + estimateTokens(msg.content), 0);
  const compressedTokens = compressed.reduce((sum, msg) => sum + estimateTokens(msg.content), 0);
  return originalTokens - compressedTokens;
}

// ALMACENAR RESUMEN EN BD
async function storeConversationSummary(conversationId, summaryData) {
  try {
    await supabase
      .from('conversation_summaries')
      .upsert({
        conversation_id: conversationId,
        summary_data: summaryData,
        updated_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error storing summary:', error);
  }
}
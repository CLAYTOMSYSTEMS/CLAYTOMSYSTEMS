// ARSENAL R) RE-RANKING MULTI-OBJETIVO - A/B TESTING FRAMEWORK
// ¡¡¡OPTIMIZACIÓN BRUTAL PARA DOMINAR CONVERSIONES!!!

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
      case 'RERANK_RESULTS':
        return await rerankResults(data, headers);

      case 'CREATE_AB_TEST':
        return await createABTest(data, headers);

      case 'GET_AB_CONFIG':
        return await getABConfig(data, headers);

      case 'UPDATE_METRICS':
        return await updateMetrics(data, headers);

      case 'OPTIMIZE_WEIGHTS':
        return await optimizeWeights(data, headers);

      case 'GET_PERFORMANCE':
        return await getPerformanceMetrics(data, headers);

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Acción no válida' })
        };
    }
  } catch (error) {
    console.error('Reranking Engine Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error en motor de re-ranking',
        details: error.message
      })
    };
  }
};

// RE-RANKING INTELIGENTE CON MÚLTIPLES OBJETIVOS
async function rerankResults(data, headers) {
  const {
    initialResults,
    userContext,
    objectives = ['relevance', 'conversion', 'engagement'],
    abTestId = null
  } = data;

  try {
    // Obtener configuración A/B activa
    const abConfig = abTestId
      ? await getActiveABConfig(abTestId)
      : await getDefaultConfig();

    // Calcular scores para cada objetivo
    const scoredResults = await calculateMultiObjectiveScores(
      initialResults,
      userContext,
      objectives,
      abConfig
    );

    // Aplicar pesos adaptativos
    const rerankedResults = await applyAdaptiveWeights(
      scoredResults,
      abConfig,
      userContext
    );

    // Registrar métricas
    await logRerankingMetrics({
      userId: userContext.userId,
      abTestId,
      originalOrder: initialResults.map(r => r.id),
      rerankedOrder: rerankedResults.map(r => r.id),
      objectives,
      weights: abConfig.weights
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        results: rerankedResults,
        metadata: {
          abTestId,
          objectives,
          weights: abConfig.weights,
          total_results: rerankedResults.length
        }
      })
    };
  } catch (error) {
    throw new Error(`Error en re-ranking: ${error.message}`);
  }
}

// CALCULAR SCORES MULTI-OBJETIVO
async function calculateMultiObjectiveScores(results, userContext, objectives, config) {
  return results.map(result => {
    const scores = {};

    // RELEVANCE SCORE - Basado en similitud vectorial
    scores.relevance = result.similarity_score || 0.5;

    // CONVERSION SCORE - Basado en historial de conversiones
    scores.conversion = calculateConversionScore(result, userContext, config);

    // ENGAGEMENT SCORE - Basado en interacciones previas
    scores.engagement = calculateEngagementScore(result, userContext, config);

    // PRICE OPTIMIZATION - Optimización de precios
    scores.price_optimization = calculatePriceScore(result, userContext, config);

    // AVAILABILITY SCORE - Disponibilidad y urgencia
    scores.availability = calculateAvailabilityScore(result, userContext, config);

    // PERSONALIZATION SCORE - Personalización usuario
    scores.personalization = calculatePersonalizationScore(result, userContext, config);

    return {
      ...result,
      objective_scores: scores,
      total_score: 0 // Se calculará con pesos
    };
  });
}

// CONVERSION SCORE - Predicción de conversión
function calculateConversionScore(result, userContext, config) {
  let score = 0.5; // Base score

  // Factores de conversión
  const factors = {
    price_range: getPriceRangeScore(result.price, userContext.budget),
    location_preference: getLocationScore(result.location, userContext.preferences),
    amenities_match: getAmenitiesScore(result.amenities, userContext.needs),
    reviews_score: result.rating / 5.0,
    booking_urgency: getUrgencyScore(userContext.dates),
    seasonal_factor: getSeasonalFactor(userContext.dates, result.location)
  };

  // Combinar factores con pesos
  const weights = config.conversion_weights || {
    price_range: 0.25,
    location_preference: 0.20,
    amenities_match: 0.20,
    reviews_score: 0.15,
    booking_urgency: 0.10,
    seasonal_factor: 0.10
  };

  score = Object.entries(factors).reduce((total, [factor, value]) => {
    return total + (value * weights[factor]);
  }, 0);

  return Math.max(0, Math.min(1, score));
}

// ENGAGEMENT SCORE - Predicción de engagement
function calculateEngagementScore(result, userContext, config) {
  let score = 0.5;

  const engagementFactors = {
    photo_quality: result.photos?.length > 5 ? 0.8 : 0.4,
    description_length: result.description?.length > 200 ? 0.7 : 0.3,
    instant_book: result.instant_book ? 0.8 : 0.5,
    response_rate: result.host_response_rate || 0.5,
    recent_reviews: result.recent_reviews_count || 0,
    superhost: result.is_superhost ? 0.9 : 0.5
  };

  const weights = config.engagement_weights || {
    photo_quality: 0.20,
    description_length: 0.15,
    instant_book: 0.15,
    response_rate: 0.20,
    recent_reviews: 0.15,
    superhost: 0.15
  };

  score = Object.entries(engagementFactors).reduce((total, [factor, value]) => {
    return total + (value * weights[factor]);
  }, 0);

  return Math.max(0, Math.min(1, score));
}

// PRICE SCORE - Optimización precio/valor
function calculatePriceScore(result, userContext, config) {
  const userBudget = userContext.budget || 100;
  const price = result.price || 50;

  // Sweet spot pricing
  const budgetRatio = price / userBudget;
  let score = 0.5;

  if (budgetRatio <= 0.8) {
    score = 0.9; // Dentro del presupuesto
  } else if (budgetRatio <= 1.0) {
    score = 0.7; // En el límite
  } else if (budgetRatio <= 1.2) {
    score = 0.4; // Ligeramente sobre
  } else {
    score = 0.1; // Muy caro
  }

  // Ajustar por valor percibido
  const valueRatio = (result.rating || 3) / 5.0;
  score = score * (0.7 + 0.3 * valueRatio);

  return Math.max(0, Math.min(1, score));
}

// AVAILABILITY SCORE - Urgencia y disponibilidad
function calculateAvailabilityScore(result, userContext, config) {
  let score = 0.5;

  // Disponibilidad en fechas solicitadas
  if (result.available) {
    score += 0.3;
  }

  // Urgencia por fechas cercanas
  const daysUntilCheckin = getDaysUntilCheckin(userContext.dates?.checkin);
  if (daysUntilCheckin <= 7) {
    score += 0.2; // Reserva de última hora
  }

  // Ocupación baja = mayor disponibilidad
  const occupancyRate = result.occupancy_rate || 0.5;
  score += (1 - occupancyRate) * 0.2;

  return Math.max(0, Math.min(1, score));
}

// PERSONALIZATION SCORE - Personalización usuario
function calculatePersonalizationScore(result, userContext, config) {
  let score = 0.5;

  // Historial de búsquedas similares
  if (userContext.search_history) {
    const similarSearches = userContext.search_history.filter(search =>
      search.location === result.location
    ).length;
    score += Math.min(0.3, similarSearches * 0.1);
  }

  // Preferencias de usuario
  if (userContext.preferences) {
    const prefs = userContext.preferences;
    if (prefs.property_type && result.property_type === prefs.property_type) {
      score += 0.2;
    }
    if (prefs.amenities) {
      const matchingAmenities = prefs.amenities.filter(amenity =>
        result.amenities?.includes(amenity)
      ).length;
      score += (matchingAmenities / prefs.amenities.length) * 0.2;
    }
  }

  return Math.max(0, Math.min(1, score));
}

// APLICAR PESOS ADAPTATIVOS
async function applyAdaptiveWeights(scoredResults, config, userContext) {
  const weights = config.weights || {
    relevance: 0.25,
    conversion: 0.25,
    engagement: 0.20,
    price_optimization: 0.15,
    availability: 0.10,
    personalization: 0.05
  };

  // Calcular score total para cada resultado
  const resultsWithTotal = scoredResults.map(result => {
    const totalScore = Object.entries(weights).reduce((total, [objective, weight]) => {
      const score = result.objective_scores[objective] || 0;
      return total + (score * weight);
    }, 0);

    return {
      ...result,
      total_score: totalScore,
      weight_distribution: weights
    };
  });

  // Ordenar por score total
  return resultsWithTotal.sort((a, b) => b.total_score - a.total_score);
}

// CREAR PRUEBA A/B
async function createABTest(data, headers) {
  const { name, configA, configB, split = 50, duration = 7 } = data;

  try {
    const abTest = {
      id: `ab_${Date.now()}`,
      name,
      config_a: configA,
      config_b: configB,
      split_percentage: split,
      duration_days: duration,
      is_active: true,
      success_metrics: {},
      created_at: new Date().toISOString()
    };

    const { data: result, error } = await supabase
      .from('ab_test_configs')
      .insert([abTest]);

    if (error) throw error;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        abTest: abTest
      })
    };
  } catch (error) {
    throw new Error(`Error creando A/B test: ${error.message}`);
  }
}

// OBTENER CONFIGURACIÓN A/B ACTIVA
async function getActiveABConfig(abTestId) {
  const { data, error } = await supabase
    .from('ab_test_configs')
    .select('*')
    .eq('id', abTestId)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return getDefaultConfig();
  }

  // Decidir si usar config A o B basado en usuario
  const useConfigA = Math.random() < (data.split_percentage / 100);
  return useConfigA ? data.config_a : data.config_b;
}

// CONFIGURACIÓN POR DEFECTO
async function getDefaultConfig() {
  return {
    weights: {
      relevance: 0.25,
      conversion: 0.25,
      engagement: 0.20,
      price_optimization: 0.15,
      availability: 0.10,
      personalization: 0.05
    },
    conversion_weights: {
      price_range: 0.25,
      location_preference: 0.20,
      amenities_match: 0.20,
      reviews_score: 0.15,
      booking_urgency: 0.10,
      seasonal_factor: 0.10
    },
    engagement_weights: {
      photo_quality: 0.20,
      description_length: 0.15,
      instant_book: 0.15,
      response_rate: 0.20,
      recent_reviews: 0.15,
      superhost: 0.15
    }
  };
}

// FUNCIONES AUXILIARES
function getPriceRangeScore(price, budget) {
  if (!budget) return 0.5;
  const ratio = price / budget;
  return Math.max(0, Math.min(1, 1.2 - ratio));
}

function getLocationScore(location, preferences) {
  if (!preferences?.preferred_locations) return 0.5;
  return preferences.preferred_locations.includes(location) ? 0.9 : 0.3;
}

function getAmenitiesScore(amenities, needs) {
  if (!needs?.required_amenities || !amenities) return 0.5;
  const matches = needs.required_amenities.filter(need =>
    amenities.includes(need)
  ).length;
  return matches / needs.required_amenities.length;
}

function getUrgencyScore(dates) {
  if (!dates?.checkin) return 0.5;
  const daysUntil = getDaysUntilCheckin(dates.checkin);
  return daysUntil <= 3 ? 0.9 : daysUntil <= 7 ? 0.7 : 0.5;
}

function getSeasonalFactor(dates, location) {
  // Implementar lógica estacional según ubicación
  return 0.5;
}

function getDaysUntilCheckin(checkinDate) {
  if (!checkinDate) return 30;
  const checkin = new Date(checkinDate);
  const now = new Date();
  return Math.ceil((checkin - now) / (1000 * 60 * 60 * 24));
}

// REGISTRAR MÉTRICAS DE RE-RANKING
async function logRerankingMetrics(data) {
  try {
    const metric = {
      id: `metric_${Date.now()}`,
      metric_type: 'reranking',
      value: data,
      timestamp: new Date().toISOString(),
      context: {
        source: 'guestsvalencia',
        version: '1.0'
      }
    };

    await supabase
      .from('performance_metrics')
      .insert([metric]);
  } catch (error) {
    console.error('Error logging metrics:', error);
  }
}
// ARSENAL Q) ALMACÉN VECTORES PERSISTENTE - SUPABASE + PGVECTOR
// ¡¡¡SISTEMA BRUTAL PARA DOMINAR SECTOR INMOBILIARIO!!!

import { createClient } from '@supabase/supabase-js';

// Configuración Supabase con pgvector
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler = async (event, context) => {
  // CORS headers para integración web
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { action, data } = JSON.parse(event.body || '{}');

    switch (action) {
      case 'STORE_VECTORS':
        return await storeVectors(data, headers);

      case 'SEARCH_VECTORS':
        return await searchVectors(data, headers);

      case 'UPDATE_VECTORS':
        return await updateVectors(data, headers);

      case 'DELETE_VECTORS':
        return await deleteVectors(data, headers);

      case 'GET_CLUSTERS':
        return await getClusters(data, headers);

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Acción no válida' })
        };
    }
  } catch (error) {
    console.error('Vector Store Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error en almacén vectorial',
        details: error.message
      })
    };
  }
};

// ALMACENAR VECTORES CON METADATOS ENRIQUECIDOS
async function storeVectors(data, headers) {
  const { vectors, metadata, clusterId } = data;

  try {
    // Crear tabla vectores si no existe
    await supabase.rpc('create_vector_table_if_not_exists');

    // Insertar vectores con embeddings
    const vectorData = vectors.map((vector, index) => ({
      id: `vec_${Date.now()}_${index}`,
      embedding: vector,
      metadata: {
        ...metadata[index],
        clusterId,
        timestamp: new Date().toISOString(),
        source: 'guestsvalencia'
      },
      content: metadata[index]?.content || '',
      category: metadata[index]?.category || 'property',
      similarity_score: 0
    }));

    const { data: result, error } = await supabase
      .from('property_vectors')
      .insert(vectorData);

    if (error) throw error;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        stored: vectorData.length,
        ids: vectorData.map(v => v.id)
      })
    };
  } catch (error) {
    throw new Error(`Error almacenando vectores: ${error.message}`);
  }
}

// BÚSQUEDA VECTORIAL CON SIMILARITY SEARCH
async function searchVectors(data, headers) {
  const {
    queryVector,
    limit = 10,
    threshold = 0.8,
    filters = {},
    includeMetadata = true
  } = data;

  try {
    // Búsqueda por similitud coseno usando pgvector
    const { data: results, error } = await supabase.rpc('search_similar_vectors', {
      query_embedding: queryVector,
      match_threshold: threshold,
      match_count: limit,
      filter_metadata: filters
    });

    if (error) throw error;

    // Enriquecer resultados con contexto
    const enrichedResults = results.map(result => ({
      ...result,
      similarity_score: result.similarity,
      context: {
        category: result.metadata?.category,
        clusterId: result.metadata?.clusterId,
        timestamp: result.metadata?.timestamp
      }
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        results: enrichedResults,
        total: results.length,
        query_info: {
          threshold,
          limit,
          filters
        }
      })
    };
  } catch (error) {
    throw new Error(`Error en búsqueda vectorial: ${error.message}`);
  }
}

// ACTUALIZAR VECTORES Y METADATOS
async function updateVectors(data, headers) {
  const { vectorIds, updates } = data;

  try {
    const { data: result, error } = await supabase
      .from('property_vectors')
      .update({
        metadata: updates.metadata,
        content: updates.content,
        updated_at: new Date().toISOString()
      })
      .in('id', vectorIds);

    if (error) throw error;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        updated: vectorIds.length
      })
    };
  } catch (error) {
    throw new Error(`Error actualizando vectores: ${error.message}`);
  }
}

// ELIMINAR VECTORES
async function deleteVectors(data, headers) {
  const { vectorIds, clusterId } = data;

  try {
    let query = supabase.from('property_vectors').delete();

    if (vectorIds) {
      query = query.in('id', vectorIds);
    } else if (clusterId) {
      query = query.eq('metadata->>clusterId', clusterId);
    }

    const { error } = await query;
    if (error) throw error;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        deleted: vectorIds?.length || 'cluster'
      })
    };
  } catch (error) {
    throw new Error(`Error eliminando vectores: ${error.message}`);
  }
}

// OBTENER CLUSTERS Y ESTADÍSTICAS
async function getClusters(data, headers) {
  try {
    // Obtener clusters únicos con estadísticas
    const { data: clusters, error } = await supabase.rpc('get_cluster_stats');

    if (error) throw error;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        clusters,
        total_clusters: clusters.length,
        total_vectors: clusters.reduce((sum, c) => sum + c.vector_count, 0)
      })
    };
  } catch (error) {
    throw new Error(`Error obteniendo clusters: ${error.message}`);
  }
}
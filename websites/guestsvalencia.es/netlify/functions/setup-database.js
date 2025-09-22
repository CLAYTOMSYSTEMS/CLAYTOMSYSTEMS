// ARSENAL Q) SCRIPTS SQL AUTOMÁTICOS - SETUP COMPLETO SUPABASE
// ¡¡¡DOMINANDO LA BASE DE DATOS VECTORIAL!!!

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Clave admin
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { action } = JSON.parse(event.body || '{}');

    switch (action) {
      case 'SETUP_TABLES':
        return await setupTables(headers);

      case 'CREATE_INDEXES':
        return await createIndexes(headers);

      case 'SETUP_RPC_FUNCTIONS':
        return await setupRPCFunctions(headers);

      case 'MIGRATE_DATA':
        return await migrateExistingData(headers);

      case 'FULL_SETUP':
        return await fullDatabaseSetup(headers);

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Acción no válida' })
        };
    }
  } catch (error) {
    console.error('Database Setup Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error en setup de base de datos',
        details: error.message
      })
    };
  }
};

// SETUP COMPLETO DE TABLAS
async function setupTables(headers) {
  try {
    // Habilitar extensión pgvector
    await supabase.rpc('enable_pgvector_extension');

    // Crear tabla principal de vectores
    const createVectorTable = `
      CREATE TABLE IF NOT EXISTS property_vectors (
        id TEXT PRIMARY KEY,
        embedding VECTOR(1536), -- OpenAI embeddings size
        metadata JSONB NOT NULL DEFAULT '{}',
        content TEXT,
        category TEXT DEFAULT 'property',
        similarity_score FLOAT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Crear tabla de clusters
    const createClustersTable = `
      CREATE TABLE IF NOT EXISTS vector_clusters (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        centroid VECTOR(1536),
        metadata JSONB DEFAULT '{}',
        vector_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Crear tabla de configuraciones A/B
    const createABTestTable = `
      CREATE TABLE IF NOT EXISTS ab_test_configs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        config JSONB NOT NULL,
        is_active BOOLEAN DEFAULT false,
        success_metrics JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Crear tabla de métricas
    const createMetricsTable = `
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id TEXT PRIMARY KEY,
        metric_type TEXT NOT NULL,
        value JSONB NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        context JSONB DEFAULT '{}'
      );
    `;

    await supabase.rpc('execute_sql', { sql: createVectorTable });
    await supabase.rpc('execute_sql', { sql: createClustersTable });
    await supabase.rpc('execute_sql', { sql: createABTestTable });
    await supabase.rpc('execute_sql', { sql: createMetricsTable });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Tablas creadas exitosamente',
        tables: [
          'property_vectors',
          'vector_clusters',
          'ab_test_configs',
          'performance_metrics'
        ]
      })
    };
  } catch (error) {
    throw new Error(`Error creando tablas: ${error.message}`);
  }
}

// CREAR ÍNDICES OPTIMIZADOS
async function createIndexes(headers) {
  try {
    const indexes = [
      // Índice vectorial HNSW para búsquedas rápidas
      `CREATE INDEX IF NOT EXISTS idx_property_vectors_embedding_hnsw
       ON property_vectors USING hnsw (embedding vector_cosine_ops);`,

      // Índices JSONB para metadata
      `CREATE INDEX IF NOT EXISTS idx_property_vectors_metadata_gin
       ON property_vectors USING gin (metadata);`,

      // Índice para categorías
      `CREATE INDEX IF NOT EXISTS idx_property_vectors_category
       ON property_vectors (category);`,

      // Índice temporal
      `CREATE INDEX IF NOT EXISTS idx_property_vectors_created_at
       ON property_vectors (created_at DESC);`,

      // Índices para clusters
      `CREATE INDEX IF NOT EXISTS idx_vector_clusters_embedding_hnsw
       ON vector_clusters USING hnsw (centroid vector_cosine_ops);`,

      // Índices para métricas
      `CREATE INDEX IF NOT EXISTS idx_performance_metrics_type_time
       ON performance_metrics (metric_type, timestamp DESC);`
    ];

    for (const indexSQL of indexes) {
      await supabase.rpc('execute_sql', { sql: indexSQL });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Índices creados exitosamente',
        indexes_created: indexes.length
      })
    };
  } catch (error) {
    throw new Error(`Error creando índices: ${error.message}`);
  }
}

// SETUP FUNCIONES RPC
async function setupRPCFunctions(headers) {
  try {
    // Función de búsqueda vectorial similar
    const searchSimilarFunction = `
      CREATE OR REPLACE FUNCTION search_similar_vectors(
        query_embedding VECTOR(1536),
        match_threshold FLOAT DEFAULT 0.8,
        match_count INT DEFAULT 10,
        filter_metadata JSONB DEFAULT '{}'
      )
      RETURNS TABLE (
        id TEXT,
        embedding VECTOR(1536),
        metadata JSONB,
        content TEXT,
        category TEXT,
        similarity FLOAT
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT
          pv.id,
          pv.embedding,
          pv.metadata,
          pv.content,
          pv.category,
          1 - (pv.embedding <=> query_embedding) AS similarity
        FROM property_vectors pv
        WHERE
          (filter_metadata = '{}' OR pv.metadata @> filter_metadata)
          AND 1 - (pv.embedding <=> query_embedding) > match_threshold
        ORDER BY pv.embedding <=> query_embedding
        LIMIT match_count;
      END;
      $$;
    `;

    // Función para estadísticas de clusters
    const clusterStatsFunction = `
      CREATE OR REPLACE FUNCTION get_cluster_stats()
      RETURNS TABLE (
        cluster_id TEXT,
        cluster_name TEXT,
        vector_count BIGINT,
        avg_similarity FLOAT,
        last_updated TIMESTAMP WITH TIME ZONE
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT
          vc.id,
          vc.name,
          vc.vector_count::BIGINT,
          0.0::FLOAT, -- Calcular similarity promedio
          vc.updated_at
        FROM vector_clusters vc
        ORDER BY vc.vector_count DESC;
      END;
      $$;
    `;

    // Función para crear tabla vectores si no existe
    const createTableFunction = `
      CREATE OR REPLACE FUNCTION create_vector_table_if_not_exists()
      RETURNS BOOLEAN
      LANGUAGE plpgsql
      AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS property_vectors (
          id TEXT PRIMARY KEY,
          embedding VECTOR(1536),
          metadata JSONB NOT NULL DEFAULT '{}',
          content TEXT,
          category TEXT DEFAULT 'property',
          similarity_score FLOAT DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RETURN TRUE;
      END;
      $$;
    `;

    await supabase.rpc('execute_sql', { sql: searchSimilarFunction });
    await supabase.rpc('execute_sql', { sql: clusterStatsFunction });
    await supabase.rpc('execute_sql', { sql: createTableFunction });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Funciones RPC creadas exitosamente',
        functions: [
          'search_similar_vectors',
          'get_cluster_stats',
          'create_vector_table_if_not_exists'
        ]
      })
    };
  } catch (error) {
    throw new Error(`Error creando funciones RPC: ${error.message}`);
  }
}

// MIGRAR DATOS EXISTENTES
async function migrateExistingData(headers) {
  try {
    // Leer datos existentes del filesystem o APIs
    // Por ahora solo preparar estructura

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Migración preparada - implementar según datos existentes'
      })
    };
  } catch (error) {
    throw new Error(`Error en migración: ${error.message}`);
  }
}

// SETUP COMPLETO AUTOMÁTICO
async function fullDatabaseSetup(headers) {
  try {
    const steps = [];

    // 1. Setup tablas
    await setupTables(headers);
    steps.push('Tablas creadas');

    // 2. Crear índices
    await createIndexes(headers);
    steps.push('Índices creados');

    // 3. Setup funciones RPC
    await setupRPCFunctions(headers);
    steps.push('Funciones RPC creadas');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Setup completo de base de datos finalizado',
        steps_completed: steps,
        ready_for_production: true
      })
    };
  } catch (error) {
    throw new Error(`Error en setup completo: ${error.message}`);
  }
}
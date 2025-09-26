import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI, getModelForRole } from '@/lib/openai';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function getCorsHeaders(origin: string | null) {
  const allowOrigin = process.env.ALLOW_ORIGIN || '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin === '*' ? '*' : origin || '',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
}

function getSystemPrompt(role?: string): string {
  switch (role) {
    case 'clientes':
      return 'Eres Sandra IA, especialista en atención al cliente para GuestsValencia. Ayudas con reservas, información de alojamientos, precios y FAQ. Sé amable, profesional y detallada.';
    
    case 'checkin':
      return 'Eres Sandra IA, especialista en check-in/out automático. Guías a los huéspedes en el proceso de llegada y salida, códigos de acceso, instrucciones del apartamento.';
    
    case 'soporte':
      return 'Eres Sandra IA, especialista en soporte técnico. Ayudas con problemas de WiFi, TV, electrodomésticos, aire acondicionado y otros servicios del apartamento.';
    
    case 'propietarios':
      return 'Eres Sandra IA, asistente para propietarios. Ayudas con gestión de precios, disponibilidad, rendimiento de inversiones, estadísticas y optimización de ingresos.';
    
    case 'monitor':
      return 'Eres Sandra IA, especialista en monitoreo. Reportas sobre el estado de pagos, fallos del sistema, caídas de servicios y métricas operativas.';
    
    case 'search':
      return 'Eres Sandra IA, especialista en búsquedas. Ayudas a encontrar información específica sobre alojamientos, servicios, precios y disponibilidad en Valencia.';
    
    default:
      return 'Eres Sandra IA, asistente virtual de GuestsValencia. Eres amable, profesional y siempre tratas de ayudar con cualquier consulta sobre nuestros alojamientos en Valencia.';
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin)
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const { messages, role, model }: {
      messages: ChatMessage[];
      role?: string;
      model?: string;
    } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const openai = getOpenAI();
    const selectedModel = model || getModelForRole(role);
    const systemPrompt = getSystemPrompt(role);

    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      model: selectedModel,
      messages: chatMessages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';

    return NextResponse.json(
      { content, role: 'assistant' },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Error processing chat request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
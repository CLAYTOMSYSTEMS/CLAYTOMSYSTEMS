import ChatWidget from '@/components/ChatWidget';

export default function SandraPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {/* Header */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-4 bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-3xl text-white">
              🤖
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Sandra IA Pro+</h1>
              <p className="text-gray-600">Tu asistente virtual inteligente</p>
            </div>
          </div>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Conversa con Sandra IA, nuestro asistente virtual especializado en 5 áreas diferentes. 
            Utiliza voz o texto para una experiencia completamente natural.
          </p>
          
          {/* Avatar placeholder */}
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-primary-200 to-primary-300 rounded-full flex items-center justify-center text-6xl mb-8 shadow-lg">
            👩‍💼
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="h-[700px]">
              <ChatWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 bg-white/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Capacidades de Sandra IA
            </h2>
            <p className="text-xl text-gray-600">
              5 asistentes especializados en diferentes áreas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                👥
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Atención al Cliente</h3>
              <p className="text-gray-600 text-sm">
                Responde preguntas sobre reservas, servicios, precios y disponibilidad. 
                Ayuda con el proceso de reserva y resuelve dudas generales.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                🔑
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Check-in/out</h3>
              <p className="text-gray-600 text-sm">
                Guía automática para la llegada y salida. Proporciona códigos de acceso, 
                instrucciones del apartamento y datos de contacto de emergencia.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                🔧
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Soporte Técnico</h3>
              <p className="text-gray-600 text-sm">
                Resuelve problemas técnicos como WiFi, TV, aire acondicionado, 
                electrodomésticos y otros servicios del apartamento.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                🏠
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Propietarios</h3>
              <p className="text-gray-600 text-sm">
                Asistencia especializada para propietarios: gestión de precios, 
                disponibilidad, estadísticas de ocupación y optimización de ingresos.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                📊
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Monitoreo</h3>
              <p className="text-gray-600 text-sm">
                Supervisión de sistemas: estado de pagos, fallos técnicos, 
                caídas de servicios y métricas operativas en tiempo real.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                🔍
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Búsqueda IA</h3>
              <p className="text-gray-600 text-sm">
                Motor de búsqueda inteligente que encuentra información específica 
                sobre alojamientos, servicios y disponibilidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Features */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Funciones de Voz Avanzadas</h2>
            <p className="text-primary-100 mb-6">
              Sandra IA incluye capacidades de voz natural para una experiencia completamente conversacional
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-2xl mb-3">🎤</div>
                <h3 className="font-semibold mb-2">Speech-to-Text</h3>
                <p className="text-sm text-primary-100">
                  Powered by Deepgram para transcripción precisa en español
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-2xl mb-3">🔊</div>
                <h3 className="font-semibold mb-2">Text-to-Speech</h3>
                <p className="text-sm text-primary-100">
                  Voces naturales con ElevenLabs para respuestas habladas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import Link from 'next/link';
import VideoHero from '@/components/VideoHero';
import SearchIA from '@/components/SearchIA';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <VideoHero />

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Búsqueda Inteligente con Sandra IA
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encuentra exactamente lo que necesitas con nuestro asistente de búsqueda inteligente
            </p>
          </div>
          <SearchIA />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-primary-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Características Avanzadas
            </h2>
            <p className="text-xl text-gray-600">
              Tecnología de vanguardia para una experiencia única
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                🤖
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">5 Chatbots Especializados</h3>
              <p className="text-gray-600 mb-6">
                Asistentes IA especializados para clientes, check-in, soporte, propietarios y monitoreo
              </p>
              <Link href="/sandra" className="text-primary-500 font-medium hover:text-primary-600 transition-colors">
                Probar Sandra IA →
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                📊
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Dashboards Avanzados</h3>
              <p className="text-gray-600 mb-6">
                Paneles de control para administradores y propietarios con métricas en tiempo real
              </p>
              <Link href="/dashboard/admin" className="text-primary-500 font-medium hover:text-primary-600 transition-colors">
                Ver Dashboard →
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                🔊
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Voz Natural</h3>
              <p className="text-gray-600 mb-6">
                Text-to-Speech y Speech-to-Text con ElevenLabs y Deepgram para interacciones naturales
              </p>
              <Link href="/sandra" className="text-primary-500 font-medium hover:text-primary-600 transition-colors">
                Probar Voz IA →
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                🏠
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Alojamientos Premium</h3>
              <p className="text-gray-600 mb-6">
                Apartamentos seleccionados en Valencia con llegada autónoma y servicios premium
              </p>
              <Link href="/alojamientos" className="text-primary-500 font-medium hover:text-primary-600 transition-colors">
                Ver Alojamientos →
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                📱
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">PWA Nativa</h3>
              <p className="text-gray-600 mb-6">
                Aplicación web progresiva que funciona offline y se puede instalar como app nativa
              </p>
              <button className="text-primary-500 font-medium hover:text-primary-600 transition-colors">
                Instalar App →
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                🔐
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Seguridad Avanzada</h3>
              <p className="text-gray-600 mb-6">
                Protección de datos, autenticación segura y cumplimiento GDPR
              </p>
              <span className="text-gray-400 font-medium">
                Próximamente →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para experimentar el futuro?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Únete a la revolución de alojamientos inteligentes con Sandra IA Pro+
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/sandra" 
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Hablar con Sandra IA
            </Link>
            <Link 
              href="/alojamientos" 
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold"
            >
              Ver Alojamientos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
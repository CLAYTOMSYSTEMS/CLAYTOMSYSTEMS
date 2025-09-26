'use client';

import Link from 'next/link';

export default function VideoHero() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Hero content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary-300 to-primary-500 bg-clip-text text-transparent">
          Sandra PWA Pro+
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
          Experiencia premium con 5 chatbots especializados, dashboards avanzados y tecnología de vanguardia
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/sandra" 
            className="btn btn-primary text-lg px-8 py-4 bg-primary-500 hover:bg-primary-600 transform hover:scale-105 transition-all duration-200"
          >
            Hablar con Sandra IA 🤖
          </Link>
          
          <Link 
            href="/alojamientos" 
            className="btn btn-secondary text-lg px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white"
          >
            Ver Alojamientos 🏠
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-2">🤖 5 Chatbots IA</h3>
            <p className="text-sm text-gray-300">Especializados en clientes, check-in, soporte, propietarios y monitoreo</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-2">📊 Dashboards</h3>
            <p className="text-sm text-gray-300">Paneles admin y propietarios con métricas en tiempo real</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-2">🔊 Voz IA</h3>
            <p className="text-sm text-gray-300">TTS y STT con ElevenLabs y Deepgram</p>
          </div>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </section>
  );
}
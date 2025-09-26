import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-6 h-6" />
              GuestsValencia PWA
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Alojamientos premium en Valencia con Sandra IA Pro+ y tecnología avanzada.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                📘 <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                📷 <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                🐦 <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Alojamientos</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/alojamientos" className="hover:text-white transition-colors">Ver todos</Link></li>
              <li><Link href="/alojamientos/1" className="hover:text-white transition-colors">Apartamento Centro</Link></li>
              <li><Link href="/alojamientos/2" className="hover:text-white transition-colors">Estudio Moderno</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Sandra IA</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/sandra" className="hover:text-white transition-colors">Chat con Sandra</Link></li>
              <li><span className="text-slate-500">Asistencia 24/7</span></li>
              <li><span className="text-slate-500">5 Chatbots especializados</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Dashboards</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/dashboard/admin" className="hover:text-white transition-colors">Panel Admin</Link></li>
              <li><Link href="/dashboard/owner" className="hover:text-white transition-colors">Panel Propietarios</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>&copy; 2024 GuestsValencia PWA Pro+. Powered by Sandra IA.</p>
        </div>
      </div>
    </footer>
  );
}
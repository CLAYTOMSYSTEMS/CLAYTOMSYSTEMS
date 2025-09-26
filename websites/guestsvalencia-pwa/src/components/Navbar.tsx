'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-white fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            GuestsValencia PWA
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-primary-300 transition-colors">
            Inicio
          </Link>
          <Link href="/alojamientos" className="hover:text-primary-300 transition-colors">
            Alojamientos
          </Link>
          <Link href="/sandra" className="hover:text-primary-300 transition-colors">
            Sandra IA
          </Link>
          <Link href="/dashboard/admin" className="hover:text-primary-300 transition-colors">
            Admin
          </Link>
          <Link href="/dashboard/owner" className="hover:text-primary-300 transition-colors">
            Propietarios
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-0.5 bg-white mb-1 transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`w-6 h-0.5 bg-white mb-1 transition-opacity ${isOpen ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-0.5 bg-white transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 px-6 py-4 space-y-2">
          <Link href="/" className="block py-2 hover:text-primary-300 transition-colors">
            Inicio
          </Link>
          <Link href="/alojamientos" className="block py-2 hover:text-primary-300 transition-colors">
            Alojamientos
          </Link>
          <Link href="/sandra" className="block py-2 hover:text-primary-300 transition-colors">
            Sandra IA
          </Link>
          <Link href="/dashboard/admin" className="block py-2 hover:text-primary-300 transition-colors">
            Admin
          </Link>
          <Link href="/dashboard/owner" className="block py-2 hover:text-primary-300 transition-colors">
            Propietarios
          </Link>
        </div>
      )}
    </nav>
  );
}
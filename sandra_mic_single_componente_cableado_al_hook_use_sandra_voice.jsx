// SandraMicSingle — componente cableado al hook useSandraVoice
// ---------------------------------------------------------------------------------
// UI de micrófono único (con Avatar) usando el hook multiplataforma `useSandraVoice`.
// Copia este archivo como `components/SandraMicSingle.tsx` y ajusta la import del hook.
// ---------------------------------------------------------------------------------
import React from 'react'
import { useSandraVoice } from '../hooks/useSandraVoice' // <- ajusta la ruta según tu proyecto

export default function SandraMicSingle(){
  const { state, error, level, avatarUrl, toggle } = useSandraVoice()
  const active = state === 'active'
  const busy = state === 'connecting' || state === 'stopping'

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-extrabold text-slate-800">Llamada conversacional</h3>
        <span className={`text-xs font-bold px-2 py-1 rounded ${active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{active ? 'ACTIVA' : 'INACTIVA'}</span>
      </div>

      {/* Avatar */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm mb-4">
        {avatarUrl ? (
          <iframe
            title="HeyGen Avatar"
            src={avatarUrl}
            className="w-full h-64"
            allow="camera; microphone; autoplay; clipboard-read; clipboard-write"
          />
        ) : (
          <div className="h-64 grid place-items-center text-slate-400">Avatar listo</div>
        )}
      </div>

      {/* Mic único */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          disabled={busy}
          className={`relative w-16 h-16 rounded-full grid place-items-center text-white shadow-lg transition-transform ${
            active ? 'bg-gradient-to-br from-sky-500 to-blue-700' : 'bg-gradient-to-br from-slate-500 to-slate-700'
          } ${busy ? 'opacity-60' : 'hover:scale-105'}`}
          aria-label={active ? 'Detener llamada' : 'Iniciar llamada'}
        >
          {busy ? (
            <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" opacity=".25"/><path d="M22 12a10 10 0 0 1-10 10"/></svg>
          ) : (
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          )}
          <span className="absolute -bottom-6 text-xs font-semibold text-slate-600">{active ? 'Detener' : 'Hablar'}</span>
        </button>

        {/* Nivel de voz (RMS) */}
        <div className="flex-1">
          <div className="text-xs text-slate-500 mb-1">Detección de voz (barge‑in auto)</div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-2 bg-sky-500 transition-all" style={{ width: `${Math.min(100, Math.round(level))}%` }} />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 text-sm font-semibold text-red-600">{error}</div>
      )}

      {/* Ayuda rápida para el Dev */}
      <details className="mt-5 text-sm text-slate-600">
        <summary className="cursor-pointer font-semibold">Notas para integración</summary>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Variables: <code>NEXT_PUBLIC_SANDRA_API_URL</code> y <code>NEXT_PUBLIC_REALTIME_API_URL</code> apuntando a tu API.</li>
          <li>El hook envía <code>barge_in_start</code> y <code>barge_in_commit</code> por WS automáticamente (VAD).</li>
          <li>El Avatar se inicia al activar el mic y se cierra al detener.</li>
          <li>Revisa CORS/CSP si el WS no abre: <code>connect-src</code> debe permitir <code>wss://api.guestsvalencia.es</code>.</li>
        </ul>
      </details>
    </div>
  )
}

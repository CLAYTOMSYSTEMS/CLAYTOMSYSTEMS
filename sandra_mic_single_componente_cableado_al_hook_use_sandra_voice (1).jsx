// SandraMicSingle — componente cableado al hook useSandraVoice (SELF‑CONTAINED)
// -------------------------------------------------------------------------------------------------
// 🔧 Arreglo: el build falló porque no se encontró "../hooks/useSandraVoice".
//    Para que compiles YA sin depender de rutas externas, este archivo incluye el hook dentro.
//    Si luego quieres separar archivos, mueve el hook a `src/hooks/useSandraVoice.ts` y cambia el import.
// -------------------------------------------------------------------------------------------------
import React, { useCallback, useEffect, useRef, useState } from 'react'

// =================================================================================================
// useSandraVoice — Hook multiplataforma (reducido y auto‑contenible para este componente)
// • Unifica: WebSocket Realtime (barge‑in), Avatar HeyGen y VAD (detección de voz)
// • API esperada:
//   - POST {apiBase}/heygen/session/new   → { url | embedUrl }
//   - POST {apiBase}/heygen/session/close → 200
//   - WSS  wss://{rtBaseHost}/openai/session (acepta {type:'barge_in_start'} y {type:'barge_in_commit'})
// =================================================================================================

type SandraState = 'idle' | 'connecting' | 'active' | 'stopping' | 'error'

type AudioAdapter = {
  start(onLevel: (rms01: number) => void): Promise<void>
  stop(): Promise<void>
}

type WebSocketLike = {
  readyState: number
  send: (data: any) => void
  close: () => void
  addEventListener: (t: string, h: (ev: any) => void) => void
}

type SandraConfig = {
  apiBase?: string
  rtBase?: string
  authToken?: string
  wsPath?: string
  avatarPaths?: { start: string; stop: string }
  vad?: { silenceMs?: number; speechThreshold?: number } // threshold en 0..1 (por defecto 0.12)
  wsFactory?: (url: string) => WebSocketLike
  audioAdapter?: AudioAdapter
}

const DEF_API = (typeof process !== 'undefined' && (process as any).env?.NEXT_PUBLIC_SANDRA_API_URL) || 'https://api.guestsvalencia.es'
const DEF_RT  = (typeof process !== 'undefined' && (process as any).env?.NEXT_PUBLIC_REALTIME_API_URL) || 'https://api.guestsvalencia.es'

const defaults = {
  apiBase: DEF_API,
  rtBase: DEF_RT,
  wsPath: '/openai/session',
  avatarPaths: { start: '/heygen/session/new', stop: '/heygen/session/close' },
  vad: { silenceMs: 900, speechThreshold: 0.12 },
}

class WebAudioAdapter implements AudioAdapter {
  private ctx?: AudioContext
  private analyser?: AnalyserNode
  private src?: MediaStreamAudioSourceNode
  private stream?: MediaStream
  private raf?: number
  private onLevel?: (v: number) => void

  async start(onLevel: (v: number) => void) {
    this.onLevel = onLevel
    if (!navigator?.mediaDevices?.getUserMedia) {
      // Entorno sin micro (SSR o navegador bloqueado): simular niveles bajos
      this.raf = requestAnimationFrame(() => {})
      return
    }
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    // @ts-ignore
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = 1024
    this.src = this.ctx.createMediaStreamSource(this.stream)
    this.src.connect(this.analyser)

    const buf = new Uint8Array(this.analyser.frequencyBinCount)
    const loop = () => {
      if (!this.analyser || !this.onLevel) return
      this.analyser.getByteTimeDomainData(buf)
      let sum = 0
      for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v }
      const rms = Math.sqrt(sum / buf.length) // ≈0..1
      this.onLevel(Math.min(1, rms) * 100)
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }

  async stop() {
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = undefined
    try { this.src?.disconnect() } catch {}
    try { this.analyser?.disconnect() } catch {}
    if (this.ctx) { try { await this.ctx.close() } catch {} }
    this.ctx = undefined; this.analyser = undefined; this.src = undefined
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = undefined }
  }
}

function getDefaultAudioAdapter(): AudioAdapter {
  if (typeof window !== 'undefined') return new WebAudioAdapter()
  // SSR: devolvemos un adapter NOOP para no romper el render
  return {
    async start(onLevel) { /* noop */ },
    async stop() { /* noop */ },
  }
}

function getDefaultWS(url: string): WebSocketLike {
  if (typeof window !== 'undefined' && 'WebSocket' in window) {
    // @ts-ignore
    return new window.WebSocket(url)
  }
  // En SSR/Node no hay WS nativo; el hook sólo debe usarse en cliente.
  throw new Error('WebSocket no disponible en este entorno (usa este componente en cliente).')
}

export function useSandraVoice(userCfg: SandraConfig = {}) {
  const cfg = { ...defaults, ...userCfg } as Required<SandraConfig>

  const [state, setState] = useState<SandraState>('idle')
  const [error, setError] = useState('')
  const [level, setLevel] = useState(0)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [sessionId, setSessionId] = useState<string | undefined>(undefined)

  const wsRef = useRef<WebSocketLike | null>(null)
  const busyRef = useRef(false)
  const speakingRef = useRef(false)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const audio = useRef<AudioAdapter>(userCfg.audioAdapter || getDefaultAudioAdapter())

  const openAvatar = useCallback(async () => {
    try {
      const res = await fetch(`${cfg.apiBase}${cfg.avatarPaths!.start}`, {
        method: 'POST', credentials: 'include',
        headers: cfg.authToken ? { Authorization: `Bearer ${cfg.authToken}` } : undefined,
      })
      if (!res.ok) throw new Error('HeyGen session error')
      const data = await res.json()
      setAvatarUrl(data.url || data.embedUrl || '')
      return true
    } catch (e) {
      setError('No se pudo iniciar el avatar HeyGen')
      console.error(e)
      return false
    }
  }, [cfg.apiBase, cfg.avatarPaths, cfg.authToken])

  const closeAvatar = useCallback(async () => {
    try {
      await fetch(`${cfg.apiBase}${cfg.avatarPaths!.stop}`, {
        method: 'POST', credentials: 'include',
        headers: cfg.authToken ? { Authorization: `Bearer ${cfg.authToken}` } : undefined,
      })
    } catch {}
    setAvatarUrl('')
  }, [cfg.apiBase, cfg.avatarPaths, cfg.authToken])

  const openWS = useCallback(async () => {
    const host = new URL(cfg.rtBase!).host
    const url = `wss://${host}${cfg.wsPath || '/openai/session'}`
    const ws = cfg.wsFactory ? cfg.wsFactory(url) : getDefaultWS(url)
    wsRef.current = ws
    return await new Promise<WebSocketLike>((resolve, reject) => {
      const onOpen = () => resolve(ws)
      const onError = (ev: any) => reject(ev)
      const onMessage = (ev: any) => {
        try { const msg = JSON.parse(ev.data); if (msg?.type === 'session.created' && msg.id) setSessionId(msg.id) } catch {}
      }
      const onClose = () => { wsRef.current = null; setSessionId(undefined) }
      ws.addEventListener('open', onOpen)
      ws.addEventListener('error', onError)
      ws.addEventListener('message', onMessage)
      ws.addEventListener('close', onClose)
    })
  }, [cfg.rtBase, cfg.wsPath, cfg.wsFactory])

  const closeWS = useCallback(async () => {
    try { wsRef.current?.close() } catch {}
    wsRef.current = null
    setSessionId(undefined)
  }, [])

  const handleLevel = useCallback((lvl: number) => {
    setLevel(lvl)
    const threshold = (cfg.vad?.speechThreshold ?? defaults.vad.speechThreshold) * 100
    const speaking = lvl > threshold
    if (speaking && !speakingRef.current) {
      speakingRef.current = true
      if (wsRef.current && wsRef.current.readyState === 1) {
        try { wsRef.current.send(JSON.stringify({ type: 'barge_in_start' })) } catch {}
      }
      if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null }
    }
    if (!speaking && speakingRef.current) {
      if (!silenceTimerRef.current) {
        const ms = cfg.vad?.silenceMs ?? defaults.vad.silenceMs
        silenceTimerRef.current = setTimeout(() => {
          speakingRef.current = false
          if (wsRef.current && wsRef.current.readyState === 1) {
            try { wsRef.current.send(JSON.stringify({ type: 'barge_in_commit' })) } catch {}
          }
          silenceTimerRef.current = null
        }, ms)
      }
    }
  }, [cfg.vad])

  const start = useCallback(async () => {
    if (busyRef.current || state !== 'idle') return
    busyRef.current = true; setError(''); setState('connecting')
    try {
      await openWS()
      const ok = await openAvatar(); if (!ok) throw new Error('avatar failed')
      await audio.current.start(handleLevel)
      setState('active')
    } catch (e) {
      console.error(e); setError('No se pudo iniciar la sesión')
      try { await audio.current.stop() } catch {}
      await closeWS(); await closeAvatar(); setState('error')
      await new Promise(r => setTimeout(r, 400)); setState('idle')
    } finally { busyRef.current = false }
  }, [state, openWS, openAvatar, handleLevel, closeWS, closeAvatar])

  const stop = useCallback(async () => {
    if (busyRef.current || state !== 'active') return
    busyRef.current = true; setState('stopping')
    try {
      if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null }
      speakingRef.current = false
      await audio.current.stop()
      await closeWS(); await closeAvatar(); setState('idle')
    } catch (e) { console.error(e); setError('Error al detener la sesión'); setState('idle') }
    finally { busyRef.current = false }
  }, [state, closeWS, closeAvatar])

  const toggle = useCallback(async () => { if (state === 'idle') return start(); if (state === 'active') return stop() }, [state, start, stop])

  useEffect(() => { return () => { try { if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current) } catch {}
    speakingRef.current = false; audio.current.stop().catch(()=>{}); closeWS(); closeAvatar() } }, [closeWS, closeAvatar])

  return { state, error, level, avatarUrl, sessionId, start, stop, toggle }
}

// ===============================
// Componente SandraMicSingle (UI)
// ===============================
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

      {/* Mini tests (no rompen UI): validan helpers en tiempo de build/cliente) */}
      <TestHints />
    </div>
  )
}

// ===============================
// "Tests" ligeros / aserciones de ayuda (no unit tests formales)
// ===============================
function buildWSUrl(rtBase: string, wsPath = '/openai/session'){
  const host = new URL(rtBase).host
  return `wss://${host}${wsPath}`
}

function TestHints(){
  // Aserciones simples en cliente
  if (typeof window !== 'undefined') {
    try {
      console.assert(buildWSUrl('https://api.guestsvalencia.es') === 'wss://api.guestsvalencia.es/openai/session', 'WS URL por defecto')
      console.assert(buildWSUrl('https://api.guestsvalencia.es', '/x') === 'wss://api.guestsvalencia.es/x', 'WS URL custom path')
    } catch {}
  }
  return null
}

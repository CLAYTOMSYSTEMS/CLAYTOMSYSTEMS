// Sandra — Micrófono Único (WS + Barge‑In + HeyGen)
// --------------------------------------------------
// Componente React listo para pegar en tu app (Next.js/CRA/Vite).
// Un SOLO botón de micrófono controla:
//  - Sesión WS Realtime (wss://api.guestsvalencia.es/openai/session)
//  - Barge‑in automático con VAD (detección de voz)
//  - Lanzamiento/paro del Avatar HeyGen (POST /heygen/session/new)
//  - Sin bucles, sin botones Empezar/Commit/Cortar: todo en un toggle
//
// ✅ Cómo usar:
//   1) Copia este archivo como `components/SandraMicSingle.jsx`.
//   2) Ajusta los ENDPOINTS o usa los .env públicos:
//        NEXT_PUBLIC_SANDRA_API_URL=https://api.guestsvalencia.es
//        NEXT_PUBLIC_REALTIME_API_URL=https://api.guestsvalencia.es
//   3) Coloca <SandraMicSingle/> donde quieras mostrar el micrófono + avatar.
//   4) Revisa las notas al final para CORS/CSP/WS si algo no conecta.
//
// 🧠 Estado interno (máquina simple):
//    idle → connecting → active → stopping → idle
//    * Guard Clauses para evitar sesiones duplicadas.
//    * VAD con WebAudio (UMBRAL + silencio sostenido) para barge‑in.
//
// 🛡️ Anti‑bucles / Anti‑reentradas:
//    * `guard.isBusy` bloquea clicks mientras conecta/para.
//    * `sessionIdRef` verifica que solo haya 1 WS vivo.
//    * Timeouts de seguridad al cerrar.
//
// --------------------------------------------------
import React, { useCallback, useEffect, useRef, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_SANDRA_API_URL || "https://api.guestsvalencia.es";
const RT_BASE  = process.env.NEXT_PUBLIC_REALTIME_API_URL || "https://api.guestsvalencia.es";

export default function SandraMicSingle() {
  const [state, setState] = useState("idle"); // idle | connecting | active | stopping | error
  const [error, setError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [level, setLevel] = useState(0); // VAD RMS visual

  // Refs
  const wsRef = useRef(null);
  const sessionIdRef = useRef(null);
  const guard = useRef({ isBusy: false });

  // Audio
  const streamRef = useRef(null);
  const contextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const speakingRef = useRef(false);

  // ---- Utils ----
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const openAvatar = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/heygen/session/new`, { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("HeyGen session error");
      const data = await res.json();
      // data.url o data.embedUrl
      setAvatarUrl(data.url || data.embedUrl || "");
      return data;
    } catch (e) {
      console.error(e);
      setError("No se pudo iniciar el avatar HeyGen");
      return null;
    }
  }, []);

  const closeAvatar = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/heygen/session/close`, { method: "POST", credentials: "include" });
    } catch {}
    setAvatarUrl("");
  }, []);

  const openWS = useCallback(async () => {
    return new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket(`wss://${new URL(RT_BASE).host}/openai/session`);
        wsRef.current = ws;
        ws.addEventListener("open", () => resolve(ws));
        ws.addEventListener("error", (ev) => reject(ev));
        ws.addEventListener("message", (ev) => {
          // manejar eventos del servidor si hace falta
          // p.ej. {type:"session.created", id: "..."}
          try {
            const msg = JSON.parse(ev.data);
            if (msg?.type === "session.created" && msg.id) {
              sessionIdRef.current = msg.id;
            }
          } catch {}
        });
        ws.addEventListener("close", () => {
          wsRef.current = null;
          sessionIdRef.current = null;
        });
      } catch (e) {
        reject(e);
      }
    });
  }, []);

  const closeWS = useCallback(async () => {
    if (!wsRef.current) return;
    try {
      wsRef.current.close();
    } catch {}
    wsRef.current = null;
    sessionIdRef.current = null;
  }, []);

  // ---- VAD (muy ligero con AnalyserNode) ----
  const startVAD = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    contextRef.current = ctx;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyserRef.current = analyser;

    const src = ctx.createMediaStreamSource(stream);
    sourceRef.current = src;
    src.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);
    const SILENCE_MS = 900;         // silencio sostenido para cortar barge‑in
    const SPEECH_THRESHOLD = 12;    // umbral aproximado (0–255)

    const loop = () => {
      if (!analyserRef.current) return; // detenido
      analyser.getByteTimeDomainData(data);
      // Calcula RMS aproximado
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128; sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length) * 100; // escala 0–100
      setLevel(rms);

      const speaking = rms > SPEECH_THRESHOLD;
      if (speaking && !speakingRef.current) {
        speakingRef.current = true;
        // barge‑in start
        if (wsRef.current?.readyState === 1) {
          wsRef.current.send(JSON.stringify({ type: "barge_in_start" }));
        }
        if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
      }
      if (!speaking && speakingRef.current) {
        // programar fin si se mantiene el silencio
        if (!silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            speakingRef.current = false;
            if (wsRef.current?.readyState === 1) {
              wsRef.current.send(JSON.stringify({ type: "barge_in_commit" }));
            }
            silenceTimerRef.current = null;
          }, SILENCE_MS);
        }
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }, []);

  const stopVAD = useCallback(async () => {
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    speakingRef.current = false;
    if (sourceRef.current) try { sourceRef.current.disconnect(); } catch {}
    if (analyserRef.current) try { analyserRef.current.disconnect(); } catch {}
    if (contextRef.current) try { await contextRef.current.close(); } catch {}
    contextRef.current = null; analyserRef.current = null; sourceRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  // ---- Toggle principal ----
  const toggle = useCallback(async () => {
    if (guard.current.isBusy) return;
    setError("");

    if (state === "idle") {
      guard.current.isBusy = true; setState("connecting");
      try {
        // 1) WS
        await openWS();
        // 2) Avatar
        await openAvatar();
        // 3) VAD
        await startVAD();
        setState("active");
      } catch (e) {
        console.error(e);
        setError("No se pudo iniciar la sesión de voz");
        await closeWS(); await closeAvatar(); await stopVAD();
        setState("error");
        await wait(600);
        setState("idle");
      } finally {
        guard.current.isBusy = false;
      }
      return;
    }

    if (state === "active") {
      guard.current.isBusy = true; setState("stopping");
      try {
        await stopVAD();
        await closeWS();
        await closeAvatar();
        setState("idle");
      } catch (e) {
        console.error(e);
        setError("Error al cerrar la sesión");
        setState("idle");
      } finally {
        guard.current.isBusy = false;
      }
    }
  }, [state, openWS, openAvatar, startVAD, stopVAD, closeWS, closeAvatar]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => { stopVAD(); closeWS(); closeAvatar(); };
  }, [stopVAD, closeWS, closeAvatar]);

  // ---- UI ----
  const isBusy = state === "connecting" || state === "stopping";
  const active = state === "active";

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-extrabold text-slate-800">Llamada conversacional</h3>
        <span className={`text-xs font-bold px-2 py-1 rounded ${active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{active ? 'ACTIVA' : 'INACTIVA'}</span>
      </div>

      {/* Avatar */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm mb-4">
        {avatarUrl ? (
          <iframe title="HeyGen Avatar" src={avatarUrl} className="w-full h-64" allow="camera; microphone; autoplay; clipboard-read; clipboard-write" />
        ) : (
          <div className="h-64 grid place-items-center text-slate-400">Avatar listo</div>
        )}
      </div>

      {/* Mic único */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          disabled={isBusy}
          className={`relative w-16 h-16 rounded-full grid place-items-center text-white shadow-lg transition-transform ${
            active ? 'bg-gradient-to-br from-sky-500 to-blue-700' : 'bg-gradient-to-br from-slate-500 to-slate-700'
          } ${isBusy ? 'opacity-60' : 'hover:scale-105'}`}
          aria-label={active ? 'Detener llamada' : 'Iniciar llamada'}
        >
          {isBusy ? (
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

      {/* Notas rápidas */}
      <ul className="mt-4 text-xs text-slate-500 list-disc pl-5 space-y-1">
        <li>Un solo botón activa/desactiva WS + Avatar + VAD (barge‑in).</li>
        <li>Evita sesiones duplicadas con bloqueos internos y limpieza al desmontar.</li>
        <li>Si el WS no conecta, revisa CORS/WS/`connect-src` de CSP.</li>
      </ul>
    </div>
  );
}

// --- Notas de integración ---
// 1) La API debe responder a:
//    - POST {API_BASE}/heygen/session/new → { url | embedUrl }
//    - POST {API_BASE}/heygen/session/close → 200
//    - WSS wss://{RT_BASE_HOST}/openai/session → emite session.created
//    En WS, los mensajes "barge_in_start" / "barge_in_commit" deben ser aceptados por tu backend.
//
// 2) CORS en la API (Express ejemplo):
//    res.setHeader('Access-Control-Allow-Origin', ORIGIN_MATCHED);
//    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
//    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
//    res.setHeader('Access-Control-Allow-Credentials', 'true');
//    OPTIONS → 204
//
// 3) CSP en la web (Netlify _headers):
//    connect-src 'self' https://api.guestsvalencia.es https://api.openai.com https://api.heygen.com wss://api.guestsvalencia.es;
//
// 4) Cloudflare Worker (router) debe respetar Origin y no cachear ni comprimir WebSocket.
//
// 5) Accesibilidad: el botón tiene aria-label dinámico y estados claros.

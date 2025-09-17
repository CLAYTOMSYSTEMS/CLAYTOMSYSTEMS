// Inicialización del sitio (opener, status, TTS tests)
(function(){
  // Opener 3s (opt-in)
  const playBtn = document.getElementById('play-opener');
  const audio = document.getElementById('opener-audio');
  if (playBtn && audio) {
    playBtn.addEventListener('click', () => { audio.currentTime = 0; audio.play().catch(()=>{}); });
  }

  // Status loader
  async function loadStatus(){
    const badge = document.getElementById('status-badge');
    const box = document.getElementById('status-json');
    if (!badge || !box) return;
    badge.textContent = 'comprobando…';
    try{
      const r = await fetch('/api/status',{cache:'no-store'});
      const j = await r.json();
      badge.textContent = j.up ? 'online' : 'offline';
      badge.className = 'inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ' + (j.up ? 'bg-emerald-100 text-emerald-700':'bg-rose-100 text-rose-700');
      box.textContent = JSON.stringify(j, null, 2);
    }catch(e){
      badge.textContent = 'offline';
      badge.className = 'inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold bg-rose-100 text-rose-700';
      box.textContent = String(e);
    }
  }
  setInterval(loadStatus, 10000); loadStatus();

  // Botonera de tests TTS
  const out = document.getElementById('api-out');
  document.querySelectorAll('#tts-tests button[data-ep]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      try{
        const ep = btn.getAttribute('data-ep');
        const body = JSON.parse(btn.getAttribute('data-body')||'{}');
        const r = await fetch(ep, {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body)});
        const txt = await r.text();
        if(out) out.textContent = `Status ${r.status}\n${txt}`;
      }catch(e){ if(out) out.textContent = String(e); }
    });
  });

  // Mermaid (por si carga después)
  if (window.mermaid && window.mermaid.init) {
    try { window.mermaid.init(); } catch {}
  }
})();
/* Sandra Widget (WS + barge-in + audio streaming)
   Requiere: window.WSS_URL (wss://...) definido en index.html
   Servidor envía JSON por mensaje:
     {type:"token", content:"..."}            // texto incremental (opcional)
     {type:"audio_chunk", data:"<base64>"}    // audio PCM/Opus (elige uno)
     {type:"complete"}                        // fin de turno
     {type:"ready"}                           // listo para hablar
   Y recibe:
     {type:"start"}                           // iniciar sesión
     {type:"user_speech_begin"}               // PTT down
     {type:"user_speech_end"}                 // PTT up (enviar ASR)
     {type:"cancel"}                          // barge-in: cortar TTS servidor
     {type:"user_text", content:"..."}        // (opcional) enviar texto
*/

(function(){
  const $ = (s,p=document)=>p.querySelector(s);
  const logEl = $('#sandra-log'), panel=$('#sandra-panel');
  const btnToggle=$('#sandra-toggle'), btnClose=$('#sandra-close');
  const btnPTT=$('#sandra-ptt'), btnStop=$('#sandra-stop');

  let ws=null, open=false, playing=false, mediaSource, audioCtx, sourceNode, queue=[];
  let micStream, mediaRec, chunks=[];

  function log(m){ if(!logEl) return; const d=document.createElement('div'); d.textContent=m; logEl.appendChild(d); logEl.scrollTop=logEl.scrollHeight; }

  function connect(){
    if(open) return;
    ws = new WebSocket(window.WSS_URL);
    ws.binaryType = "arraybuffer";
    ws.onopen = ()=>{ open=true; ws.send(JSON.stringify({type:'start'})); log('Conectado 🟢'); };
    ws.onclose= ()=>{ open=false; log('Desconectado 🔴'); };
    ws.onerror= (e)=>{ log('WS error'); console.error(e); };
    ws.onmessage = (ev)=>{
      // texto o audio
      try{
        // si es binario, lo tratamos como audio directo
        if(ev.data instanceof ArrayBuffer){
          enqueueAudio(new Uint8Array(ev.data));
          return;
        }
        const msg = JSON.parse(ev.data);
        if(msg.type === 'token'){ log('Sandra: '+msg.content); }
        if(msg.type === 'audio_chunk'){
          // base64 → bytes
          const bstr = atob(msg.data); const bytes = new Uint8Array(bstr.length);
          for(let i=0;i<bstr.length;i++) bytes[i]=bstr.charCodeAt(i);
          enqueueAudio(bytes);
        }
        if(msg.type === 'complete'){ log('✓ Fin de turno'); }
        if(msg.type === 'ready'){ log('Listo para hablar'); }
      }catch(_){ /* ignore */ }
    };
  }

  async function ensureAudio(){
    if(audioCtx) return;
    audioCtx = new (window.AudioContext||window.webkitAudioContext)({latencyHint:'interactive'});
    sourceNode = audioCtx.createBufferSource(); // usaremos decodeAudioData por chunk
  }

  // Cola y reproducción simple (PCM/Opus decodificado por decodeAudioData)
  async function enqueueAudio(bytes){
    await ensureAudio();
    playing = true;
    try{
      const buf = await audioCtx.decodeAudioData(bytes.buffer.slice(0));
      const node = audioCtx.createBufferSource(); node.buffer = buf; node.connect(audioCtx.destination); node.start();
      node.onended = ()=>{ /* podríamos encadenar */ };
    }catch(e){ console.warn('Audio decode error', e); }
  }

  async function pttStart(){
    // barge-in: pide al servidor cortar su TTS YA
    if(open) ws.send(JSON.stringify({type:'cancel'}));
    // capturar micro
    micStream = await navigator.mediaDevices.getUserMedia({audio:true});
    mediaRec = new MediaRecorder(micStream, {mimeType: 'audio/webm;codecs=opus'});
    chunks.length=0;
    mediaRec.ondataavailable = e=>{ if(e.data && e.data.size>0) chunks.push(e.data); };
    mediaRec.onstop = async ()=>{
      const blob = new Blob(chunks, {type:'audio/webm;codecs=opus'});
      const arr = new Uint8Array(await blob.arrayBuffer());
      // enviamos el audio del usuario al servidor ASR
      if(open) ws.send(arr.buffer);
      chunks.length=0;
    };
    mediaRec.start(100);
    if(open) ws.send(JSON.stringify({type:'user_speech_begin'}));
    log('🎙️ Grabando… (PTT)');
  }

  function pttStop(){
    if(mediaRec && mediaRec.state!=='inactive'){ mediaRec.stop(); }
    if(micStream){ micStream.getTracks().forEach(t=>t.stop()); micStream=null; }
    if(open) ws.send(JSON.stringify({type:'user_speech_end'}));
    log('⏹️ Fin usuario');
  }

  function stopAll(){
    // parar audio de salida
    if(audioCtx){ try{ audioCtx.suspend(); }catch(_){} }
    // avisar a servidor
    if(open) ws.send(JSON.stringify({type:'cancel'}));
    log('⛔ Parar todo');
  }

  // Avatar integration
  const avatarContainer = $('#sandra-avatar-container');
  const avatarToggle = $('#sandra-avatar-toggle');
  let sandraAvatar = null;

  async function initAvatar() {
    if (sandraAvatar) return;
    try {
      // Load HeyGen integration (when available)
      if (window.integrateSandraAvatar) {
        sandraAvatar = window.integrateSandraAvatar('#sandra-avatar-container', {
          apiKey: window.HEYGEN_API_KEY || 'demo',
          avatarId: window.HEYGEN_AVATAR_ID || 'sandra_v1'
        });
        log('🎭 Avatar conectado nivel Premium');
      } else {
        log('⚠️ Avatar Premium no disponible');
      }
    } catch (e) {
      log('Avatar error: ' + e.message);
    }
  }

  // UI
  btnToggle?.addEventListener('click', ()=>{ panel.classList.toggle('hidden'); if(!open) connect(); });
  btnClose?.addEventListener('click', ()=> panel.classList.add('hidden'));
  avatarToggle?.addEventListener('click', ()=> {
    avatarContainer?.classList.toggle('hidden');
    if (!avatarContainer?.classList.contains('hidden')) {
      initAvatar();
    }
  });
  btnPTT?.addEventListener('mousedown', pttStart);
  btnPTT?.addEventListener('touchstart', (e)=>{e.preventDefault(); pttStart();},{passive:false});
  btnPTT?.addEventListener('mouseup', pttStop);
  btnPTT?.addEventListener('mouseleave', ()=>{ if(mediaRec && mediaRec.state==='recording') pttStop(); });
  btnPTT?.addEventListener('touchend', pttStop);
  btnStop?.addEventListener('click', stopAll);

  // Store WebSocket reference for HeyGen integration
  window.sandra_ws = ws;

})();
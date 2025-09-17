(function(){
  // WhatsApp cableado para Sandra y contacto
  const WA = '+34624829117';
  function waLink(msg){ return 'https://wa.me/'+WA.replace(/\D/g,'') + (msg?('?text='+encodeURIComponent(msg)):''); }

  // Opener 3s (opt-in)
  const playBtn = document.getElementById('play-opener');
  const audio = document.getElementById('opener-audio');
  if (playBtn && audio) playBtn.addEventListener('click', ()=>{ audio.currentTime=0; audio.play().catch(()=>{}); });

  // Barra fija contacto
  const waBtn = document.getElementById('cta-wa');
  if (waBtn) waBtn.href = waLink('Hola, quiero reservar.');

  // Barra de búsqueda → /search.html
  const form = document.getElementById('search-form');
  if (form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(form);
      const qs = new URLSearchParams(Object.fromEntries(fd.entries())).toString();
      location.href = '/search.html?'+qs;
    });
  }

  // CTA: Buscar con Sandra (abre WhatsApp con filtros)
  const sandraBtn = document.getElementById('search-sandra');
  if (sandraBtn && form){
    sandraBtn.addEventListener('click', ()=>{
      const fd = new FormData(form);
      const q = Object.fromEntries(fd.entries());
      const msg = `Hola Sandra, ayúdame a buscar:\nZona: ${q.q||''}\nHuéspedes: ${q.guests||2}\nHabitaciones: ${q.rooms||1}\nNoches: ${q.nights||1}`;
      window.open(waLink(msg),'_blank');
    });
  }
})();
"use client";
import { useState } from "react";
export default function Sandra(){
  const [text,setText]=useState("");
  const [resp,setResp]=useState<string>("");
  async function send(){
    const r = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({input:text})});
    const j = await r.json();
    setResp(j.reply || JSON.stringify(j));
  }
  return (
    <div className="grid gap-4 max-w-2xl">
      <h2 className="text-xl font-semibold">Sandra · Chat</h2>
      <textarea className="border rounded p-3" rows={4} value={text} onChange={e=>setText(e.target.value)} placeholder="Pregunta en voz o texto…"/>
      <div className="flex gap-2">
        <button onClick={send} className="px-4 py-2 rounded bg-black text-white">Enviar</button>
        <a href="/api/health" className="px-4 py-2 rounded border">Health</a>
      </div>
      {resp && <pre className="bg-gray-50 border rounded p-3 text-sm whitespace-pre-wrap">{resp}</pre>}
    </div>
  );
}

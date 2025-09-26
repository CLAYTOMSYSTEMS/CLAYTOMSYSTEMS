export async function POST(req: Request){
  const { text } = await req.json();
  if(!text) return new Response("text requerido", { status:400 });
  const voice = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if(!apiKey) return new Response("Missing ELEVENLABS_API_KEY", { status: 500 });
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`,{
    method:"POST", headers:{ "xi-api-key": apiKey, "Content-Type":"application/json" },
    body: JSON.stringify({ text, model_id:"eleven_multilingual_v2" })
  });
  if(!r.ok){
    return new Response(await r.text(), { status: r.status });
  }
  const buf = await r.arrayBuffer();
  return new Response(new Uint8Array(buf), { headers:{ "Content-Type":"audio/mpeg" }});
}

import { getOpenAI } from "@/lib/openai";
export async function POST(req: Request){
  const openai = getOpenAI();
  const contentType = req.headers.get("content-type")||"";
  if(contentType.includes("application/json")){
    const { audio_url } = await req.json();
    if(!audio_url) return Response.json({ error:"audio_url requerido" }, { status:400 });
    const r = await fetch(audio_url);
    const blob = await r.blob();
    // @ts-ignore
    const transcript = await openai.audio.transcriptions.create({ file: new File([blob],"audio.wav",{type:blob.type||"audio/wav"}), model: "whisper-1", language:"es" });
    return Response.json({ text: transcript.text });
  } else {
    const form = await req.formData();
    const file = form.get("file") as File;
    if(!file) return Response.json({ error:"file requerido" }, { status:400 });
    // @ts-ignore
    const transcript = await openai.audio.transcriptions.create({ file, model:"whisper-1", language:"es" });
    return Response.json({ text: transcript.text });
  }
}

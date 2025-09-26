import { getOpenAI, DEFAULT_MODEL } from "@/lib/openai";
export async function POST(req: Request){
  const { input } = await req.json();
  const prompt = String(input||"").slice(0,4000);
  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: "Eres Sandra, asistente cálido y resolutivo de Get Valencia. Responde breve y accionable."},
        { role: "user", content: prompt }
      ]
    });
    const reply = completion.choices[0]?.message?.content || "";
    return new Response(JSON.stringify({ reply }), { headers:{ "Content-Type":"application/json" }});
  } catch (e:any){
    return new Response(JSON.stringify({ error: e.message || "error" }), { status: 500, headers:{ "Content-Type":"application/json" }});
  }
}

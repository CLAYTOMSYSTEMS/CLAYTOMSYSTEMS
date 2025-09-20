import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function askModel(prompt: string) {
  const resp = await openai.responses.create({ model: "gpt-5", input: prompt });
  return (resp.output?.[0]?.content?.[0]?.text) ?? "";
}
import OpenAI from "openai";
let _client: OpenAI | null = null;
export function getOpenAI(){
  if(!_client){
    const key = process.env.OPENAI_API_KEY || ""; // permite build aun sin key
    _client = new OpenAI({ apiKey: key });
  }
  return _client;
}
export const DEFAULT_MODEL = process.env.OPENAI_MODEL_DEFAULT || "gpt-4o-mini";

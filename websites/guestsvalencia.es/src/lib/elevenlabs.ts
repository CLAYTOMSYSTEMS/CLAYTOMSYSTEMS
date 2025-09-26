export async function generateSpeech(text: string, voiceId?: string): Promise<ArrayBuffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not configured');
  const targetVoiceId = voiceId || defaultVoiceId;
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}` , {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2_5',
      output_format: 'mp3_44100_128',
      voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true }
    })
  });
  if (!response.ok) throw new Error(`ElevenLabs API error: ${response.statusText}`);
  return response.arrayBuffer();
}

exports.handler = async (event, context) => {
  const origin = event.headers.origin || '';
  const allowedOrigins = (process.env.ALLOW_ORIGIN || '').split(',').map(o => o.trim());
  const isAllowed = allowedOrigins.includes(origin);

  const corsHeaders = {
    'Access-Control-Allow-Origin': isAllowed ? origin : (allowedOrigins[0] || 'null'),
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  return {
    statusCode: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        elevenlabs_configured: !!process.env.ELEVENLABS_API_KEY,
        voice_id: process.env.ELEVENLABS_VOICE_ID ? 'configured' : 'missing',
        allowed_origins: process.env.ALLOW_ORIGIN ? 'configured' : 'missing'
      }
    })
  };
};
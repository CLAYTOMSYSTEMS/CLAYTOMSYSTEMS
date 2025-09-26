import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    
    // Log the incoming webhook payload
    console.log('Twilio incoming webhook:', body);

    // Basic TwiML response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Hola, gracias por contactar a Guests Valencia. Tu mensaje ha sido recibido y será procesado por Sandra IA.</Say>
  <Pause length="1"/>
  <Say voice="alice">Para una respuesta más rápida, puedes usar nuestro chat web en guestsvalencia.es</Say>
</Response>`;

    return new NextResponse(twiml, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Twilio incoming webhook error:', error);
    
    // Return basic error TwiML
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Lo siento, hay un problema técnico. Por favor intenta más tarde.</Say>
</Response>`;

    return new NextResponse(errorTwiml, {
      status: 500,
      headers: {
        'Content-Type': 'text/xml; charset=utf-8'
      }
    });
  }
}
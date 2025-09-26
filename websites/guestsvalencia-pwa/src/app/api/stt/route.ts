import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/deepgram';

function getCorsHeaders(origin: string | null) {
  const allowOrigin = process.env.ALLOW_ORIGIN || '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin === '*' ? '*' : origin || '',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin)
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const contentType = request.headers.get('content-type');

    let audioBuffer: ArrayBuffer;

    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      const audioFile = formData.get('audio') as File;
      
      if (!audioFile) {
        return NextResponse.json(
          { error: 'Audio file is required' },
          { status: 400, headers: corsHeaders }
        );
      }

      audioBuffer = await audioFile.arrayBuffer();
    } else {
      // Assume raw audio bytes
      audioBuffer = await request.arrayBuffer();
    }

    if (!audioBuffer || audioBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'No audio data provided' },
        { status: 400, headers: corsHeaders }
      );
    }

    const transcription = await transcribeAudio(audioBuffer);

    return NextResponse.json(
      { text: transcription },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('STT API error:', error);
    
    return NextResponse.json(
      { 
        error: 'STT service error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
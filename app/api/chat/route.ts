// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DeAmouraChatbot } from '@/lib/gemini-service';

export async function POST(request: NextRequest) {
  try {
    const textBody = await request.text();
    let body;

    try {
      if (!textBody) throw new Error("Empty body");
      body = JSON.parse(textBody);
    } catch (e) {
      console.error('JSON Parse Error:', e);
      // Return a friendly error response that structure matches what frontend expects for a "bot" reply, 
      // OR let it 400 and let frontend handle it. 
      // Original code returned 200 with error message. Let's do that for smoother UI.
      return NextResponse.json(
        {
          text: "Maaf, pesan kamu tidak dapat saya proses saat ini. Coba lagi ya! 💕",
          products: [],
          hasProducts: false
        },
        { status: 200 }
      );
    }

    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const chatbot = new DeAmouraChatbot();
    const response = await chatbot.generateResponse(message);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('API /chat ERROR:', error);

    return NextResponse.json(
      {
        text: "Haii! Maaf ya lagi gangguan. Coba lagi atau lihat katalog kita ya! 💕",
        products: [],
        categories: [],
        hasProducts: false
      },
      { status: 200 }
    );
  }
}
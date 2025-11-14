import { NextRequest, NextResponse } from 'next/server';
import { DeAmouraChatbot } from '@/lib/gemini-service';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const chatbot = new DeAmouraChatbot();
    const response = await chatbot.generateResponse(message);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        response: "Haii! Maaf ya, lagi gangguan nih. Yuk langsung lihat katalog produk kita atau coba lagi ya! 💫",
        products: [],
        categories: [],
        hasProducts: false
      },
      { status: 200 }
    );
  }
}
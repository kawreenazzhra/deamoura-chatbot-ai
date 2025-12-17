import { NextResponse } from 'next/server';
import { DeAmouraChatbot } from '@/lib/gemini-service';

const chatbot = new DeAmouraChatbot();

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await chatbot.generateResponse(message);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
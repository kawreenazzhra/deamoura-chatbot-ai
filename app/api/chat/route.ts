// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DeAmouraChatbot } from '@/lib/gemini-service';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('\n' + '='.repeat(60));
  console.log('🔵 API /chat START - Time:', new Date().toISOString());
  
  try {
    const body = await request.json();
    const { message } = body;

    console.log('📨 Request body:', JSON.stringify(body));
    console.log('📝 Message:', message?.substring(0, 50));

    if (!message || typeof message !== 'string') {
      console.log('❌ Invalid message format');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('✅ Message valid, calling chatbot...');
    const chatbot = new DeAmouraChatbot();
    const response = await chatbot.generateResponse(message);

    console.log('📤 Response:', response.text?.substring(0, 50) + '...');
    console.log('✨ API /chat END (SUCCESS) - Duration:', Date.now() - startTime, 'ms');
    console.log('='.repeat(60) + '\n');
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('='.repeat(60));
    console.error('❌ API /chat ERROR');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);
    console.error('Error status:', error?.status);
    console.error('Full error:', error);
    console.error('Duration:', Date.now() - startTime, 'ms');
    console.error('='.repeat(60) + '\n');
    
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
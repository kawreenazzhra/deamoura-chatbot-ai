import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('⚡ TEST API HIT!');
  try {
    const body = await request.json();
    console.log('Body:', body);
    
    return NextResponse.json({
      text: "Test reply: " + body.message,
      products: [],
      categories: [],
      hasProducts: false
    });
  } catch (e) {
    console.error('Test error:', e);
    return NextResponse.json({ error: 'test error' }, { status: 500 });
  }
}

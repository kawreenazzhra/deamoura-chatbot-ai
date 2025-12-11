// Test endpoint without Gemini
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    console.log('Test endpoint received:', message);

    return NextResponse.json({
      text: `Tes balasan untuk: "${message}" - Ini adalah respons test tanpa Gemini API`,
      products: [],
      categories: [],
      hasProducts: false
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { error: 'Test endpoint error' },
      { status: 500 }
    );
  }
}

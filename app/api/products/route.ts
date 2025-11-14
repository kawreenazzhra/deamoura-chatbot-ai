import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getFeaturedProducts } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    let products;
    if (featured === 'true') {
      products = await getFeaturedProducts();
    } else {
      products = await getProducts();
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
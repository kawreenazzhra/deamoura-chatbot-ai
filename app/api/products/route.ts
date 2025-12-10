// app/api/products/route.ts (SOLUSI CEPAT)
import { NextRequest, NextResponse } from 'next/server';
import { getProducts, searchProducts } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');

    let products: any[]; // Tambahkan tipe any[]
    
    if (search) {
      products = await searchProducts(search);
    } else {
      products = await getProducts();
    }

    // Apply limit if specified
    if (limit) {
      products = products.slice(0, parseInt(limit));
    }

    // Filter by category if specified
    if (category) {
      products = products.filter((product: any) => // Tambahkan :any
        product.category?.name.toLowerCase() === category.toLowerCase()
      );
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
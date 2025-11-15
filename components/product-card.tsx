// components/product-card.tsx - SIMPLE VERSION (NO STOCK)
"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  colors: string[];
  materials: string[];
  image_urls: string[];
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleProductClick = () => {
    router.push(`/produk/${product.slug}`);
  };

  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-all cursor-pointer border border-gray-200"
      onClick={handleProductClick}
    >
      {/* Product Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={product.image_urls?.[0] || '/images/placeholder-hijab.jpg'}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            -{discount}%
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-gray-800">
            Rp {product.price.toLocaleString()}
          </span>
          {product.original_price && (
            <span className="text-sm text-gray-500 line-through">
              Rp {product.original_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Colors Preview */}
        <div className="flex items-center space-x-1 mb-2">
          {product.colors?.slice(0, 3).map((color, index) => (
            <div 
              key={index}
              className="w-3 h-3 rounded-full border border-gray-300"
              style={{ 
                backgroundColor: color.toLowerCase().includes('merah') ? '#dc2626' :
                               color.toLowerCase().includes('pink') ? '#ec4899' :
                               color.toLowerCase().includes('navy') ? '#1e3a8a' :
                               color.toLowerCase().includes('hitam') ? '#000000' :
                               color.toLowerCase().includes('tosca') ? '#0d9488' :
                               color.toLowerCase().includes('biru') ? '#3b82f6' : '#6b7280'
              }}
              title={color}
            />
          ))}
          {product.colors?.length > 3 && (
            <span className="text-xs text-gray-500">
              +{product.colors.length - 3}
            </span>
          )}
        </div>

        {/* Material */}
        <p className="text-xs text-gray-500">
          {product.materials?.[0]}
        </p>
      </CardContent>
    </Card>
  );
}
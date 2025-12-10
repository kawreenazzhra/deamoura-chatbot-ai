// components/product-list.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  colors: string[]; // Array warna dari database
  category?: { name: string };
}

interface ProductListProps {
  initialProducts: Product[];
}

export function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch produk berdasarkan search
  useEffect(() => {
    if (searchQuery) {
      const searchProducts = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/products?search=${searchQuery}`);
          const data = await res.json();
          setProducts(data);
        } catch (error) {
          console.error('Error searching products:', error);
        } finally {
          setLoading(false);
        }
      };

      const timeoutId = setTimeout(searchProducts, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setProducts(initialProducts);
    }
  }, [searchQuery, initialProducts]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-orange-900 mb-3">Koleksi Hijab Premium</h2>
        <p className="text-orange-700 max-w-2xl mx-auto">
          Temukan berbagai pilihan hijab berkualitas tinggi dengan desain modern dan elegan
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="flex justify-center">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari produk hijab..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-orange-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-transparent text-orange-900"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-orange-700">Loading...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-orange-700">Produk tidak ditemukan</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative overflow-hidden h-64">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {product.category && (
                  <div className="absolute top-3 right-3 bg-orange-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.category.name}
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-bold text-orange-900 mb-2">{product.name}</h3>
                <p className="text-orange-700 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Display available colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-orange-600 mb-1">Warna tersedia:</p>
                    <div className="flex flex-wrap gap-1">
                      {JSON.parse(product.colors as any).slice(0, 3).map((color: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                          {color}
                        </span>
                      ))}
                      {JSON.parse(product.colors as any).length > 3 && (
                        <span className="px-2 py-1 bg-orange-200 text-orange-900 text-xs rounded">
                          +{JSON.parse(product.colors as any).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-orange-800">
                    Rp {product.price.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex-1 bg-orange-600 text-white text-center py-2.5 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Detail
                  </Link>
                  <a
                    href="#"
                    className="flex-1 bg-amber-600 text-white text-center py-2.5 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    Beli
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
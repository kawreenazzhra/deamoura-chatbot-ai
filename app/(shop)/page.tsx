// app/shop/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ShoppingBag, Search, X, ArrowLeft, Heart,
  Share2, Star, Package, Truck, RotateCcw,
  MessageCircle, Send, Instagram, Phone, MapPin,
  Filter, Grid, List
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  colors: string[];
  materials: string[];
  marketplaceUrl?: string;
  category?: { id: number; name: string };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ChatMessage {
  type: 'user' | 'bot';
  message: string;
  timestamp?: number;
}

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { type: 'bot', message: 'Haii! 👋 Ada yang bisa aku bantu tentang hijab de.amoura? Tanya-tanya yuk! ✨' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([
    { id: 'all', name: 'Semua Produk' }
  ]);

  // Fetch products and categories on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data: Category[] = await res.json();
        const formattedCategories = [
          { id: 'all', name: 'Semua Produk' },
          ...data.map(cat => ({
            id: cat.name.toLowerCase(), // Use name as ID for filtering compatibility
            name: cat.name
          }))
        ];
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Handle URL product parameter
  useEffect(() => {
    if (productSlug && products.length > 0) {
      const product = products.find(p => p.slug === productSlug);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [productSlug, products]);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatMessagesRef.current) {
      // Use setTimeout to ensure DOM has updated
      const scrollTimer = setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
      }, 0);
      return () => clearTimeout(scrollTimer);
    }
  }, [chatMessages]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      (product.category?.name && product.category.name.toLowerCase() === selectedCategory.toString().toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedColor(null);
    // Update URL without page reload (use / instead of /shop)
    router.push(`/?product=${product.slug}`, { scroll: false });
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    setSelectedColor(null);
    // Remove product from URL
    router.push('/', { scroll: false });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isChatLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to chat
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage, timestamp: Date.now() }]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Chat request failed: ${response.status}`);
      }

      const data = await response.json();

      // Add bot response to chat
      if (data.text) {
        setChatMessages(prev => {
          const updated: ChatMessage[] = [...prev, { type: 'bot', message: data.text, timestamp: Date.now() }];
          return updated;
        });
      } else if (data.response) { // Fallback for old API format if any
        setChatMessages(prev => [...prev, { type: 'bot', message: data.response, timestamp: Date.now() }]);
      } else {
        setChatMessages(prev => [...prev, { type: 'bot', message: 'Maaf ada gangguan nih. Coba lagi ya! 💕', timestamp: Date.now() }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { type: 'bot', message: 'Maaf ada gangguan nih. Coba lagi ya! 💕', timestamp: Date.now() }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Header Component
  const Header = () => (
    <header className="bg-amber-800 shadow-lg sticky top-0 z-40 text-white bg-gradient-to-r from-amber-700 to-amber-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-orange-600">
                <img
                  src="https://images.unsplash.com/photo-1563207153-f403bf289096?w=100&h=100&q=80&fit=crop&crop=center"
                  alt="de.amoura Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">de.amoura</h1>
                <p className="text-xs text-orange-200">Hijab & Fashion Muslim</p>
              </div>
            </div>
          </div>

          <a
            href="https://www.tokopedia.com/de-amoura"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-700 text-gray-50 px-6 py-2.5 rounded-full hover:bg-amber-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Belanja Sekarang</span>
          </a>
        </div>
      </div>
    </header>
  );

  // Footer Component
  const Footer = () => (
    <footer className="bg-amber-800 text-orange-300 py-7 bg-gradient-to-r from-amber-700 to-amber-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-orange-600">
                <img
                  src="https://images.unsplash.com/photo-1563207153-f403bf289096?w=100&h=100&q=80&fit=crop&crop=center"
                  alt="de.amoura Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">de.amoura</h3>
                <p className="text-orange-200">Hijab & Fashion Muslim Premium</p>
              </div>
            </div>
            <p className="text-orange-200 max-w-md">
              Menyediakan berbagai koleksi hijab berkualitas tinggi dengan desain modern dan elegan.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Kontak Kami</h4>
            <div className="space-y-3">
              <a
                href="https://instagram.com/de.amoura"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-orange-200 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span>@de.amoura</span>
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-orange-200 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>+62 812-3456-7890</span>
              </a>
              <div className="flex items-center space-x-3 text-orange-200">
                <MapPin className="w-5 h-5" />
                <span>Bandung, Indonesia</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Jam Operasional</h4>
            <div className="space-y-2 text-orange-200">
              <div className="flex justify-between">
                <span>Senin - Jumat</span>
                <span>09:00 - 17:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sabtu</span>
                <span>09:00 - 15:00</span>
              </div>
              <div className="flex justify-between">
                <span>Minggu</span>
                <span>Libur</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-200 mt-8 pt-6 text-center">
          <p className="text-orange-200">
            &copy; 2024 de.amoura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );

  // Main Content - Products List
  const productsList = (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-orange-900 mb-3">Koleksi Hijab Premium</h2>
        <p className="text-orange-700 max-w-2xl mx-auto">
          Temukan berbagai pilihan hijab berkualitas tinggi dengan desain modern dan elegan
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-8 space-y-6">
        {/* Search Bar - Create a centered, prominent search bar like the user preferred */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 w-6 h-6" />
            <input
              type="text"
              placeholder="Cari produk hijab favoritmu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-orange-200 rounded-full focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 text-orange-900 shadow-sm transition-all placeholder-orange-300"
            />
          </div>
        </div>

        {/* Category Filter & View Toggle - Centered below search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-transparent p-4 rounded-2xl shadow-none border-none">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory.toString() === cat.id.toString()
                  ? 'bg-orange-700 text-white shadow-md transform scale-105'
                  : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 hover:border-orange-300'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex bg-orange-50 rounded-full p-1 border border-orange-200 flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'grid' ? 'bg-white text-orange-700 shadow-sm transform scale-105' : 'text-orange-400 hover:text-orange-600'}`}
              title="Tampilan Grid"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-orange-700 shadow-sm transform scale-105' : 'text-orange-400 hover:text-orange-600'}`}
              title="Tampilan List"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-orange-700">Loading produk...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto border border-orange-200">
            <Search className="w-16 h-16 text-orange-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-orange-900 mb-2">Produk tidak ditemukan</h3>
            <p className="text-orange-700 mb-4">
              Tidak ada produk yang cocok dengan pencarian "{searchQuery}"
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-orange-800 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-all duration-300"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-200 cursor-pointer"
              onClick={() => handleOpenProduct(product)}
            >
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
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-orange-800">
                    Rp {product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600">
                    Stok: {product.stock}
                  </span>
                </div>
                <div className="bg-orange-700 text-white text-center py-3 rounded-xl hover:bg-orange-800 transition-all duration-300 font-medium">
                  Lihat Detail
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 mb-20">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-200 cursor-pointer hover:shadow-xl transition-all"
              onClick={() => handleOpenProduct(product)}
            >
              <div className="flex">
                <div className="w-48 h-48 relative flex-shrink-0">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      {product.category && (
                        <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                          {product.category.name}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-orange-900 mb-2">{product.name}</h3>
                      <p className="text-orange-700 mb-3">
                        {product.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-800">
                        Rp {product.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Stok: {product.stock}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-600">
                      Klik untuk melihat detail produk
                    </div>
                    <div className="bg-orange-700 text-white px-4 py-2 rounded-lg hover:bg-orange-800 transition-colors">
                      Lihat Detail
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Helper function to safely parse JSON
  const safeJsonParse = (data: any): any[] => {
    if (!data) return [];
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.warn('Failed to parse JSON:', e);
        return [];
      }
    }
    // Already parsed (object or array)
    return Array.isArray(data) ? data : [];
  };

  // Product Detail Modal
  const ProductDetailModal = () => {
    if (!selectedProduct) return null;

    const colors = safeJsonParse(selectedProduct.colors);
    const materials = safeJsonParse(selectedProduct.materials);
    const variants = safeJsonParse((selectedProduct as any).variants);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-orange-800 flex flex-col">
          {/* Modal Header */}
          <div className="bg-orange-800 text-white p-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
            <button
              onClick={handleCloseProduct}
              className="flex items-center hover:bg-orange-700 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali
            </button>
            <div className="flex items-center gap-4">
              <button className="hover:bg-orange-700 p-2 rounded-full transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="hover:bg-orange-700 p-2 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleCloseProduct}
                className="hover:bg-orange-700 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="md:grid md:grid-cols-2 gap-8 items-start">
              {/* Product Images */}
              <div className="mb-6 md:mb-0 md:max-w-sm">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
                  {selectedProduct.imageUrl ? (
                    <Image
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ShoppingBag className="w-24 h-24 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div>
                <div className="mb-4">
                  {selectedProduct.category && (
                    <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedProduct.category.name}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h1>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-4xl font-bold text-orange-700">
                    Rp {selectedProduct.price.toLocaleString()}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Stok: <span className="font-semibold">{selectedProduct.stock} pcs</span>
                  </p>
                </div>

                {/* Color/Variant Selection */}
                {colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Warna Tersedia</h3>
                    <div className="flex flex-wrap gap-3">
                      {colors.map((color: string, index: number) => {
                        const variant = variants.find((v: any) => v.name === color);
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedColor(color)}
                            className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${selectedColor === color
                              ? 'border-orange-600 bg-orange-50 shadow-md'
                              : 'border-gray-300 hover:border-orange-400'
                              }`}
                            title={color}
                          >
                            {variant && variant.image ? (
                              <div className="relative w-6 h-6 rounded-full mr-3 border border-gray-300 overflow-hidden bg-gray-50">
                                <Image
                                  src={variant.image}
                                  alt={color}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div
                                className="w-5 h-5 rounded-full mr-3 border border-gray-400 shadow-sm"
                                style={{ backgroundColor: color.toLowerCase() }}
                              />
                            )}
                            <span className="text-sm font-medium">{color}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Show selected variant image */}
                    {selectedColor && variants.length > 0 && (() => {
                      const selectedVariant = variants.find((v: any) => v.name === selectedColor);
                      return selectedVariant && selectedVariant.image ? (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 mb-2 font-medium">Detail Warna: {selectedColor}</p>
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white border border-gray-300">
                            <Image
                              src={selectedVariant.image}
                              alt={selectedColor}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                {/* Materials */}
                {materials.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Bahan</h3>
                    <div className="flex flex-wrap gap-2">
                      {materials.map((material: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Truck className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm">Gratis Ongkir</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Package className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm">Pengiriman Cepat</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <RotateCcw className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-sm">Garansi 7 Hari</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Deskripsi</h3>
                  <p className="text-gray-700 whitespace-pre-line">{selectedProduct.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <a
                    href={selectedProduct.marketplaceUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white text-center py-3.5 rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                  >
                    Beli di Tokopedia
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Chatbot Component
  const ChatbotComponent = () => (
    <>
      {/* Floating Chat Button */}
      {!showChatbot && (
        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {showChatbot && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-amber-800">
          <div className="bg-gradient-to-r from-amber-700 to-amber-800 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6" />
              <div>
                <h3 className="font-bold">de.amoura Assistant</h3>
                <p className="text-xs opacity-90">Online</p>
              </div>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={chatMessagesRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-amber-50">
            {chatMessages && chatMessages.length > 0 ? (
              chatMessages.map((msg, index) => (
                <div
                  key={msg.timestamp || index}
                  data-message-type={msg.type}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm break-words ${msg.type === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-br-none'
                      : 'bg-amber-100 text-amber-900 rounded-bl-none'
                      }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-amber-700 text-sm">Mulai percakapan...</div>
            )}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-amber-100 text-amber-900 p-3 rounded-2xl rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-amber-900 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-amber-900 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-amber-900 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-amber-800">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isChatLoading && handleSendMessage()}
                placeholder="Ketik pertanyaan Anda..."
                disabled={isChatLoading}
                className="flex-1 px-4 py-2 border border-amber-700 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent text-amber-900 placeholder-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={isChatLoading}
                className="bg-gradient-to-r from-amber-700 to-amber-800 text-white p-2 rounded-full hover:from-amber-600 hover:to-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      <Header />
      {productsList}
      <Footer />
      <ProductDetailModal />
      <ChatbotComponent />
    </div>
  );
}
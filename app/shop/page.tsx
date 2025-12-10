// app/shop/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
  category?: { name: string };
}

interface ChatMessage {
  type: 'user' | 'bot';
  message: string;
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
    { type: 'bot', message: 'Halo! Ada yang bisa saya bantu tentang produk hijab de.amoura?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories
  const categories = [
    { id: 'all', name: 'Semua Produk' },
    { id: 'pashmina', name: 'Pashmina' },
    { id: 'segi-empat', name: 'Segi Empat' },
    { id: 'bergo', name: 'Bergo' },
    { id: 'khimar', name: 'Khimar' },
    { id: 'sport', name: 'Sport' }
  ];

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle URL product parameter
  useEffect(() => {
    if (productSlug && products.length > 0) {
      const product = products.find(p => p.slug === productSlug);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [productSlug, products]);

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
      product.category?.name.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedColor(null);
    // Update URL without page reload
    router.push(`/shop?product=${product.slug}`, { scroll: false });
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    setSelectedColor(null);
    // Remove product from URL
    router.push('/shop', { scroll: false });
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, 
        { type: 'user', message: inputMessage },
        { type: 'bot', message: 'Terima kasih atas pertanyaan Anda! Tim kami akan segera membantu Anda. Untuk informasi lebih detail, silakan kunjungi toko kami di Tokopedia.' }
      ]);
      setInputMessage('');
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
  const ProductsList = () => (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-orange-900 mb-3">Koleksi Hijab Premium</h2>
        <p className="text-orange-700 max-w-2xl mx-auto">
          Temukan berbagai pilihan hijab berkualitas tinggi dengan desain modern dan elegan
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-orange-700 text-white'
                    : 'bg-white text-orange-700 border border-orange-300 hover:bg-orange-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Bar & View Toggle */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari produk hijab..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-orange-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-transparent text-orange-900"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-white rounded-full p-1 border border-orange-300">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-orange-100 text-orange-700' : 'text-orange-500'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full ${viewMode === 'list' ? 'bg-orange-100 text-orange-700' : 'text-orange-500'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
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

  // Product Detail Modal
  const ProductDetailModal = () => {
    if (!selectedProduct) return null;

    const colors = selectedProduct.colors ? JSON.parse(selectedProduct.colors as any) : [];
    const materials = selectedProduct.materials ? JSON.parse(selectedProduct.materials as any) : [];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-orange-800">
          {/* Modal Header */}
          <div className="sticky top-0 bg-orange-800 text-white p-4 rounded-t-2xl flex items-center justify-between">
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
          
          <div className="p-6">
            <div className="md:flex gap-8">
              {/* Product Images */}
              <div className="md:w-1/2">
                <div className="relative h-96 rounded-xl overflow-hidden mb-4">
                  {selectedProduct.imageUrl ? (
                    <Image
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ShoppingBag className="w-24 h-24 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Color Thumbnails */}
                {colors.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {colors.slice(0, 4).map((color: string, index: number) => (
                      <div 
                        key={index} 
                        className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer ${
                          selectedColor === color 
                            ? 'border-orange-600' 
                            : 'border-orange-200 hover:border-orange-400'
                        }`}
                        onClick={() => setSelectedColor(color)}
                      >
                        <div 
                          className="w-full h-full"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="mb-4">
                  {selectedProduct.category && (
                    <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedProduct.category.name}
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.8) • 124 reviews</span>
                </div>
                
                {/* Price */}
                <div className="mb-6">
                  <p className="text-4xl font-bold text-orange-700">
                    Rp {selectedProduct.price.toLocaleString()}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Stok: <span className="font-semibold">{selectedProduct.stock} pcs</span>
                  </p>
                </div>
                
                {/* Color Selection */}
                {colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Warna Tersedia</h3>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(color)}
                          className={`flex items-center px-3 py-2 rounded-lg border ${
                            selectedColor === color
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div 
                            className="w-6 h-6 rounded-full mr-2 border border-gray-300"
                            style={{ backgroundColor: color.toLowerCase() }}
                          />
                          <span className="text-sm">{color}</span>
                        </button>
                      ))}
                    </div>
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
                  
                  <button className="w-full bg-white border-2 border-orange-600 text-orange-600 py-3.5 rounded-xl hover:bg-orange-50 transition-colors font-medium">
                    Tambah ke Keranjang
                  </button>
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

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-br-none'
                      : 'bg-amber-600 text-amber-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-amber-800">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1 px-4 py-2 border border-amber-700 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent text-amber-900 placeholder-amber-700"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-amber-700 to-amber-800 text-white p-2 rounded-full hover:from-amber-600 hover:to-amber-700 transition-colors"
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
      <ProductsList />
      <Footer />
      <ProductDetailModal />
      <ChatbotComponent />
    </div>
  );
}
// app/shop/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ShoppingBag, Search, X, ArrowLeft, Heart,
  Share2, Star, Package, Truck, RotateCcw,
  MessageCircle, Send, Instagram, Phone, MapPin,
  Filter, Grid, List, Sparkles
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
    { type: 'bot', message: 'Assalamualaikum! Selamat datang di de.amoura. Ada yang bisa saya bantu untuk menemukan hijab impianmu?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isScrolled, setIsScrolled] = useState(false);

  // Categories
  const categories = [
    { id: 'all', name: 'Semua Koleksi' },
    { id: 'pashmina', name: 'Pashmina' },
    { id: 'segi-empat', name: 'Segi Empat' },
    { id: 'bergo', name: 'Bergo' },
    { id: 'khimar', name: 'Khimar' },
    { id: 'sport', name: 'Sport Series' }
  ];

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    router.push(`/shop?product=${product.slug}`, { scroll: false });
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    setSelectedColor(null);
    router.push('/shop', { scroll: false });
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages,
      { type: 'user', message: inputMessage },
      { type: 'bot', message: 'Terima kasih atas pesan Kakak! Tim stylist kami akan segera membantu. Kakak juga bisa cek koleksi terbaru kami di Tokopedia ya!' }
      ]);
      setInputMessage('');
    }
  };

  // Header Component
  const Header = () => (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'glass py-2 border-b border-white/20' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center overflow-hidden border border-accent shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1563207153-f403bf289096?w=100&h=100&q=80&fit=crop&crop=center"
                alt="de.amoura Logo"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div>
              <h1 className={`text-xl md:text-2xl font-bold tracking-tight ${isScrolled ? 'text-primary' : 'text-primary'}`}>de.amoura</h1>
              <p className="text-[10px] md:text-xs text-accent-foreground tracking-widest uppercase">Premium Modest Wear</p>
            </div>
          </div>

          <a
            href="https://www.tokopedia.com/de-amoura"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-6 py-2.5 bg-primary text-primary-foreground rounded-full overflow-hidden shadow-lg transition-all hover:shadow-primary/25"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <div className="flex items-center space-x-2 relative z-10">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm font-medium">Shop Now</span>
            </div>
          </a>
        </div>
      </div>
    </header>
  );

  // Footer Component
  const Footer = () => (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-accent">
                <img
                  src="https://images.unsplash.com/photo-1563207153-f403bf289096?w=100&h=100&q=80&fit=crop&crop=center"
                  alt="de.amoura"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-serif">de.amoura</h3>
                <p className="text-accent text-sm tracking-widest uppercase">Elegance in Modesty</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 max-w-md leading-relaxed">
              Menghadirkan keanggunan dalam setiap helai hijab. Kualitas premium untuk wanita muslimah yang mengutamakan kenyamanan dan gaya.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center"><Sparkles className="w-4 h-4 mr-2 text-accent" /> Contact</h4>
            <div className="space-y-4 text-primary-foreground/80">
              <a href="https://instagram.com/de.amoura" target="_blank" className="flex items-center space-x-3 hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
                <span>@de.amoura</span>
              </a>
              <a href="https://wa.me/6281234567890" target="_blank" className="flex items-center space-x-3 hover:text-accent transition-colors">
                <Phone className="w-5 h-5" />
                <span>+62 812-3456-7890</span>
              </a>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5" />
                <span>Bandung, Indonesia</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Operasional</h4>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex justify-between border-b border-primary-foreground/10 pb-2">
                <span>Senin - Jumat</span>
                <span>09:00 - 17:00</span>
              </div>
              <div className="flex justify-between border-b border-primary-foreground/10 pb-2">
                <span>Sabtu</span>
                <span>09:00 - 15:00</span>
              </div>
              <div className="flex justify-between opacity-60">
                <span>Minggu</span>
                <span>Libur</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} de.amoura. Created with love.
          </p>
        </div>
      </div>
    </footer>
  );

  // Main Content - Products List
  const ProductsList = () => (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 blur-[100px] -z-10 rounded-full"></div>
        <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent-foreground text-xs font-semibold tracking-wider mb-4 border border-accent/20">NEW COLLECTION 2025</span>
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif">Discover Your Elegance</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Koleksi eksklusif dengan warna-warna earth tone yang lembut dan material premium yang nyaman dipakai seharian.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-12 sticky top-20 z-30">
        <div className="glass rounded-2xl p-4 shadow-lg border border-white/40">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === cat.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:text-primary'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search Bar & View Toggle */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80 group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  placeholder="Cari hijab favoritmu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
                />
              </div>

              {/* View Toggle */}
              <div className="flex bg-secondary/30 rounded-full p-1 border border-border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow text-primary' : 'text-muted-foreground hover:text-primary'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow text-primary' : 'text-muted-foreground hover:text-primary'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-80 bg-secondary/20 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-secondary/10 rounded-3xl border border-dashed border-border">
          <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">Produk tidak ditemukan</h3>
          <p className="text-muted-foreground mb-6">
            Maaf, kami tidak dapat menemukan apa yang Anda cari.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-accent font-medium hover:text-primary transition-colors underline underline-offset-4"
          >
            Bersihkan Pencarian
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-border/50 cursor-pointer flex flex-col h-full"
              onClick={() => handleOpenProduct(product)}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary/10">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ShoppingBag className="w-8 h-8 opacity-20" />
                  </div>
                )}
                {product.category && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {product.category.name}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium text-center">Lihat Detail</p>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-accent transition-colors">{product.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                  {product.description}
                </p>
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Harga</p>
                    <span className="text-lg font-bold text-primary">
                      Rp {product.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6 mb-20">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border border-border cursor-pointer flex gap-6 items-center"
              onClick={() => handleOpenProduct(product)}
            >
              <div className="w-32 h-32 relative rounded-xl overflow-hidden flex-shrink-0 bg-secondary/10">
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    {product.category && (
                      <span className="text-xs font-medium text-accent mb-2 block uppercase tracking-wider">
                        {product.category.name}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 max-w-xl">
                      {product.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      Rp {product.price.toLocaleString()}
                    </p>
                    {product.stock < 10 && (
                      <p className="text-xs text-destructive mt-1 font-medium">
                        Sisa {product.stock} pcs!
                      </p>
                    )}
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-[#FAF9F6] rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 relative">
          <button
            onClick={handleCloseProduct}
            className="absolute top-4 right-4 z-10 bg-white/50 hover:bg-white p-2 rounded-full transition-colors backdrop-blur-sm"
          >
            <X className="w-6 h-6 text-primary" />
          </button>

          <div className="flex flex-col md:flex-row min-h-[600px]">
            {/* Left: Image Side */}
            <div className="md:w-1/2 relative bg-[#F0EBE5]">
              <div className="sticky top-0 h-full min-h-[400px]">
                {selectedProduct.imageUrl ? (
                  <Image
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-20 h-20 text-muted-foreground/20" />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Info Side */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
              <div className="mb-auto">
                {selectedProduct.category && (
                  <span className="text-accent font-semibold tracking-widest text-xs uppercase mb-4 block">
                    {selectedProduct.category.name} Collection
                  </span>
                )}

                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-serif">{selectedProduct.name}</h1>

                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
                  <div className="text-3xl font-light text-primary">
                    Rp {selectedProduct.price.toLocaleString()}
                  </div>
                  <div className="h-8 w-[1px] bg-border"></div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-accent fill-accent mr-1" />
                    <span className="font-medium text-primary mr-1">4.9</span>
                    (86 Reviews)
                  </div>
                </div>

                {/* Color Selection */}
                {colors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Pilih Warna</h3>
                    <div className="flex flex-wrap gap-3">
                      {colors.map((color: string, index: number) => (
                        <div key={index} className="group relative">
                          <button
                            onClick={() => setSelectedColor(color)}
                            className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${selectedColor === color
                                ? 'border-primary ring-2 ring-primary/20 scale-110'
                                : 'border-transparent hover:scale-110'
                              }`}
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          />
                          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-primary text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">Tentang Produk</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {materials.length > 0 && (
                    <div className="bg-white p-3 rounded-xl border border-border/50">
                      <span className="text-xs text-muted-foreground block mb-1">Material</span>
                      <span className="text-sm font-medium text-primary">{materials[0]}</span>
                    </div>
                  )}
                  <div className="bg-white p-3 rounded-xl border border-border/50">
                    <span className="text-xs text-muted-foreground block mb-1">Pengiriman</span>
                    <span className="text-sm font-medium text-primary flex items-center">
                      <Truck className="w-3 h-3 mr-1" /> Express
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-4">
                <button className="flex-1 bg-white border border-primary/20 text-primary py-4 rounded-xl font-semibold hover:bg-secondary/30 transition-colors">
                  Add to Bag
                </button>
                <a
                  href={selectedProduct.marketplaceUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-[2] bg-primary text-white text-center py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center"
                >
                  Beli Sekarang
                </a>
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
      {!showChatbot && (
        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-110 z-40 group"
        >
          <MessageCircle className="w-6 h-6 group-hover:animate-bounce" />
          <span className="absolute -top-2 -right-2 bg-destructive w-4 h-4 rounded-full border-2 border-white"></span>
        </button>
      )}

      {showChatbot && (
        <div className="fixed bottom-8 right-8 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-border animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-primary text-primary-foreground p-4 rounded-t-2xl flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm">Assistant de.amoura</h3>
                <p className="text-xs opacity-80">Online • Balas Cepat</p>
              </div>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className="hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F6]">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm text-sm ${msg.type === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-foreground border border-border rounded-bl-none'
                    }`}
                >
                  <p>{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-border rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tulis pesan..."
                className="flex-1 px-4 py-2.5 bg-secondary/30 border border-transparent rounded-full focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all text-sm placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary text-white p-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-background selection:bg-accent/30 selection:text-primary">
      <Header />
      <ProductsList />
      <Footer />
      <ProductDetailModal />
      <ChatbotComponent />
    </div>
  );
}
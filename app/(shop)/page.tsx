// app/shop/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);

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
    <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'glass py-2 border-b border-white/20' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-primary">
                <img
                  src="https://images.unsplash.com/photo-1563207153-f403bf289096?w=100&h=100&q=80&fit=crop&crop=center"
                  alt="de.amoura Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">de.amoura</h1>
                <p className="text-xs text-primary-foreground/80">Hijab & Fashion Muslim</p>
              </div>
            </div>
          </div>

          <a
            href="https://www.tokopedia.com/de-amoura"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-6 py-2.5 premium-gradient text-white rounded-full overflow-hidden shadow-lg transition-all hover:shadow-primary/25"
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
    <footer className="premium-gradient text-white py-4 mt-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-primary">
                <img
                  src="https://images.unsplash.com/photo-1563207153-f403bf289096?w=100&h=100&q=80&fit=crop&crop=center"
                  alt="de.amoura Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif leading-tight">de.amoura</h3>
                <p className="text-accent text-[10px] tracking-widest uppercase">Elegance in Modesty</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Keanggunan dalam setiap helai hijab. Premium, nyaman, dan bergaya.
            </p>
          </div>

          <div className="text-left md:text-right">
            <h4 className="text-sm font-bold text-white mb-3">Kontak</h4>
            <div className="space-y-2 inline-flex flex-col items-start md:items-end">
              <a
                href="https://instagram.com/de.amoura"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary-foreground/80 hover:text-white transition-colors text-sm"
              >
                <Instagram className="w-4 h-4" />
                <span>@de.amoura</span>
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary-foreground/80 hover:text-white transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>+62 812-3456-7890</span>
              </a>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80">
                <MapPin className="w-4 h-4" />
                <span>Bandung, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 mt-8 text-center">
          <p className="text-xs text-primary-foreground/60">
            &copy; {new Date().getFullYear()} de.amoura.
          </p>
        </div>
      </div>
    </footer>
  );

  // Main Content - Products List
  const productsList = (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16 relative py-12 bg-secondary/30 rounded-3xl border border-classik/20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent/10 blur-[80px] -z-10 rounded-full"></div>
        <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent-foreground text-xs font-semibold tracking-wider mb-4 border border-accent/20">NEW COLLECTION 2025</span>
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-serif">Discover Your Elegance</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Koleksi eksklusif dengan warna-warna earth tone yang lembut dan material premium yang nyaman dipakai seharian.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-8 space-y-6">
        {/* Search Bar - Create a centered, prominent search bar like the user preferred */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-6 h-6" />
            <input
              type="text"
              placeholder="Cari produk hijab favoritmu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-primary/20 rounded-full focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-foreground shadow-sm transition-all placeholder-muted-foreground"
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
                  ? 'premium-gradient text-white shadow-md transform scale-105'
                  : 'bg-white text-classik-strong border border-classik hover:bg-secondary/50'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex bg-secondary rounded-full p-1 border border-primary/20 flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm transform scale-105' : 'text-primary/60 hover:text-primary'}`}
              title="Tampilan Grid"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-primary shadow-sm transform scale-105' : 'text-primary/60 hover:text-primary'}`}
              title="Tampilan List"
            >
              <List className="w-5 h-5" />
            </button>
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
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-classik/40 cursor-pointer flex flex-col h-full"
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
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-classik-strong border border-classik/20 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
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
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-primary flex flex-col">
          {/* Modal Header */}
          <div className="bg-primary text-primary-foreground p-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
            <button
              onClick={handleCloseProduct}
              className="flex items-center hover:bg-primary/90 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali
            </button>
            <div className="flex items-center gap-4">
              <button className="hover:bg-primary/90 p-2 rounded-full transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="hover:bg-primary/90 p-2 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleCloseProduct}
                className="hover:bg-primary/90 p-2 rounded-full transition-colors"
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
                    <span className="inline-block bg-secondary text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {selectedProduct.category.name}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h1>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-4xl font-bold text-primary">
                    Rp {selectedProduct.price.toLocaleString()}
                  </p>
                  <div className="h-8 w-[1px] bg-border"></div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-accent fill-accent mr-1" />
                    <span className="font-medium text-primary mr-1">4.9</span>
                    (86 Reviews)
                  </div>
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
                              ? 'border-primary bg-secondary shadow-md'
                              : 'border-border hover:border-primary/60'
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
                  <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">Tentang Produk</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <a
                    href={selectedProduct.marketplaceUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full premium-gradient text-white text-center py-3.5 rounded-xl hover:opacity-90 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                  >
                    Beli di Tokopedia
                  </a>
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
                  className="flex-[2] premium-gradient text-white text-center py-4 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center"
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
          className="fixed bottom-8 right-8 premium-gradient text-white p-4 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-110 z-40 group"
        >
          <MessageCircle className="w-6 h-6 group-hover:animate-bounce" />
          <span className="absolute -top-2 -right-2 bg-destructive w-4 h-4 rounded-full border-2 border-white"></span>
        </button>
      )}

      {showChatbot && (
        <div className="fixed bottom-8 right-8 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-border animate-in slide-in-from-bottom-10 duration-300">
          <div className="premium-gradient text-white p-4 rounded-t-2xl flex items-center justify-between shadow-md">
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

          <div ref={chatMessagesRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/30">
            {chatMessages && chatMessages.length > 0 ? (
              chatMessages.map((msg, index) => (
                <div
                  key={msg.timestamp || index}
                  data-message-type={msg.type}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm break-words ${msg.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-secondary text-foreground rounded-bl-none'
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
                <div className="bg-secondary text-foreground p-3 rounded-2xl rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-border rounded-b-2xl">
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
      {productsList}
      <Footer />
      <ProductDetailModal />
      <ChatbotComponent />
    </div>
  );
}
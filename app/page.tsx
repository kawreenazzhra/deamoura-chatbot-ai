"use client";
import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Search, X, Send, Instagram, Phone, MapPin } from 'lucide-react';

// Define TypeScript interfaces
interface Color {
  name: string;
  hex: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  tokopediaLink: string;
  description: string;
  colors: Color[];
}

interface ChatMessage {
  type: 'user' | 'bot';
  message: string;
}

const HijabCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { type: 'bot', message: 'Halo! Ada yang bisa saya bantu tentang produk hijab de.amoura?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  const products: Product[] = [
    {
      id: 1,
      name: 'Pashmina Premium Silk',
      category: 'Pashmina',
      price: 'Rp 89.000',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura',
      description: 'Pashmina premium dengan bahan silk yang lembut dan adem',
      colors: [
        { name: 'Dusty Pink', hex: '#d4a5a5', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80' },
        { name: 'Soft Brown', hex: '#a67c52', image: 'https://images.unsplash.com/photo-1580626808041-fab7f47f4e56?w=500&q=80' },
        { name: 'Cream', hex: '#f5f5dc', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&q=80' },
        { name: 'Navy', hex: '#1e3a5f', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80' },
        { name: 'Black', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' }
      ]
    },
    {
      id: 2,
      name: 'Segi Empat Voal',
      category: 'Segi Empat',
      price: 'Rp 65.000',
      image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura',
      description: 'Hijab segi empat dengan bahan voal premium',
      colors: [
        { name: 'Mint', hex: '#98d8c8', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80' },
        { name: 'Lilac', hex: '#c8a8d8', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Peach', hex: '#ffb88c', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80' },
        { name: 'Grey', hex: '#808080', image: 'https://images.unsplash.com/photo-1601925259926-2b5d6c64dbb1?w=500&q=80' },
        { name: 'White', hex: '#f8f8f8', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&q=80' }
      ]
    },
    {
      id: 3,
      name: 'Bergo InstanDaily',
      category: 'Bergo',
      price: 'Rp 55.000',
      image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura',
      description: 'Bergo instan praktis untuk aktivitas sehari-hari',
      colors: [
        { name: 'Maroon', hex: '#800000', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Olive', hex: '#808000', image: 'https://images.unsplash.com/photo-1580626808041-fab7f47f4e56?w=500&q=80' },
        { name: 'Caramel', hex: '#c68642', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80' },
        { name: 'Dark Brown', hex: '#654321', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&q=80' },
        { name: 'Charcoal', hex: '#36454f', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' }
      ]
    },
    {
      id: 4,
      name: 'Khimar Syari',
      category: 'Khimar',
      price: 'Rp 125.000',
      image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura',
      description: 'Khimar syari dengan model terbaru',
      colors: [
        { name: 'Black', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' },
        { name: 'Navy', hex: '#1e3a5f', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80' },
        { name: 'Dark Grey', hex: '#4a4a4a', image: 'https://images.unsplash.com/photo-1601925259926-2b5d6c64dbb1?w=500&q=80' },
        { name: 'Chocolate', hex: '#3d2817', image: 'https://images.unsplash.com/photo-1580626808041-fab7f47f4e56?w=500&q=80' },
        { name: 'Burgundy', hex: '#6b1f29', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' }
      ]
    },
    {
      id: 5,
      name: 'Sport Hijab Active',
      category: 'Sport',
      price: 'Rp 75.000',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura',
      description: 'Hijab sport untuk olahraga dengan bahan breathable',
      colors: [
        { name: 'Black', hex: '#1a1a1a', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' },
        { name: 'Navy', hex: '#1e3a5f', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80' },
        { name: 'Red', hex: '#d32f2f', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Blue', hex: '#1976d2', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80' },
        { name: 'Purple', hex: '#7b1fa2', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' }
      ]
    },
    {
      id: 6,
      name: 'Pashmina Ceruty',
      category: 'Pashmina',
      price: 'Rp 69.000',
      image: 'https://images.unsplash.com/photo-1580626808041-fab7f47f4e56?w=500&q=80',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura',
      description: 'Pashmina ceruty dengan berbagai pilihan warna',
      colors: [
        { name: 'Salmon', hex: '#fa8072', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80' },
        { name: 'Mustard', hex: '#ffdb58', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&q=80' },
        { name: 'Teal', hex: '#008080', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80' },
        { name: 'Mauve', hex: '#e0b0ff', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Beige', hex: '#d2b48c', image: 'https://images.unsplash.com/photo-1580626808041-fab7f47f4e56?w=500&q=80' }
      ]
    },
    {
      id: 7,
      name: 'Segi Empat Maxmara',
      category: 'Segi Empat',
      price: 'Rp 79.000',
      image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&q=80',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura',
      description: 'Hijab segi empat bahan maxmara premium',
      colors: [
        { name: 'Emerald', hex: '#50c878', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80' },
        { name: 'Coral', hex: '#ff7f50', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80' },
        { name: 'Taupe', hex: '#b38b6d', image: 'https://images.unsplash.com/photo-1580626808041-fab7f47f4e56?w=500&q=80' },
        { name: 'Slate', hex: '#708090', image: 'https://images.unsplash.com/photo-1601925259926-2b5d6c64dbb1?w=500&q=80' },
        { name: 'Ivory', hex: '#fffff0', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&q=80' }
      ]
    },
    {
      id: 8,
      name: 'Bergo Pad Antem',
      category: 'Bergo',
      price: 'Rp 85.000',
      image: 'https://images.unsplash.com/photo-1601925259926-2b5d6c64dbb1?w=500&q=80',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura',
      description: 'Bergo dengan pad antem untuk tampilan lebih rapi',
      colors: [
        { name: 'Rose Gold', hex: '#b76e79', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80' },
        { name: 'Sand', hex: '#c2b280', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&q=80' },
        { name: 'Mocha', hex: '#967969', image: 'https://images.unsplash.com/photo-1580626808041-fab7f47f4e56?w=500&q=80' },
        { name: 'Army Green', hex: '#4b5320', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80' },
        { name: 'Ash Grey', hex: '#b2beb5', image: 'https://images.unsplash.com/photo-1601925259926-2b5d6c64dbb1?w=500&q=80' }
      ]
    }
  ];

  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    const matchName = product.name.toLowerCase().includes(searchLower);
    const matchCategory = product.category.toLowerCase().includes(searchLower);
    const matchDescription = product.description.toLowerCase().includes(searchLower);
    
    return matchName || matchCategory || matchDescription;
  });

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, 
        { type: 'user', message: inputMessage },
        { type: 'bot', message: 'Terima kasih atas pertanyaan Anda! Tim kami akan segera membantu Anda. Untuk informasi lebih detail, silakan kunjungi toko kami di Tokopedia.' }
      ]);
      setInputMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-200 to-amber-300 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-amber-400">
                  <img 
                    src="https://images.unsplash.com/photo-1563207153-f403bf289096?w=100&h=100&q=80&fit=crop&crop=center" 
                    alt="de.amoura Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-amber-900">de.amoura</h1>
                  <p className="text-xs text-amber-800">Hijab & Fashion Muslim</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <a 
              href="https://www.tokopedia.com/de-amoura" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-900 text-amber-50 px-6 py-2.5 rounded-full hover:bg-amber-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Belanja Sekarang</span>
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-3">Koleksi Hijab Premium</h2>
          <p className="text-amber-700 max-w-2xl mx-auto">
            Temukan berbagai pilihan hijab berkualitas tinggi dengan desain modern dan elegan untuk melengkapi penampilanmu
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8">
          <div className="flex justify-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari produk hijab berdasarkan nama, kategori, atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-amber-900 placeholder-amber-400"
              />
            </div>
          </div>
          
          {/* Search Info */}
          {searchQuery && (
            <div className="text-center mt-4">
              <p className="text-sm text-amber-700">
                Menampilkan {filteredProducts.length} produk untuk pencarian "{searchQuery}"
                {filteredProducts.length === 0 && (
                  <span className="block mt-1 text-amber-600">
                    Coba cari dengan kata kunci lain seperti "Pashmina", "Bergo", atau "Sport"
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100"
            >
              <div className="relative overflow-hidden h-64">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-amber-500 text-amber-50 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-amber-900 mb-2">{product.name}</h3>
                <p className="text-amber-700 text-sm mb-3">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-amber-600">{product.price}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setSelectedColor(null);
                  }}
                  className="block w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  Pilih Warna
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {searchQuery && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto border border-amber-100">
              <Search className="w-16 h-16 text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-amber-900 mb-2">Produk tidak ditemukan</h3>
              <p className="text-amber-700 mb-4">
                Tidak ada produk yang cocok dengan pencarian "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
              >
                Tampilkan Semua Produk
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-amber-200 to-amber-300 text-amber-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-amber-400">
                  <img 
                    src="https://images.unsplash.com/photo-1563207153-f403bf289096?w=100&h=100&q=80&fit=crop&crop=center" 
                    alt="de.amoura Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">de.amoura</h3>
                  <p className="text-amber-800">Hijab & Fashion Muslim Premium</p>
                </div>
              </div>
              <p className="text-amber-800 max-w-md">
                Menyediakan berbagai koleksi hijab berkualitas tinggi dengan desain modern dan elegan untuk penampilan muslimah yang stylish.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak Kami</h4>
              <div className="space-y-3">
                <a 
                  href="https://instagram.com/de.amoura" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-amber-800 hover:text-amber-900 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span>@de.amoura</span>
                </a>
                <a 
                  href="https://wa.me/6281234567890" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-amber-800 hover:text-amber-900 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>+62 812-3456-7890</span>
                </a>
                <div className="flex items-center space-x-3 text-amber-800">
                  <MapPin className="w-5 h-5" />
                  <span>Bandung, Indonesia</span>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Jam Operasional</h4>
              <div className="space-y-2 text-amber-800">
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

          {/* Copyright */}
          <div className="border-t border-amber-300 mt-8 pt-6 text-center">
            <p className="text-amber-800">
              &copy; 2024 de.amoura. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Color Selection Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-amber-100">
            <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <h3 className="font-bold text-lg">Pilih Warna</h3>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedColor(null);
                }}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <img 
                  src={selectedColor ? selectedColor.image : selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-xl mb-4 transition-all duration-300"
                />
                <h4 className="text-xl font-bold text-amber-900 mb-2">{selectedProduct.name}</h4>
                <p className="text-amber-700 text-sm mb-2">{selectedProduct.description}</p>
                <p className="text-2xl font-bold text-amber-600">{selectedProduct.price}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-amber-800 mb-3">Pilih Warna:</p>
                <div className="grid grid-cols-5 gap-3">
                  {selectedProduct.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`relative aspect-square rounded-lg transition-all duration-200 ${
                        selectedColor?.name === color.name 
                          ? 'ring-4 ring-amber-500 scale-110' 
                          : 'hover:scale-105 ring-2 ring-amber-200'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor?.name === color.name && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-center mt-3 text-sm font-medium text-amber-800">
                    Warna terpilih: <span className="text-amber-600">{selectedColor.name}</span>
                  </p>
                )}
              </div>

              <a
                href={selectedProduct.tokopediaLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-center py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedColor
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg'
                    : 'bg-amber-200 text-amber-500 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  if (!selectedColor) {
                    e.preventDefault();
                  }
                }}
              >
                {selectedColor ? 'Beli di Tokopedia' : 'Pilih warna terlebih dahulu'}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chatbot Button */}
      {!showChatbot && (
        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chatbot Window */}
      {showChatbot && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-amber-100">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
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

          {/* Chat Messages */}
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
                      : 'bg-amber-100 text-amber-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-amber-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1 px-4 py-2 border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-amber-900 placeholder-amber-400"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-2 rounded-full hover:from-amber-600 hover:to-amber-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HijabCatalog;
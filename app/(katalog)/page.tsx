"use client";
import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Search, X, Send, Instagram, Phone, MapPin } from 'lucide-react';

interface Color {
  name: string;
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
      name: 'Hijab Bella Square Segi Empat',
      category: 'Segi Empat',
      price: 'Rp 25.000',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura/deamoura-hijab-bella-square-segi-empat-muslim-1731034641052173528?extParam=src%3Dshop%26whid%3D18851891&aff_unique_id=&channel=others&chain_key=',
      description: 'Bella Square adalah produk yang dapat membantu mengurangi rasa sakit pada area yang digunakan. Produk ini memiliki desain yang ergonomis dan mudah digunakan.',
      colors: [
        { name: 'Blush Pink', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80' },
        { name: 'Pink', image: 'https://images.unsplash.com/photo-1580626808041-fab7f47f4e56?w=500&q=80' },
        { name: 'Dusty Pink', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&q=80' },
        { name: 'Denim', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80' },
        { name: 'Light Grey', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' },
        { name: 'Dark Grey', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' },
        { name: 'Grey', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' },
        { name: 'Black', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' },
        { name: 'Lilac', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' },
        { name: 'Olive Green', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' },
        { name: 'Caramel', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' },
        { name: 'Peach', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' },
        { name: 'Mustard', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' },
        { name: 'Coffe', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' }
      ]
    },
    {
      id: 2,
      name: 'Pashmina Airflow',
      category: 'Pashmina',
      price: 'Rp 55.500',
      image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura/deamoura-pashmina-airflow-cocok-untuk-lebaran-bahan-lembut-meleyot-payet-dewasa-kerudung-syari-instan-karet-muslim-jilbab-mutiara-wanita-1730971145350186200?extParam=src%3Dshop%26whid%3D18851891&aff_unique_id=&channel=others&chain_key=',
      description: 'Pashmina Airflow adalah produk yang dijual dengan bahan yang ringan dan mudah menyerap keringat sehingga nyaman digunakan dalam waktu lama.',
      colors: [
        { name: 'Milo', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80' },
        { name: 'Sand', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Taupe', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80' },
        { name: 'Latte', image: 'https://images.unsplash.com/photo-1601925259926-2b5d6c64dbb1?w=500&q=80' },
        { name: 'Creamy', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&q=80' },
        { name: 'Milky', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&q=80' }
      ]
    },
    {
      id: 3,
      name: 'Hijab motif Segi Empat',
      category: 'Segi Empat',
      price: 'Rp 44.000',
      image: 'https://www.hijup.com/magazine/wp-content/uploads/2024/10/0cf58685-jilbab-segiempat-motif-mewah.jpg',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura/hijab-motif-edisi-terbaru-dari-produk-de-amoura-kerudung-segi-empat-square-muslim-1730855332409476312?extParam=src%3Dshop%26whid%3D18851891&aff_unique_id=&channel=others&chain_key=',
      description: 'Hijab motif adalah jenis hijab yang memiliki pola atau desain tertentu yang tercetak pada permukaan kainnya.',
      colors: [
        { name: 'De Black Brown', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'De Light Grey', image: 'https://images.unsplash.com/photo-1580626808041-fab7f47f4e56?w=500&q=80' },
        { name: 'De Dark Grey', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80' },
        { name: 'De Blue', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&q=80' }
      ]
    },
    {
      id: 4,
      name: 'Pashmina Rayon',
      category: 'Pashmina',
      price: 'Rp 40.000',
      image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura/de-amoura-jilbab-pashmina-rayon-hijab-meleyot-pashmina-kaos-rayon-muslim-wanita-kerudung-1730873813270693080?extParam=src%3Dshop%26whid%3D18851891&aff_unique_id=&channel=others&chain_key=',
      description: 'Pashmina rayon adalah selendang atau jilbab yang terbuat dari serat rayon, yang lembut, ringan, dan nyaman dipakai.',
      colors: [
        { name: 'Light Grey', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' },
        { name: 'Dusty Pastel', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80' },
        { name: 'Khaki', image: 'https://images.unsplash.com/photo-1601925259926-2b5d6c64dbb1?w=500&q=80' },
        { name: 'Black', image: 'https://images.unsplash.com/photo-1580626808041-fab7f47f4e56?w=500&q=80' }
      ]
    },
    {
      id: 5,
      name: 'Plain Square Segi Empat',
      category: 'Segi Empat',
      price: 'Rp 26.500',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura/deamoura-hijab-bella-square-segi-empat-muslim-1731034641052173528?extParam=src%3Dshop%26whid%3D18851891&aff_unique_id=&channel=others&chain_key=',
      description: 'Plain Square Hijab adalah jenis hijab yang sangat sederhana, elegan, dan serbaguna. Hijab ini berbentuk segi empat yang tidak memiliki jahitan rapi, hanya terdiri dari beberapa warna.',
      colors: [
        { name: 'Pine', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80' },
        { name: 'White', image: 'https://images.unsplash.com/photo-1580626808041-fab7f47f4e56?w=500&q=80' },
        { name: 'Broken White', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&q=80' }
      ]
    },
    {
      id: 6,
      name: 'Paris Premium Segi Empat',
      category: 'Segi Empat',
      price: 'Rp 25.000',
      image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura',
      description: 'Paris Premium adalah produk yang memiliki kualitas premium dan terbuat dari bahan-bahan berkualitas tinggi.',
      colors: [
        { name: 'Green Tea', image: 'https://images.unsplash.com/photo-1610652457783-7244ac3db48c?w=500&q=80' },
        { name: 'Toska', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80' },
        { name: 'Lilac', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Mustard', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80' },
        { name: 'Dusty Pink', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Stone', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Coklat Tua', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Mocca', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Broken White', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'White', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Dark Olive', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Black', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Latte', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Red', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Sage', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Frapuchino', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Khaki', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Sky Blue', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' },
        { name: 'Sand', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80' }
      ]
    },
    {
      id: 7,
      name: 'Paris Jadul Segi Empat',
      category: 'Segi Empat',
      price: 'Rp 26.500',
      image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&q=80',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura',
      description: 'Hijab Paris Jadul umumnya terbuat dari kain yang ringan dan lembut, memberikan kenyamanan saat dipakai.',
      colors: [
        { name: 'Mocca Muda', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80' },
        { name: 'Green Milieu', image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=500&q=80' }
      ]
    },
    {
      id: 8,
      name: 'Paris Japan Segi Empat',
      category: 'Segi Empat',
      price: 'Rp 60.000',
      image: 'https://down-id.img.susercontent.com/file/aeb50bc9a3f7d602624104fd0cee7f04',
      tokopediaLink: 'https://www.tokopedia.com/de-amoura',
      description: 'Koleksi eksklusif produk original dari Paris dan Jepang dengan jaminan kualitas premium dan daya tahan optimal.',
      colors: [
        { name: 'Nude', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=500&q=80' },
        { name: 'Ash', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&q=80' },
        { name: 'Blush', image: 'https://images.unsplash.com/photo-1580626808041-fab7f47f4e56?w=500&q=80' }
      ]
    },
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
    // Latar belakang diubah menjadi gradien 'orange' yang lebih gelap (coklat)
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 text-orange-900">
      
      {/* Header diubah menjadi warna coklat yang lebih gelap */}
      <header className="bg-amber-800 shadow-lg sticky top-0 z-40 text-white bg-linear-to-r from-amber-700 to-amber-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {/* Logo placeholder, dengan latar belakang terang untuk kontras */}
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-orange-600">
                  {/* Gambar placeholder dengan tema coklat agar sesuai */}
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

            {/* CTA Button diubah ke coklat yang lebih terang dengan teks warna putih */}
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

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-orange-900 mb-3">Koleksi Hijab Premium</h2>
          <p className="text-orange-700 max-w-2xl mx-auto">
            Temukan berbagai pilihan hijab berkualitas tinggi dengan desain modern dan elegan untuk melengkapi penampilanmu
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8">
          <div className="flex justify-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5 focus:text-orange-800" />
              <input
                type="text"
                placeholder="Cari produk hijab berdasarkan nama, kategori, atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // Warna border dan ring diubah ke 'orange'
                className="w-full pl-10 pr-4 py-3 border border-orange-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-transparent text-orange-900 placeholder-orange-500 focus:placeholder-transparent"
              />
            </div>
          </div>
          
          {/* Search Info */}
          {searchQuery && (
            <div className="text-center mt-4">
              <p className="text-sm text-orange-700">
                Menampilkan {filteredProducts.length} produk untuk pencarian "{searchQuery}"
                {filteredProducts.length === 0 && (
                  <span className="block mt-1 text-orange-600">
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
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-200"
            >
              <div className="relative overflow-hidden h-64">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                {/* Badge diubah menjadi warna coklat yang lebih gelap */}
                <div className="absolute top-3 right-3 bg-orange-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-orange-900 mb-2">{product.name}</h3>
                <p className="text-orange-700 text-sm mb-3">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-orange-800">{product.price}</span>
                </div>
                {/* Tombol diubah menjadi coklat gelap */}
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setSelectedColor(null);
                  }}
                  className="block w-full bg-amber-700 text-white text-center py-3 rounded-xl hover:bg-orange-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
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
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto border border-orange-200">
              <Search className="w-16 h-16 text-orange-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-orange-900 mb-2">Produk tidak ditemukan</h3>
              <p className="text-orange-700 mb-4">
                Tidak ada produk yang cocok dengan pencarian "{searchQuery}"
              </p>
              {/* Tombol diubah menjadi coklat gelap */}
              <button
                onClick={() => setSearchQuery('')}
                className="bg-orange-800 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-all duration-300"
              >
                Tampilkan Semua Produk
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer diubah menjadi coklat gelap */}
      <footer className="bg-amber-800 text-orange-300 py-7 bg-linear-to-r from-amber-700 to-amber-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
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
                Menyediakan berbagai koleksi hijab berkualitas tinggi dengan desain modern dan elegan untuk penampilan muslimah yang stylish.
              </p>
            </div>

            {/* Contact Info */}
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

            {/* Business Hours */}
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

          {/* Copyright */}
          <div className="border-t border-orange-200 mt-8 pt-6 text-center">
            <p className="text-orange-200">
              &copy; 2024 de.amoura. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Color Selection Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-orange-800">
            {/* Modal Header diubah menjadi coklat gelap */}
            <div className="sticky top-0 bg-orange-800 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <h3 className="font-bold text-lg">Pilih Warna</h3>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedColor(null);
                }}
                className="hover:bg-orange-700 p-1 rounded-full transition-colors"
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
                <h4 className="text-xl font-bold text-orange-900 mb-2">{selectedProduct.name}</h4>
                <p className="text-orange-700 text-sm mb-2">{selectedProduct.description}</p>
                <p className="text-2xl font-bold text-orange-800">{selectedProduct.price}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-orange-800 mb-3">Pilih Warna:</p>
                <div className="grid grid-cols-5 gap-3">
                  {selectedProduct.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      // Warna ring diubah ke coklat gelap
                      className={`relative aspect-square rounded-lg transition-all duration-200 ${
                        selectedColor?.name === color.name 
                          ? 'ring-4 ring-orange-800 scale-110' 
                          : 'hover:scale-105 ring-2 ring-orange-200'
                      }`}

                      // belum ada warna untuk dibagian pemilihan warna produk
                      // style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor?.name === color.name && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                            {/* Dot diubah menjadi coklat gelap */}
                            <div className="w-2 h-2 bg-orange-800 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-center mt-3 text-sm font-medium text-orange-800">
                    Warna terpilih: <span className="text-orange-900">{selectedColor.name}</span>
                  </p>
                )}
              </div>

              <a
                href={selectedProduct.tokopediaLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-center py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedColor
                    ? 'bg-gradient-to-r from-amber-700 to-amber-800 text-white hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg'
                    : 'bg-amber-600 text-white cursor-not-allowed'
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
          className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chatbot Window */}
      {showChatbot && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-amber-800">
          {/* Chat Header */}
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
                      : 'bg-amber-600 text-amber-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
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
    </div>
  );
};

export default HijabCatalog;

// src/app/(admin)/admin/products/add/page.tsx
"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Save, X, Plus, Image as ImageIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductVariant {
  id: string; // Ubah ke string biar lebih aman pakai random ID
  name: string;
  image: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const variantInputRef = useRef<HTMLInputElement>(null);
  
  // State Foto Utama
  const [mainImage, setMainImage] = useState<string>(""); 
  
  // State Form Utama
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pashmina',
    price: '',
    stock: '',
    description: '',
  });

  // State Varian
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // --- HELPER: Convert File to Base64 ---
  const convertToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.onerror = (error) => reject(error);
    });
  };

  // --- HANDLER FOTO UTAMA ---
  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("Maksimal 2MB");
      const base64 = await convertToBase64(file);
      setMainImage(base64);
    }
  };

  // --- HANDLER BULK UPLOAD VARIAN (BISA BANYAK) ---
  const handleBulkVariantUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Batasi jumlah file sekali upload biar gak nge-lag
    if (files.length > 20) return alert("Maksimal upload 20 foto sekaligus.");

    const newVariants: ProductVariant[] = [];
    const fileArray = Array.from(files); // Ubah FileList jadi Array biasa

    // Proses konversi semua file secara paralel
    const promises = fileArray.map(async (file) => {
        // Cek ukuran
        if (file.size > 2 * 1024 * 1024) return null; // Skip file gede

        const base64 = await convertToBase64(file);
        
        // Ambil nama file, buang ekstensinya (.jpg/.png)
        // Contoh: "dusty-pink.jpg" -> "dusty-pink"
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/-/g, " ");

        return {
            id: Math.random().toString(36).substr(2, 9), // ID Unik Random
            name: cleanName, // Nama otomatis dari nama file (bisa diedit nanti)
            image: base64
        };
    });

    // Tunggu semua selesai convert
    const results = await Promise.all(promises);

    // Filter yang null (gagal/kegedean) lalu masukkan ke state
    const validResults = results.filter((v): v is ProductVariant => v !== null);
    
    setVariants((prev) => [...prev, ...validResults]);

    // Reset input file agar bisa upload file yang sama lagi kalau mau
    if (variantInputRef.current) variantInputRef.current.value = "";
  };

  // Update Nama Varian (karena nama dari file mungkin jelek)
  const updateVariantName = (id: string, newName: string) => {
    setVariants(variants.map(v => v.id === id ? { ...v, name: newName } : v));
  };

  // Hapus Varian
  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainImage) return alert("Foto utama produk wajib diisi!");
    if (variants.length === 0) return alert("Minimal masukan satu varian warna!");

    setIsLoading(true);

    const finalData = {
      ...formData,
      id: Date.now(),
      image: mainImage,
      variants: variants,
    };

    console.log("DATA BULK SIAP SIMPAN:", finalData);

    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
    existingProducts.push(finalData);
    localStorage.setItem('products', JSON.stringify(existingProducts));

    setTimeout(() => {
      alert("Produk berhasil ditambahkan!");
      setIsLoading(false);
      router.push('/admin/products');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto pb-10 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Tambah Produk Baru</h2>
          <p className="text-gray-500 text-sm">Masukan foto produk berdasarkan varian warnanya.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* =======================
              KOLOM KIRI: FOTO & VARIAN
             ======================= */}
          <div className="space-y-8">
            
            {/* 1. FOTO UTAMA */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto Sampul Utama</label>
                <div className={`relative w-full aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center overflow-hidden transition-colors ${mainImage ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'}`}>
                    {mainImage ? (
                        <>
                            <Image src={mainImage} alt="Cover" fill className="object-cover" />
                            <button type="button" onClick={() => setMainImage("")} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full z-20 shadow-sm hover:bg-red-600 transition-colors">
                                <X size={18} />
                            </button>
                        </>
                    ) : (
                        <div className="p-6">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600 font-medium">Klik untuk upload foto sampul</p>
                            <input type="file" accept="image/*" onChange={handleMainImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        </div>
                    )}
                </div> 
            </div>

            {/* 2. BULK UPLOAD VARIAN (FITUR BARU) */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-slate-800">Varian Warna ({variants.length})</label>
                    
                    {/* Tombol Upload Banyak */}
                    <div className="relative">
                        <button type="button" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors">
                            <Plus size={16} />
                            Upload Foto
                        </button>
                        <input 
                            type="file" 
                            multiple // <--- INI KUNCINYA (BISA PILIH BANYAK)
                            accept="image/*"
                            ref={variantInputRef}
                            onChange={handleBulkVariantUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
                
                {/* LIST VARIAN (GRID LAYOUT) */}
                {variants.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-white/50">
                        <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Belum ada varian.</p>
                        <p className="text-xs text-gray-400">Klik tombol di atas untuk upload banyak foto sekaligus.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                        {variants.map((variant) => (
                            <div key={variant.id} className="relative bg-white p-2 rounded-lg border border-gray-200 shadow-sm group hover:border-amber-400 transition-all">
                                {/* Thumbnail */}
                                <div className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-100 mb-2">
                                    <Image src={variant.image} alt={variant.name} fill className="object-cover" />
                                    {/* Tombol Hapus per Item */}
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveVariant(variant.id)}
                                        className="absolute top-1 right-1 bg-white/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                
                                {/* Input Nama Warna (Bisa diedit) */}
                                <input 
                                    type="text" 
                                    value={variant.name}
                                    onChange={(e) => updateVariantName(variant.id, e.target.value)}
                                    className="w-full text-xs font-medium text-center border border-transparent hover:border-gray-300 focus:border-amber-500 focus:bg-white bg-transparent rounded px-1 py-1 outline-none transition-all placeholder-gray-400"
                                    placeholder="Nama Warna"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

          </div>

          {/* =======================
              KOLOM KANAN: DETAIL INFO
             ======================= */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Contoh: Pashmina Plisket Premium" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                  <option value="Pashmina">Pashmina</option>
                  <option value="Segi Empat">Segi Empat</option>
                  <option value="Bergo">Bergo</option>
                  <option value="Khimar">Khimar</option>
                  <option value="Sport">Sport</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stok Total</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Contoh: 85000" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Lengkap</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={8} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none" placeholder="Jelaskan detail produk..."></textarea>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button type="submit" disabled={isLoading} className="w-full sm:w-auto px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-200/50">
                    {isLoading ? 'Menyimpan...' : <><Save size={20} /> Simpan Produk</>}
                </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
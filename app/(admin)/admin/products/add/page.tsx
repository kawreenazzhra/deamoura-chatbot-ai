// src/app/(admin)/admin/products/add/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Save, X, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Tipe data untuk warna
interface ColorVariant {
  name: string;
  hex: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // State Gambar
  const [imageBase64, setImageBase64] = useState<string>(""); 
  
  // State Utama Form
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pashmina',
    price: '',
    stock: '',
    description: '',
  });

  // --- STATE BARU: Varian Warna ---
  const [colors, setColors] = useState<ColorVariant[]>([]);
  const [tempColor, setTempColor] = useState({ name: '', hex: '#000000' });

  // Fungsi Convert Gambar ke Base64
  const convertToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.onerror = (error) => reject(error);
    });
  };

  // Handle Input Text Biasa
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Upload Gambar
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 2MB.");
        return;
      }
      const base64String = await convertToBase64(file);
      setImageBase64(base64String);
    }
  };

  const removeImage = () => setImageBase64("");

  // --- LOGIKA WARNA ---
  
  // 1. Tambah Warna ke List
  const handleAddColor = () => {
    if (!tempColor.name.trim()) return alert("Nama warna tidak boleh kosong!");
    
    // Cek duplikat
    if (colors.some(c => c.name.toLowerCase() === tempColor.name.toLowerCase())) {
        return alert("Warna ini sudah ada di daftar!");
    }

    setColors([...colors, tempColor]);
    setTempColor({ name: '', hex: '#000000' }); // Reset input kecil
  };

  // 2. Hapus Warna dari List
  const handleRemoveColor = (indexToRemove: number) => {
    setColors(colors.filter((_, index) => index !== indexToRemove));
  };

  // Handle Submit Akhir
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (colors.length === 0) {
        alert("Mohon masukan minimal satu varian warna!");
        return;
    }

    setIsLoading(true);

    const finalData = {
      ...formData,
      id: Date.now(),
      image: imageBase64,
      colors: colors, // Data warna ikut tersimpan disini
    };

    console.log("DATA LENGKAP SIAP SIMPAN:", finalData);

    // Simulasi Simpan ke LocalStorage
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
    <div className="max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Tambah Produk Baru</h2>
          <p className="text-gray-500 text-sm">Masukan informasi detail produk hijab.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* KOLOM KIRI: Foto & Warna */}
          <div className="space-y-6">
            
            {/* 1. Upload Gambar */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto Utama</label>
                <div className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors ${imageBase64 ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'}`}>
                    
                    {imageBase64 ? (
                        <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                            <Image src={imageBase64} alt="Preview" fill className="object-cover" />
                            <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full z-20 group-hover:opacity-100 transition-opacity">
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="py-8 w-full">
                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600">Klik untuk upload</p>
                        </div>
                    )}

                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                </div> 
            </div>

            {/* 2. Input Varian Warna (DIPERBARUI) */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative z-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">Varian Warna Tersedia</label>
                
                {/* LOGIKA FIX OFFSET: 
                   1. 'items-center' = Paksa rata tengah vertikal.
                   2. Hapus 'py-2' dari input teks, ganti dengan 'h-10' (40px).
                   3. Bungkus Color Picker dengan div agar bordernya konsisten dengan input teks.
                */}
                <div className="flex gap-2 mb-3 items-center h-10 flex-nowrap">
                    
                    {/* A. Picker Visual */}
                    <div className="relative w-10 h-10 rounded-lg border border-gray-300 overflow-hidden flex-shrink-0 cursor-pointer shadow-sm hover:border-amber-500 transition-colors">
                        <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: tempColor.hex }} />
                        <input 
                            type="color" 
                            value={tempColor.hex}
                            onChange={(e) => setTempColor({...tempColor, hex: e.target.value})}
                            className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 opacity-0 cursor-pointer"
                        />
                    </div>

                    {/* B. Input Kode Hex */}
                    <input 
                        type="text" 
                        value={tempColor.hex}
                        onChange={(e) => {
                            let val = e.target.value;
                            if (!val.startsWith('#')) val = '#' + val.replace('#', '');
                            if (val.length <= 7) setTempColor({ ...tempColor, hex: val });
                        }}
                        className="w-24 md:w-28 h-10 px-3 border border-gray-300 rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-amber-500 outline-none flex-shrink-0"
                        placeholder="#000000"
                    />

                    {/* C. Input Nama Warna (Ini yang akan memanjang otomatis) */}
                    <input 
                        type="text" 
                        placeholder="Nama (ex: Dusty Pink)"
                        value={tempColor.name}
                        onChange={(e) => setTempColor({...tempColor, name: e.target.value})}
                        className="flex-1 min-w-[100px] h-10 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                    />

                    {/* D. Tombol Tambah */}
                    <button 
                        type="button"
                        onClick={handleAddColor}
                        className="h-10 w-10 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center flex-shrink-0"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* List Warna (Chips) */}
                <div className="flex flex-wrap gap-2 min-h-[24px]">
                    {colors.length === 0 && <p className="text-xs text-gray-400 italic pt-1">Belum ada warna dipilih.</p>}
                    
                    {colors.map((color, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white border border-gray-200 pl-2 pr-1 py-1 rounded-full shadow-sm animate-in fade-in zoom-in duration-200">
                            <div className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: color.hex }}></div>
                            <span className="text-sm text-gray-700 font-medium">
                                {color.name} <span className="text-xs text-gray-400 font-normal ml-0.5">({color.hex})</span>
                            </span>
                            <button 
                                type="button" 
                                onClick={() => handleRemoveColor(index)}
                                className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

          </div>

          {/* KOLOM KANAN: Detail Produk */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Contoh: Pashmina Plisket" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                  <option value="Pashmina">Pashmina</option>
                  <option value="Segi Empat">Segi Empat</option>
                  <option value="Bergo">Bergo</option>
                  <option value="Khimar">Khimar</option>
                  <option value="Sport">Sport</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stok Total</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Contoh: 85000" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none" placeholder="Deskripsi produk..."></textarea>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button type="submit" disabled={isLoading} className="px-8 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-amber-200/50">
            {isLoading ? 'Menyimpan...' : <><Save size={18} /> Simpan Produk</>}
          </button>
        </div>
      </form>
    </div>
  );
}
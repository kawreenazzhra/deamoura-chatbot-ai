// src/app/(admin)/admin/products/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Untuk redirect setelah save
import { ArrowLeft, Save, Trash } from 'lucide-react';
import Link from 'next/link';

// Definisi tipe data (opsional, biar rapi)
interface ProductData {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  image: string;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk menampung data form
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: '',
  });

  // SIMULASI: Mengambil data barang berdasarkan ID saat halaman dibuka
  useEffect(() => {
    // Ceritanya kita fetch data dari database berdasarkan params.id
    // Di sini kita isi data palsu dulu biar terlihat ada isinya
    setFormData({
      name: 'Pashmina Premium Silk',
      category: 'Pashmina',
      price: '89000',
      stock: '15',
      description: 'Pashmina bahan silk premium yang sangat lembut dan mudah diatur.',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa',
    });
  }, [params.id]);

  // Handle perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle saat tombol Simpan ditekan
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi loading save ke database
    setTimeout(() => {
      alert("Data berhasil diperbarui! (Simulasi)");
      setIsLoading(false);
      router.push('/admin/products'); // Kembali ke tabel
    }, 1000);
  };

  const handleDelete = () => {
    if (confirm("PERINGATAN: Apakah Anda yakin ingin menghapus produk ini?")){
        setIsLoading(true);
        // Simulasi loading delete dari database
        
        setTimeout(() => {
          alert("Produk berhasil dihapus! (Simulasi)");
          setIsLoading(false);
          router.push('/admin/products'); // Kembali ke tabel
        }, 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Halaman */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/admin/products" 
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Edit Produk</h2>
          <p className="text-gray-500 text-sm">ID Produk: {params.id}</p>
        </div>
      </div>

      {/* Form Edit */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Nama Produk */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              placeholder="Contoh: Pashmina Plisket"
              required
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
            >
              <option value="Pashmina">Pashmina</option>
              <option value="Segi Empat">Segi Empat</option>
              <option value="Bergo">Bergo</option>
              <option value="Khimar">Khimar</option>
              <option value="Sport">Sport</option>
            </select>
          </div>

          {/* Stok */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stok</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Harga */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Link Gambar */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Gambar</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="https://..."
            />
          </div>

          {/* Deskripsi */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
            ></textarea>
          </div>

        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <button 
                type="button"
                className="px-6 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
                <Trash size={18} />
                Hapus Produk
            </button>
            <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm shadow-amber-200"
            >
                {isLoading ? 'Menyimpan...' : (
                    <>
                        <Save size={18} />
                        Simpan Perubahan
                    </>
                )}
            </button>
        </div>

      </form>
    </div>
  );
}
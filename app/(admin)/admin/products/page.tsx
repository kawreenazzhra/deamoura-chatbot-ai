// src/app/(admin)/admin/products/page.tsx
"use client"; //

import Link from 'next/link';
import { useState } from 'react'; // Kita butuh state
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

// Data dummy dipindah ke variabel luar
const initialProducts = [
  { id: 1, name: 'Pashmina Premium Silk', category: 'Pashmina', price: 'Rp 89.000', stock: 15 },
  { id: 2, name: 'Segi Empat Voal', category: 'Segi Empat', price: 'Rp 65.000', stock: 24 },
  { id: 3, name: 'Bergo Instan Daily', category: 'Bergo', price: 'Rp 55.000', stock: 10 },
  { id: 4, name: 'Khimar Syari', category: 'Khimar', price: 'Rp 125.000', stock: 5 },
];

export default function ProductListPage() {
  // Gunakan state agar saat dihapus, tampilan tabel otomatis berubah
  const [products, setProducts] = useState(initialProducts);

  // --- FUNGSI HAPUS ---
  const handleDelete = (id: number) => {
    // 1. Munculkan konfirmasi (Yakin/Tidak?)
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      
      // 2. Filter produk: Ambil semua produk KECUALI yang id-nya dihapus
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts); // Update tabel
      
      // 3. Pesan sukses
      alert("Produk berhasil dihapus!");
    }
  };

  return (
    <div>
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daftar Produk</h2>
          <p className="text-gray-500 text-sm">Kelola katalog barang de.amoura disini.</p>
        </div>
        
        <Link 
          href="/admin/products/add" 
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Tambah Produk
        </Link>
      </div>

      {/* Tabel Produk */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Search Bar Kecil */}
        <div className="p-4 border-b border-gray-100">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                <input 
                    type="text" 
                    placeholder="Cari nama produk..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Nama Produk</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4">Stok</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
                <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">Tidak ada produk.</td>
                </tr>
            ) : products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{product.name}</td>
                <td className="px-6 py-4 text-slate-500">
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                        {product.category}
                    </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{product.price}</td>
                <td className="px-6 py-4 text-slate-600">{product.stock} pcs</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Tombol Edit */}
                    <Link href={`/admin/products/${product.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <Pencil size={16} />
                    </Link>
                    
                    {/* Tombol Hapus (Sekarang berfungsi!) */}
                    <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
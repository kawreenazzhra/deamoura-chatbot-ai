// src/app/(admin)/admin/products/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Upload, Plus, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductVariant {
  id: string;
  name: string;
  image: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const variantInputRef = useRef<HTMLInputElement>(null);

  // State Data
  const [mainImage, setMainImage] = useState<string>("");
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // --- 1. EXTRACT PRODUCT ID FROM URL & FETCH DATA ---
  useEffect(() => {
    // Extract ID from pathname (e.g., /admin/products/123 -> 123)
    const pathParts = pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    if (!id || isNaN(parseInt(id))) {
      router.push('/admin/products');
      return;
    }

    setProductId(id);

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();

        setMainImage(data.image || '');
        setFormData({
          name: data.name || '',
          category: data.categoryId || '',
          price: data.price?.toString() || '',
          stock: data.stock?.toString() || '',
          description: data.description || '',
        });

        // Parse variants from JSON if it's a string
        let variantsData: ProductVariant[] = [];
        if (data.variants) {
          if (typeof data.variants === 'string') {
            try {
              variantsData = JSON.parse(data.variants) || [];
            } catch (e) {
              console.warn('Failed to parse variants:', e);
              variantsData = [];
            }
          } else if (Array.isArray(data.variants)) {
            variantsData = data.variants;
          }
        }
        setVariants(Array.isArray(variantsData) ? variantsData : []);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        alert('Gagal memuat produk');
        router.push('/admin/products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [pathname, router]);

  // --- HELPER: Convert File to Base64 ---
  const convertToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.onerror = (error) => reject(error);
    });
  };

  // --- HANDLERS (Sama persis dengan halaman Add) ---

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("Maksimal 2MB");
      const base64 = await convertToBase64(file);
      setMainImage(base64);
    }
  };

  const handleBulkVariantUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length > 20) return alert("Maksimal upload 20 foto sekaligus.");

    const promises = Array.from(files).map(async (file) => {
      if (file.size > 2 * 1024 * 1024) return null;
      const base64 = await convertToBase64(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/-/g, " ");
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: cleanName,
        image: base64
      };
    });

    const results = await Promise.all(promises);
    const validResults = results.filter((v): v is ProductVariant => v !== null);
    setVariants((prev) => [...prev, ...validResults]);
    if (variantInputRef.current) variantInputRef.current.value = "";
  };

  const updateVariantName = (id: string, newName: string) => {
    setVariants(variants.map(v => v.id === id ? { ...v, name: newName } : v));
  };

  const handleRemoveVariant = (id: string) => {
    if (confirm("Hapus varian ini?")) {
      setVariants(variants.filter((v) => v.id !== id));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- ACTION BUTTONS ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainImage) return alert("Foto utama wajib ada!");
    if (!formData.name || !formData.price) return alert("Nama dan Harga wajib diisi!");
    if (!productId) return alert("Product ID tidak ditemukan");

    setIsLoading(true);
    try {
      const imageBase64 = mainImage.startsWith('http') || mainImage.startsWith('/')
        ? mainImage
        : mainImage; // Already base64 or path

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          categoryId: formData.category,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0,
          description: formData.description,
          image: imageBase64,
          variants: variants,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update product');
      }

      alert("Produk berhasil diperbarui!");
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productId) return alert("Product ID tidak ditemukan");
    if (confirm("PERINGATAN FINAL: Apakah Anda yakin ingin menghapus produk ini selamanya?")) {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to delete product');
        }

        alert("Produk berhasil dihapus!");
        router.push('/admin/products');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10 px-4">
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
          <p className="text-gray-500 text-sm">Update informasi produk ID: <span className="font-mono text-amber-600">{productId || 'Loading...'}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* =======================
              KOLOM KIRI: FOTO & VARIAN (1 kolom)
             ======================= */}
          <div className="space-y-8 lg:col-span-1">

            {/* 1. FOTO UTAMA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto Sampul Utama</label>
              <div className={`relative w-full aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center overflow-hidden transition-colors ${mainImage ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'}`}>
                {mainImage ? (
                  <>
                    {/* Menggunakan Image next/js dengan handling external url */}
                    <img src={mainImage} alt="Cover" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setMainImage("")} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full z-20 shadow-sm hover:bg-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </>
                ) : (
                  <div className="p-6">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 font-medium">Klik untuk ganti foto sampul</p>
                    <input type="file" accept="image/*" onChange={handleMainImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  </div>
                )}
              </div>
            </div>

            {/* 2. BULK UPLOAD VARIAN */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-slate-800">Varian Warna ({variants.length})</label>
                <div className="relative">
                  <button type="button" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors">
                    <Plus size={16} />
                    Tambah Foto
                  </button>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={variantInputRef}
                    onChange={handleBulkVariantUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* LIST VARIAN GRID */}
              {variants.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-white/50">
                  <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Belum ada varian.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                  {variants.map((variant) => (
                    <div key={variant.id} className="relative bg-white p-2 rounded-lg border border-gray-200 shadow-sm group hover:border-amber-400 transition-all">
                      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-100 mb-2">
                        <img src={variant.image} alt={variant.name} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(variant.id)}
                          className="absolute top-1 right-1 bg-white/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => updateVariantName(variant.id, e.target.value)}
                        className="w-full text-xs font-medium text-center border border-transparent hover:border-gray-300 focus:border-amber-500 focus:bg-white bg-transparent rounded px-1 py-1 outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* =======================
              KOLOM KANAN: DETAIL INFO (2 kolom)
             ======================= */}
          <div className="space-y-6 lg:col-span-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stok Total</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Lengkap</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={8} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"></textarea>
            </div>

            {/* Footer Tombol Edit & Hapus */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 border border-transparent hover:border-red-100"
              >
                <Trash2 size={20} />
                Hapus Produk
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-200/50"
              >
                {isLoading ? 'Menyimpan...' : (
                  <>
                    <Save size={20} />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
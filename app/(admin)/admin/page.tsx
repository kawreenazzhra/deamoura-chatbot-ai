// src/app/(admin)/admin/page.tsx
export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
      
      {/* Kartu Statistik Sederhana */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total Produk</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">120</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Kategori</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">8</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Pengunjung Hari Ini</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">45</p>
        </div>
      </div>
    </div>
  );
}
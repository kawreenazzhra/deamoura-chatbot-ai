// src/app/(admin)/admin/page.tsx
export default function AdminDashboard() {
  // Dummy stats for display
  const stats = {
    totalProducts: 120,
    totalCategories: 8,
    activeAdmin: 'Active'
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-classik-strong mb-6">Dashboard Overview</h2>

      {/* Kartu Statistik Sederhana */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-classik/20">
          <h3 className="text-muted-foreground font-medium mb-2">Total Produk</h3>
          <p className="text-3xl font-bold text-classik-strong">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-classik/20">
          <h3 className="text-muted-foreground font-medium mb-2">Total Kategori</h3>
          <p className="text-3xl font-bold text-classik-strong">{stats.totalCategories}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-classik/20">
          <h3 className="text-muted-foreground font-medium mb-2">Admin</h3>
          <p className="text-3xl font-bold text-classik-strong">Active</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-classik/20">
        <h2 className="text-xl font-bold text-classik-strong mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <button className="premium-gradient text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all font-medium">
            + Tambah Produk Baru
          </button>
        </div>
      </div>
    </div>
  );
}
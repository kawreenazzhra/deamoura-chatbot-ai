// src/app/(admin)/layout.tsx
'use client'

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, LogOut, ShoppingBag } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()
  const pathname = usePathname() // Ambil URL sekarang
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Cek apakah user sedang berada di halaman login
  // Sesuaikan '/login' ini dengan URL halaman login admin kamu
  const isLoginPage = pathname === '/login'; 

  useEffect(() => {
    // Kalo lagi di halaman Login, STOP! Jangan cek auth, biarkan user ngetik password.
    if (isLoginPage) {
        setIsLoading(false);
        return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/check-auth')
        if (res.ok) {
          setIsAuth(true)
        } else {
          router.push('/login') // Lempar ke login kalau belum auth
        }
      } catch (e) {
        console.error('Auth check failed', e)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, isLoginPage])

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; max-age=0'
    router.push('/login')
  }

  // --- TAMPILAN KHUSUS HALAMAN LOGIN ---
  // Kalau ini halaman login, tampilkan POLOSAN (tanpa Sidebar)
  if (isLoginPage) {
    return <main className="min-h-screen bg-background">{children}</main>
  }

  // --- TAMPILAN ADMIN PANEL (DENGAN SIDEBAR) ---
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuth) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* SIDEBAR (Hanya muncul kalau BUKAN halaman login) */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex-shrink-0 hidden md:block border-r border-sidebar-border/40">
        <div className="p-6 border-b border-sidebar-border/20 flex items-center gap-3">
          <div className="w-8 h-8 premium-gradient rounded-full flex items-center justify-center font-bold text-white shadow-md">
            D
          </div>
          <h1 className="text-xl font-bold font-serif">Admin Panel</h1>
        </div>

        <nav className="mt-6 px-4 space-y-2 flex flex-col h-[calc(100vh-120px)]">
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors">
            <Package size={20} />
            <span>Kelola Produk</span>
          </Link>

          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors mt-auto border-t border-sidebar-border/20 pt-4">
            <ShoppingBag size={20} />
            <span>Lihat Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* KONTEN KANAN */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  )
}
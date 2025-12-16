// src/app/(admin)/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, LogOut, ShoppingBag } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/check-auth')
        if (res.ok) {
          setIsAuth(true)
        } else {
          router.push('/admin-login')
        }
      } catch (e) {
        console.error('Auth check failed', e)
        router.push('/admin-login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    // Clear token and redirect
    document.cookie = 'admin_token=; path=/; max-age=0'
    router.push('/admin-login')
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuth) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR (Menu Kiri) */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:block">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center font-bold text-slate-900">
            D
          </div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        <nav className="mt-6 px-4 space-y-2 flex flex-col h-[calc(100vh-120px)]">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Package size={20} />
            <span>Kelola Produk</span>
          </Link>

          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors mt-auto">
            <ShoppingBag size={20} />
            <span>Lihat Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* KONTEN UTAMA (Kanan) */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  )
}
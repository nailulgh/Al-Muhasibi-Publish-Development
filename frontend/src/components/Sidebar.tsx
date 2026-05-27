'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, Image as ImageIcon, Settings, LogOut, Menu, X, Home } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Jadwal', href: '/admin/schedules', icon: Calendar },
  { name: 'Galeri', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Profil', href: '/admin/profile', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  // Close sidebar when navigating on mobile
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Header / Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--foreground)] border-b border-[var(--border-color)] flex items-center justify-between px-4 z-50 shadow-sm">
        <h1 className="text-lg font-bold text-[var(--accent-olive)] font-heading">
          Admin Panel
        </h1>
        <button
          className="p-2 text-[var(--accent-olive)] hover:bg-[var(--background)] rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[55] md:hidden animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-[var(--foreground)] border-r border-[var(--border-color)] flex flex-col h-screen fixed left-0 top-0 z-[60] transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-[var(--border-color)] hidden md:block">
          <h1 className="text-xl font-bold text-[var(--accent-olive)] font-heading">
            Admin Panel
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">Mabna Al-Muhasibi</p>
        </div>

        {/* Mobile Header spacer inside sidebar (optional, or just reuse same look) */}
        <div className="md:hidden p-6 border-b border-[var(--border-color)] flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--accent-olive)] font-heading">
              Admin Panel
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">Mabna Al-Muhasibi</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden">
            <X className="w-6 h-6 text-[var(--text-secondary)]" />
          </button>
        </div>


        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Public Menu */}
          <div>
            <div className="px-4 mb-2 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Menu Publik
            </div>
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--accent-olive)]/10 hover:text-[var(--accent-olive)] transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Beranda</span>
            </Link>
          </div>

          {/* Admin Menu */}
          <div>
            <div className="px-4 mb-2 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Menu Admin
            </div>
            <div className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                      ? 'bg-[var(--accent-olive)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--accent-olive)]/10 hover:text-[var(--accent-olive)]'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-[var(--border-color)]">
          <button
            onClick={async () => {
              const supabase = createClient()
              await supabase.auth.signOut()
              router.push('/login')
              router.refresh()
            }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  )
}

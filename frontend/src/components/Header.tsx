"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { usePathname } from "next/navigation"

import type { User } from "@supabase/supabase-js"

interface HeaderProps {
    user: User | null
}

export function Header({ user }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    // Close mobile menu when route changes
    useEffect(() => {
        if (isMobileMenuOpen) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setIsMobileMenuOpen(false)
        }
    }, [pathname])

    // Hide Header on Admin Dashboard
    if (pathname?.startsWith('/admin')) {
        return null
    }

    const isActive = (path: string) => {
        if (path === "/" && pathname === "/") return true
        if (path !== "/" && pathname.startsWith(path)) return true
        return false
    }

    const navLinks = [
        { name: "Beranda", href: "/" },
        { name: "Profil", href: "/profile" },
        { name: "Galeri", href: "/galeri" },
        { name: "Jadwal", href: "/jadwal" },
        { name: "Kontak", href: "#kontak" },
    ]

    return (
        <header className="bg-[var(--foreground)]/80 backdrop-blur-lg sticky top-0 z-50 border-b border-[var(--border-color)] transition-colors duration-300">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo & Nama */}
                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse text-[var(--accent-olive)]">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full shadow-sm">
                            <Image
                                src="/assets/FotoGeneral/logo.png"
                                alt="Logo Al Muhasibi"
                                fill
                                className="object-cover"
                                suppressHydrationWarning
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold font-heading self-center">AL MUHASIBI</span>
                            <p className="text-xs text-[var(--text-secondary)] leading-tight">
                                UIN Maliki Malang
                            </p>
                        </div>
                    </Link>

                    {/* Navigasi Desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`nav-link ${isActive(link.href) ? "active" : ""}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Tombol Dark Mode & Menu Mobile */}
                    <div className="flex items-center space-x-2">
                        <ThemeToggle />

                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Buka menu"
                                className="p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--border-color)]"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Menu Mobile */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[var(--foreground)] border-t border-[var(--border-color)] max-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <div className="px-3 py-2 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                            Menu 
                        </div>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`nav-link-mobile block px-3 py-2 rounded-md text-base font-medium ${isActive(link.href)
                                    ? "text-[var(--accent-olive)] bg-[var(--accent-olive)]/10"
                                    : "text-[var(--text-secondary)] hover:text-[var(--accent-olive)] hover:bg-[var(--accent-olive)]/5"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )
}


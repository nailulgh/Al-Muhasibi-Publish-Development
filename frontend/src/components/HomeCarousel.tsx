'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'

import type { GalleryItem } from 'shared/types/gallery'

// Default hero slide data
const DEFAULT_HERO_SLIDE = {
    id: 'default-hero',
    title: 'Media Dakwah & Dokumentasi Asrama Al Muhasibi',
    caption: 'Menjadi pusat pengembangan spiritual dan intelektual bagi mahasiswa dalam naungan nilai-nilai Islam, Menghasilkan generasi Ulul Albab',
    image_url: 'https://nozwgjjkecyrpkpybrdf.supabase.co/storage/v1/object/public/profile-images/MusyMuhasibi-1.png',
    category: 'AL MUHASIBI',
    isDefault: true,
}

export default function HomeCarousel({ items }: { items: GalleryItem[] }) {
    const [currentSlide, setCurrentSlide] = useState(0)

    // Combine default slide with gallery items
    const gallerySlides = items.slice(0, 4).map(item => ({ ...item, isDefault: false }))
    const slides = [DEFAULT_HERO_SLIDE, ...gallerySlides]

    useEffect(() => {
        if (slides.length <= 1) return

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [slides.length])

    const goToPrev = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    return (
        <div className="relative w-full min-h-[70vh] md:min-h-0 h-[calc(100vh-80px)] overflow-hidden group">
            {slides.map((item, index) => (
                <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide
                        ? 'opacity-100 z-10 pointer-events-auto'
                        : 'opacity-0 z-0 pointer-events-none'
                        }`}
                >
                    {item.isDefault ? (
                        /* ================ DEFAULT HERO SLIDE ================ */
                        <>
                            {/* Dark background base */}
                            <div className="absolute inset-0 bg-[#2a2a2a]"></div>

                            {/* Watermark logo - large faded in background */}
                            <div className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 w-[280px] md:w-[420px] h-[280px] md:h-[420px] opacity-[0.08]">
                                <Image
                                    src="/assets/FotoGeneral/logo2.png"
                                    alt="Al Muhasibi Logo Watermark"
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Main featured image - positioned on the right */}
                            <div className="absolute right-0 bottom-0 w-full h-full">
                                <Image
                                    src={item.image_url || ''}
                                    alt="Pengurus & Mahasantri Al Muhasibi"
                                    fill
                                    className="object-contain"
                                    priority
                                    sizes="100vw"
                                />
                                {/* Gradient overlay from left for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#2a2a2a] via-[#2a2a2a]/80 to-transparent"></div>
                                {/* Bottom gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a] via-transparent to-[#2a2a2a]/30"></div>
                            </div>

                            {/* Decorative diagonal line */}
                            <div className="absolute bottom-0 left-0 right-0 h-24 z-[5]">
                                <svg viewBox="0 0 1440 96" fill="none" className="w-full h-full" preserveAspectRatio="none">
                                    <path d="M0 96L1440 0V96H0Z" fill="var(--accent-gold)" fillOpacity="0.15" />
                                </svg>
                            </div>

                            {/* Content overlay */}
                            <div className="absolute inset-0 flex items-center z-20 pointer-events-none">
                                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
                                    <div className="max-w-2xl text-white pt-16 md:pt-0">
                                        {/* Category badge */}
                                        <div className="inline-flex items-center gap-2 mb-3 md:mb-5 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)]/40 backdrop-blur-sm">
                                            <div className="relative w-4 h-4 md:w-5 md:h-5">
                                                <Image
                                                    src="/assets/FotoGeneral/logo.png"
                                                    alt="Logo"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <span className="text-[var(--accent-gold)] font-bold text-[10px] md:text-xs uppercase tracking-widest">{item.category}</span>
                                        </div>

                                        {/* Main heading */}
                                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight font-heading mb-4 md:mb-6 drop-shadow-lg">
                                            {item.title}
                                        </h1>

                                        {/* Quote with left border */}
                                        <blockquote className="border-l-4 border-[var(--accent-gold)] pl-4 mb-6 md:mb-8">
                                            <p className="text-sm md:text-lg font-light italic text-gray-300 leading-relaxed line-clamp-3 md:line-clamp-none">
                                                {item.caption}
                                            </p>
                                        </blockquote>

                                        {/* CTA Buttons */}
                                        <div className="flex flex-wrap gap-3 md:gap-4">
                                            <Link
                                                href="/profile"
                                                className="btn bg-[var(--accent-gold)] text-[#423512] hover:brightness-110 rounded-full px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-bold transition-all border-none shadow-lg shadow-[var(--accent-gold)]/20"
                                            >
                                                Tentang Kami
                                            </Link>
                                            <Link
                                                href="/galeri"
                                                className="btn bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-semibold transition-all flex items-center gap-2 hover:translate-x-1"
                                            >
                                                Lihat Galeri <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* ================ GALLERY SLIDES ================ */
                        <>
                            <Image
                                src={item.image_url || '/assets/FotoGeneral/gedungMuhasibi.jpg'}
                                alt={item.title || 'Featured'}
                                fill
                                className="object-cover"
                                priority={index === 0}
                                loading={index === 0 ? undefined : 'lazy'}
                                quality={index === 0 ? 85 : 75}
                                sizes="100vw"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center">
                                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="max-w-4xl text-white transform transition-all duration-700 translate-y-0 opacity-100">

                                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[var(--accent-gold)] text-black font-bold text-xs uppercase tracking-wider">
                                            <span>{item.category}</span>
                                        </div>

                                        <h1 className="text-4xl md:text-6xl font-bold leading-tight font-heading mb-4 drop-shadow-lg">
                                            {item.title || item.caption || 'Selamat Datang di Al Muhasibi'}
                                        </h1>

                                        {item.title && item.caption && (
                                            <p className="text-lg md:text-xl text-gray-200 max-w-2xl line-clamp-2 mb-8 font-light leading-relaxed drop-shadow-md">
                                                {item.caption}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-4">
                                            <Link
                                                href="/galeri"
                                                className="btn bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full px-8 py-3 font-semibold transition-all flex items-center gap-2 hover:translate-x-1"
                                            >
                                                Lihat Galeri <ChevronRight className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href="/profile"
                                                className="btn bg-[var(--accent-gold)] text-[#423512] hover:brightness-110 rounded-full px-8 py-3 font-bold transition-all border-none"
                                            >
                                                Tentang Kami
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ))}

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={goToPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Slide Indicators */}
            {slides.length > 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${idx === currentSlide
                                ? 'w-12 bg-[var(--accent-gold)] shadow-lg shadow-[var(--accent-gold)]/30'
                                : 'w-3 bg-white/40 hover:bg-white/70'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Slide counter */}
            <div className="absolute bottom-10 right-6 z-20 text-white/50 text-sm font-mono">
                <span className="text-white font-semibold">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="mx-1">/</span>
                <span>{String(slides.length).padStart(2, '0')}</span>
            </div>
        </div>
    )
}

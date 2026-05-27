'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, Calendar, Instagram, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import GalleryModal from '@/components/GalleryModal'
import { useGallery } from '@/hooks/useGallery'
import type { GalleryItem } from '@/types/gallery'

const CATEGORIES = ['Semua', 'Fasilitas Fisik', 'Kegiatan Mahasantri', 'Prestasi & Dokumentasi']

export default function GalleryClient({ items: initialData }: { items: GalleryItem[] }) {
  const { data: items } = useGallery(initialData)
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  // Carousel for Featured Items (Take first 5)
  const featuredItems = items.slice(0, 5)
  const [currentSlide, setCurrentSlide] = useState(0)

  const filteredItems = items.filter((item) => {
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory
    const matchSearch =
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.caption || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  // Auto slide effect
  useEffect(() => {
    if (featuredItems.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredItems.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [featuredItems.length])

  return (
    <div className="flex flex-col">
      {/* Featured Carousel / Hero */}
      {featuredItems.length > 0 && (
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden group">
          {featuredItems.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            >
              <Image
                src={item.image_url || '/assets/FotoGeneral/gedungMuhasibi.jpg'}
                alt={item.title || 'Featured'}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white transform transition-transform duration-700 delay-200 translate-y-0">
                <div className="container mx-auto">
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider bg-[var(--accent-gold)] text-black rounded-full">
                    {item.category}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-bold mb-2 font-heading max-w-4xl leading-tight">
                    {item.title || item.caption}
                  </h2>
                  {item.title && item.caption && (
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl line-clamp-2">
                      {item.caption}
                    </p>
                  )}
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-full transition-all flex items-center gap-2"
                  >
                    Lihat Detail <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Controls */}
          {featuredItems.length > 1 && (
            <div className="absolute bottom-8 right-8 z-20 flex gap-2">
              {featuredItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'w-8 bg-[var(--accent-gold)]' : 'w-2 bg-white/50 hover:bg-white'
                    }`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-[var(--text-primary)]">
            Arsip Dokumentasi
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Kumpulan momen berharga, kegiatan, dan fasilitas di Mabna Al Muhasibi.
          </p>
        </div>

        {/* Filter & Search */}
        <section className="mb-12 sticky top-20 z-30 bg-[var(--background)]/80 backdrop-blur-md p-4 rounded-2xl border border-[var(--border-color)] shadow-sm" data-aos="fade-up">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Cari dokumentasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--foreground)] focus:ring-2 focus:ring-[var(--accent-gold)] focus:outline-none text-[var(--text-primary)] transition-all"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                <Search className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-sm rounded-xl font-semibold transition-all ${activeCategory === cat
                    ? 'bg-[var(--accent-olive)] text-white shadow-md transform scale-105'
                    : 'bg-[var(--foreground)] hover:bg-[var(--border-color)] text-[var(--text-secondary)]'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative bg-[var(--foreground)] rounded-2xl overflow-hidden border border-[var(--border-color)] cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={index * 50}
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={item.image_url || `https://placehold.co/800x600/212529/F8F9FA?text=${item.title || 'Galeri'}`}
                    alt={item.title || item.caption || ''}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wide">
                    {item.category}
                  </div>

                  {/* Instagram badge */}
                  {item.instagram_url && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-1.5 rounded-full shadow-lg transform group-hover:rotate-12 transition-transform">
                      <Instagram className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    {item.event_date ? (
                      <span className="flex items-center gap-1 bg-[var(--background)] px-2 py-1 rounded-md">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    ) : (
                      <span></span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent-olive)] transition-colors">
                    {item.title || item.caption}
                  </h3>

                  {item.caption && item.title && (
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mt-2 leading-relaxed">{item.caption}</p>
                  )}

                  {item.sub_category && (
                    <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
                      <span className="text-xs font-semibold text-[var(--accent-olive)]">
                        {item.sub_category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[var(--foreground)]/50 rounded-3xl border border-dashed border-[var(--border-color)]" data-aos="fade-up">
            <div className="bg-[var(--background)] inline-flex p-6 rounded-full mb-6 shadow-sm">
              <ImageIcon className="h-12 w-12 text-[var(--accent-gold)]" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">Belum Ada Dokumentasi</h3>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              {searchQuery ? 'Tidak ada hasil yang cocok dengan pencarian Anda.' : 'Galeri akan segera diperbarui. Silakan kembali nanti.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-[var(--accent-olive)] hover:underline"
              >
                Hapus pencarian
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal Replaced with New Component */}
      {selectedItem && (
        <GalleryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  )
}

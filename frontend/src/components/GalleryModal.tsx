'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Calendar, Instagram, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryModalProps {
  item: any
  onClose: () => void
}

export default function GalleryModal({ item, onClose }: GalleryModalProps) {
  const [images, setImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (item) {
      if (item.gallery_images && item.gallery_images.length > 0) {
        setImages(item.gallery_images.map((d: any) => d.image_url))
      } else if (item.image_url) {
        setImages([item.image_url])
      } else {
        setImages([])
      }
      setLoading(false)
    }
  }, [item])

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!item) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[var(--foreground)] rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto border border-[var(--border-color)] shadow-2xl flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Image Carousel */}
        <div className="w-full md:w-3/5 bg-black relative min-h-[300px] md:min-h-[500px] flex items-center justify-center">
            {loading ? (
                <div className="text-white">Loading images...</div>
            ) : images.length > 0 ? (
                <>
                    <div className="relative w-full h-full aspect-video md:aspect-auto md:h-full">
                        <Image
                            src={images[currentIndex]}
                            alt={item.title || 'Gallery Image'}
                            fill
                            className="object-contain"
                            priority
                            sizes="(max-width: 768px) 100vw, 60vw"
                        />
                    </div>
                    
                    {images.length > 1 && (
                        <>
                            <button 
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx) }}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            ) : (
                <div className="text-white/50">No image available</div>
            )}
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs px-3 py-1 rounded-full bg-[var(--accent-olive)]/10 text-[var(--accent-olive)] font-medium">
                  {item.category}
                </span>
                {item.sub_category && (
                  <span className="text-xs px-3 py-1 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] font-medium">
                    {item.sub_category}
                  </span>
                )}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2 font-heading">
                {item.title || 'Tanpa Judul'}
            </h2>

            {item.event_date && (
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.event_date).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                    })}
                </div>
            )}

            <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--text-secondary)]">
                {item.caption && (
                    <p className="font-medium italic mb-4 text-[var(--text-primary)] border-l-4 border-[var(--accent-gold)] pl-4">
                        {item.caption}
                    </p>
                )}
                
                {item.content ? (
                    <div className="whitespace-pre-line leading-relaxed">
                        {item.content}
                    </div>
                ) : (
                    <p className="text-sm italic opacity-60">Tidak ada deskripsi tambahan.</p>
                )}
            </div>

            <div className="mt-auto pt-6 flex flex-col gap-3">
                {item.instagram_url && (
                    <a
                        href={item.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:brightness-110 transition-all text-sm"
                    >
                        <Instagram className="w-5 h-5" />
                        Lihat Postingan di Instagram
                        <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                )}
            </div>
        </div>
      </div>
    </div>
  )
}

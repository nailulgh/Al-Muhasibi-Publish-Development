"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronDown, User, X, MapPin, GraduationCap, Briefcase } from "lucide-react"
import { createPortal } from "react-dom"

// Types matching database
import type { Pengurus } from "@/types"

function isValidImageUrl(url: string | null | undefined): url is string {
    return !!url && (url.startsWith('/') || url.startsWith('http'))
}

/* ===== MODAL COMPONENT (rendered via portal) ===== */
function PengurusModal({ pengurus, onClose }: { pengurus: Pengurus; onClose: () => void }) {
    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [onClose])

    const modal = (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`Detail pengurus: ${pengurus.nama}`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div
                className="relative w-full max-w-md bg-[var(--foreground)] rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_300ms_ease-out] border border-[var(--border-color)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
                    aria-label="Tutup"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Image Section — fixed aspect ratio */}
                <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-[var(--background)]">
                    {isValidImageUrl(pengurus.foto) ? (
                        <Image
                            src={pengurus.foto}
                            alt={`Foto ${pengurus.nama}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 448px) 100vw, 448px"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full">
                            <User className="w-20 h-20 text-[var(--text-secondary)]/30" />
                        </div>
                    )}

                    {/* Gradient overlay at bottom of image for text readability */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--foreground)] to-transparent" />

                    {/* Name overlay on image */}
                    <div className="absolute bottom-0 inset-x-0 p-5">
                        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text-primary)] leading-tight drop-shadow-lg">
                            {pengurus.nama}
                        </h2>
                        <p className="text-base font-semibold text-[#e8b84d] mt-1">
                            {pengurus.jabatan}
                        </p>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                        <div className="w-8 h-8 rounded-full bg-[var(--accent-olive)]/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-[var(--accent-olive)]" />
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-secondary)]/60 uppercase tracking-wider">Asal</p>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{pengurus.asal || '-'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                        <div className="w-8 h-8 rounded-full bg-[var(--accent-olive)]/10 flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-4 h-4 text-[var(--accent-olive)]" />
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-secondary)]/60 uppercase tracking-wider">Jurusan</p>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{pengurus.jurusan || '-'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                        <div className="w-8 h-8 rounded-full bg-[var(--accent-olive)]/10 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-4 h-4 text-[var(--accent-olive)]" />
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-secondary)]/60 uppercase tracking-wider">Divisi</p>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{pengurus.devisi || '-'}</p>
                        </div>
                    </div>

                    {/* Close button */}
                    <div className="pt-3 border-t border-[var(--border-color)]">
                        <button
                            onClick={onClose}
                            className="w-full py-2.5 rounded-xl bg-[var(--accent-olive)] text-white font-semibold hover:bg-[var(--accent-olive)]/90 transition-colors cursor-pointer"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

    // Render via portal to document.body so it's not affected by parent transforms
    if (typeof window === 'undefined') return null
    return createPortal(modal, document.body)
}

/* ===== MAIN SECTION ===== */
export default function PengurusSection({
    pengurusUtama,
    pengurusTambahan
}: {
    pengurusUtama: Pengurus[],
    pengurusTambahan: Pengurus[]
}) {
    const [showAllPengurus, setShowAllPengurus] = useState(false)
    const [selectedPengurus, setSelectedPengurus] = useState<Pengurus | null>(null)
    const handleClose = useCallback(() => setSelectedPengurus(null), [])

    return (
        <section id="pengurus" data-aos="fade-up">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[var(--accent-olive)]">
                    Kepengurusan
                </h2>
                <p className="mt-2 text-lg text-[var(--text-secondary)]">
                    Periode 2025 - 2026 (Angkatan 56)
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {pengurusUtama.map((p) => (
                    <PengurusCard key={p.id} pengurus={p} onClick={() => setSelectedPengurus(p)} />
                ))}
            </div>

            {showAllPengurus && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in duration-300">
                    {pengurusTambahan.map((p) => (
                        <PengurusCard key={p.id} pengurus={p} onClick={() => setSelectedPengurus(p)} />
                    ))}
                </div>
            )}

            {pengurusTambahan.length > 0 && (
                <div className="mt-12 text-center">
                    <button
                        id="tombol-selengkapnya"
                        className="btn btn-primary inline-flex items-center gap-2 bg-[var(--accent-olive)] text-white px-6 py-3 rounded-full hover:bg-[var(--accent-olive)]/90 transition-colors"
                        onClick={() => setShowAllPengurus(!showAllPengurus)}
                    >
                        <span>{showAllPengurus ? "Tampilkan Lebih Sedikit" : "Selengkapnya"}</span>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showAllPengurus ? "rotate-180" : ""}`} />
                    </button>
                </div>
            )}

            {/* Modal rendered via portal */}
            {selectedPengurus && (
                <PengurusModal pengurus={selectedPengurus} onClose={handleClose} />
            )}
        </section>
    )
}

/* ===== CARD COMPONENT ===== */
function PengurusCard({ pengurus, onClick }: { pengurus: Pengurus; onClick: () => void }) {
    return (
        <div
            className="group block text-center p-4 rounded-lg cursor-pointer bg-[var(--foreground)] border border-[var(--border-color)] transition hover:shadow-lg"
            onClick={onClick}
        >
            <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-transparent group-hover:border-[var(--accent-gold)] transition-all duration-300 shadow-lg bg-[var(--background)]">
                {isValidImageUrl(pengurus.foto) ? (
                    <Image
                        src={pengurus.foto}
                        alt={pengurus.nama}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        <User className="w-16 h-16 text-[var(--text-secondary)]" />
                    </div>
                )}
            </div>
            <h3 className="font-bold text-xl">{pengurus.nama}</h3>
            <p className="text-[var(--accent-olive)] font-semibold">{pengurus.jabatan}</p>
        </div>
    )
}


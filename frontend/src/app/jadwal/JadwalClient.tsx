"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Calendar, List, LayoutGrid } from "lucide-react"
import { useSchedules } from "@/hooks/useSchedules"
import type { Jadwal } from "@/types"
import ScheduleRow from "./components/ScheduleRow"
import ScheduleCard from "./components/ScheduleCard"
import CalendarView from "./components/calendar/CalendarView"

const filterCategories = ["Semua", "Rutin Mingguan", "Bulanan", "Event Spesial"]

// Helper to sort days
const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export default function JadwalClient({ initialData }: { initialData: Jadwal[] }) {
    const { schedules, loading, error } = useSchedules(initialData)
    const [activeFilter, setActiveFilter] = useState("Semua")
    const [viewMode, setViewMode] = useState<"tabel" | "kalender">("tabel")

    // Memoized Sorting & Filtering
    const filteredJadwal = useMemo(() => {
        const sorted = [...schedules].sort((a, b) => {
            const dayA = dayOrder.indexOf(a.hari)
            const dayB = dayOrder.indexOf(b.hari)
            if (dayA !== dayB) return dayA - dayB
            // Secondary sort by time if days are equal
            return (a.time_start || a.waktu).localeCompare(b.time_start || b.waktu)
        })

        return sorted.filter((j) => {
            return activeFilter === "Semua" || j.kategori === activeFilter
        })
    }, [schedules, activeFilter])

    return (
        <div className="flex flex-col">
            {/* A. Hero Section */}
            <section className="relative h-[40vh] flex items-center justify-center text-white text-center">
                <div className="absolute inset-0 bg-black z-0">
                    <Image
                        src="/assets/FotoGeneral/gedungMuhasibi.jpg"
                        alt="Suasana Belajar di Asrama"
                        fill
                        className="object-cover opacity-30"
                        priority // LCP Optimization
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                <div className="relative z-20 p-4" data-aos="fade-up" suppressHydrationWarning>
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-[var(--accent-olive)]" />
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Jadwal Kegiatan
                    </h1>
                    <p className="mt-4 text-md md:text-lg max-w-3xl mx-auto">
                        Pantau jadwal kegiatan rutin, bulanan, dan acara spesial Asrama Al Muhasibi.
                    </p>
                </div>
            </section>

            {/* Kontainer Konten */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                {/* Filter & View Toggle */}
                <section id="filter-jadwal" className="mb-12" data-aos="fade-up" suppressHydrationWarning>
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        {/* Pilihan Tampilan */}
                        <div className="flex bg-[var(--foreground)] p-1 rounded-full border border-[var(--border-color)]">
                            <button
                                onClick={() => setViewMode("tabel")}
                                className={`px-4 py-1.5 text-sm rounded-full flex items-center gap-2 transition-colors ${viewMode === "tabel"
                                    ? "bg-[var(--accent-olive)] text-white font-semibold"
                                    : "hover:bg-[var(--border-color)]"
                                    }`}
                            >
                                <List className="w-4 h-4" />Tabel
                            </button>
                            <button
                                onClick={() => setViewMode("kalender")}
                                className={`px-4 py-1.5 text-sm rounded-full flex items-center gap-2 transition-colors ${viewMode === "kalender"
                                    ? "bg-[var(--accent-olive)] text-white font-semibold"
                                    : "hover:bg-[var(--border-color)]"
                                    }`}
                            >
                                <LayoutGrid className="w-4 h-4" />Kalender
                            </button>
                        </div>
                        {/* Tombol Filter */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {filterCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`px-4 py-1.5 text-sm rounded-full transition-colors ${activeFilter === cat
                                        ? "bg-[var(--accent-olive)] text-white font-semibold"
                                        : "bg-[var(--foreground)] hover:bg-[var(--border-color)]"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Countdown Kegiatan Terdekat - Simplified Placeholder */}
                <section className="mb-12 text-center" data-aos="fade-up" suppressHydrationWarning>
                    <div className="bg-[var(--foreground)] border-2 border-dashed border-[var(--accent-olive)] p-6 rounded-2xl inline-block">
                        <h3 className="text-lg font-semibold text-[var(--text-secondary)]">
                            Jadwal Rutin
                        </h3>
                        <p className="text-2xl font-bold text-[var(--accent-olive)] mt-1">
                            {filteredJadwal.length} Kegiatan Terdaftar
                        </p>
                    </div>
                </section>

                {/* Tabel Jadwal */}
                <section id="tabel-jadwal" data-aos="fade-up" suppressHydrationWarning>
                    {filteredJadwal.length > 0 ? (
                        <>

                            {viewMode === "tabel" ? (
                                <>
                                    {/* Desktop/Tablet: Table */}
                                    <div className="hidden md:block bg-[var(--foreground)] rounded-2xl overflow-hidden border border-[var(--border-color)] min-h-[300px]">
                                        <table className="w-full text-left">
                                            <thead className="bg-black/5 dark:bg-white/5">
                                                <tr>
                                                    <th className="p-4 font-semibold">Hari</th>
                                                    <th className="p-4 font-semibold">Waktu</th>
                                                    <th className="p-4 font-semibold">Kegiatan</th>
                                                    <th className="p-4 font-semibold">Tempat</th>
                                                    <th className="p-4 font-semibold">Kategori</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[var(--border-color)]">
                                                {filteredJadwal.map((jadwal) => (
                                                    <ScheduleRow key={jadwal.id} jadwal={jadwal} />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile: Card List */}
                                    <div className="md:hidden space-y-4">
                                        {filteredJadwal.map((jadwal) => (
                                            <ScheduleCard key={jadwal.id} jadwal={jadwal} />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                /* Interactive Calendar View */
                                <CalendarView schedules={filteredJadwal} />
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20" data-aos="fade-up" suppressHydrationWarning>
                            <div className="bg-[var(--foreground)] inline-flex p-6 rounded-full mb-6">
                                <Calendar className="h-12 w-12 text-[var(--accent-olive)]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Belum Ada Jadwal</h3>
                            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                                Data jadwal akan segera ditampilkan setelah terhubung dengan database.
                                Silakan kembali nanti untuk melihat pembaruan.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

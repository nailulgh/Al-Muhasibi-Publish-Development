import { createClient } from '@/utils/supabase/server'
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import PengurusSection from './PengurusSection' // Client Component for interaction
import FasilitasCard from '@/components/FasilitasCard' // Refactor if needed or keep inline

import { fetchPengurus } from '@/lib/api/pengurus'

// Fetch data on server
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Profil Asrama',
    description: 'Sejarah, Visi Misi, dan Struktur Kepengurusan Asrama Al Muhasibi.',
    alternates: {
        canonical: '/profile',
    },
}

export default async function ProfilePage() {
    const supabase = await createClient()

    // Fetch Pengurus
    const allPengurus = await fetchPengurus()
    
    // Sort ascending by created_at to match original behavior
    const sortedPengurus = [...allPengurus].sort((a, b) => {
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
    })
    
    const pengurusUtama = sortedPengurus.filter(p => p.kategori === 'UTAMA')
    const pengurusTambahan = sortedPengurus.filter(p => p.kategori === 'TAMBAHAN')

    // Fetch Fasilitas Fisik Gallery Items
    const { data: fasilitasItems } = await supabase
        .from('gallery')
        .select('*')
        .eq('category', 'Fasilitas Fisik')
        .order('created_at', { ascending: false })
        .limit(6)

    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* A. Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center text-white text-center">
                <div className="absolute inset-0 bg-black z-0">
                    <Image
                        src="/assets/FotoGeneral/gedungMuhasibi.jpg"
                        alt="Gedung Asrama Al Muhasibi"
                        fill
                        className="object-cover opacity-40"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-gold)]/20 to-transparent z-10"></div>
                <div className="relative z-20 p-4" data-aos="fade-up">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Profil Asrama Al Muhasibi
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                        Mencetak generasi Qur’ani, berilmu, dan berakhlak mulia.
                    </p>
                </div>
            </section>

            {/* Kontainer untuk sisa konten */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
                {/* B. Sejarah Singkat */}
                <section id="sejarah" data-aos="fade-up">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-1">
                            <h2 className="text-3xl font-bold text-[var(--accent-olive)]">
                                Sejarah Singkat
                            </h2>
                            <div className="w-24 h-1 bg-[var(--accent-gold)] mt-2 mb-4"></div>
                        </div>
                        <div className="md:col-span-2 text-lg text-[var(--text-secondary)] space-y-4">
                            <p>
                                Mabna Al-Muhasibi merupakan salah satu unit hunian asrama yang berada
                                di bawah naungan Pusat Ma’had al-Jami’ah (MSAA) UIN Maulana Malik Ibrahim
                                Malang. Keberadaannya tidak terlepas dari pengembangan sistem
                                Ma’had al-Jami’ah yang dirancang sebagai model pendidikan terpadu antara
                                tradisi pesantren dan perguruan tinggi. Melalui Ma’had al-Jami’ah,
                                UIN Malang menempatkan asrama sebagai ruang strategis dalam membentuk
                                karakter, spiritualitas, dan kultur akademik mahasiswa secara berkelanjutan.
                            </p>
                            <p>
                                Secara operasional, Mabna Al-Muhasibi mulai difungsikan pada tahun 2019 sebagai
                                bagian dari upaya perluasan dan optimalisasi fasilitas hunian mahasantri.
                                Mabna ini hadir untuk mendukung kebutuhan pembinaan mahasiswa putra dalam
                                lingkungan yang kondusif, religius, dan terarah sesuai dengan visi Ma’had
                                al-Jami’ah. Sebagai bagian integral dari MSAA, Al-Muhasibi menjalankan
                                fungsi pembinaan yang selaras dengan kebijakan, nilai, dan standar
                                pendidikan Ma’had, dengan menekankan keseimbangan antara penguatan akhlak,
                                kedisiplinan, dan pengembangan intelektual mahasiswa.
                            </p>
                        </div>
                    </div>
                </section>

                {/* C. Visi & Misi */}
                <section id="visi-misi" className="bg-[var(--foreground)] p-8 md:p-12 rounded-2xl border border-[var(--border-color)]"
                    data-aos="fade-up">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-3">Visi</h3>
                            <p className="text-xl italic text-[var(--text-secondary)]">
                                "Menjadi Ma’had al-Jami’ah yang unggul dan modern dalam pembinaan serta pembelajaran ilmu-ilmu keislaman,
                                dengan tetap menjaga tradisi pesantren moderat dan menjunjung tinggi akhlak mulia."
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-3">Misi</h3>
                            <ul className="space-y-2 list-disc list-inside text-[var(--text-secondary)]">
                                <li>
                                    Menyelenggarakan pembelajaran Al-Qur’an yang membiasakan dan menyenangkan bagi mahasantri.
                                </li>
                                <li>
                                    Melaksanakan pembelajaran ilmu-ilmu keislaman berbasis tradisi pesantren moderat.
                                </li>
                                <li>
                                    Mengembangkan minat dan bakat mahasantri di bidang keagamaan, keilmuan, dan seni.
                                </li>
                                <li>
                                    Mendorong interaksi sosial mahasantri yang berlandaskan akhlak mulia.
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* D. Nilai & Motto */}
                <section id="nilai-motto" data-aos="fade-up">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-[var(--foreground)] p-6 rounded-lg border border-[var(--border-color)] transition hover:shadow-lg">
                            <h4 className="text-2xl md:text-3xl font-amiri text-[var(--text-primary)] leading-relaxed">كونوا أولي الأبصار</h4>
                            <h2 className="mt-3 text-sm md:text-base italic text-[var(--text-secondary)]">(jadilah kamu orang-orang yang
                                memiliki mata hati);</h2>
                        </div>
                        <div className="bg-[var(--foreground)] p-6 rounded-lg border border-[var(--border-color)] transition hover:shadow-lg">
                            <h4 className="text-2xl md:text-3xl font-amiri text-[var(--text-primary)] leading-relaxed">كونوا أولي النهى</h4>
                            <h2 className="mt-3 text-sm md:text-base italic text-[var(--text-secondary)]">(jadilah kamu orang-orang yang
                                memiliki kecerdasan);</h2>
                        </div>
                        <div className="bg-[var(--foreground)] p-6 rounded-lg border border-[var(--border-color)] transition hover:shadow-lg">
                            <h4 className="text-2xl md:text-3xl font-amiri text-[var(--text-primary)] leading-relaxed">كونوا أولي الألباب</h4>
                            <h2 className="mt-3 text-sm md:text-base italic text-[var(--text-secondary)]">(jadilah kamu orang-orang yang
                                memiliki akal);</h2>
                        </div>
                        <div className="bg-[var(--foreground)] p-6 rounded-lg border border-[var(--border-color)] transition hover:shadow-lg">
                            <h4 className="text-2xl md:text-3xl font-amiri text-[var(--text-primary)] leading-relaxed">وجاهدوا في الله حق جهاده</h4>
                            <h2 className="mt-3 text-sm md:text-base italic text-[var(--text-secondary)]">(dan berjuanglah untuk membela
                                agama Allah dengan kesungguhan).</h2>
                        </div>
                    </div>
                    <blockquote className="mt-8 text-center text-2xl italic text-[var(--text-secondary)]">
                        "Ilmu Diamalkan, Amal Dibimbing Ilmu"
                    </blockquote>
                </section>

                {/* Jargon */}
                <section id="jargon" data-aos="fade-up">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-[var(--accent-olive)]">
                            Jargon Al Muhasibi
                        </h2>
                        <p className="mt-2 text-lg text-[var(--text-secondary)]">
                            Muhasibian 🗣
                        </p>
                        <p className="mt-2 text-lg text-[var(--text-secondary)]">
                            "Keep Spirit, and Think Positive... Haa anadza"
                        </p>
                    </div>
                </section>

                {/* E. Struktur Kepengurusan */}
                <PengurusSection
                    pengurusUtama={pengurusUtama || []}
                    pengurusTambahan={pengurusTambahan || []}
                />

                {/* F. Fasilitas Asrama */}
                <section id="fasilitas" data-aos="fade-up">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[var(--accent-olive)]">
                            Fasilitas Asrama
                        </h2>
                        <p className="mt-2 text-lg text-[var(--text-secondary)]">
                            Menunjang kenyamanan belajar dan beribadah.
                        </p>
                    </div>
                    {fasilitasItems && fasilitasItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {fasilitasItems.map((item) => (
                                <Link
                                    href="/galeri"
                                    key={item.id}
                                    className="group relative block overflow-hidden rounded-xl aspect-square md:aspect-video cursor-pointer border border-[var(--border-color)] hover:shadow-xl transition-all"
                                >
                                    <Image
                                        src={item.image_url || `https://placehold.co/600x400/212529/F8F9FA?text=${item.title || 'Fasilitas'}`}
                                        alt={item.title || 'Fasilitas Asrama'}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                    <div className="absolute bottom-0 left-0 p-5 w-full">
                                        <h3 className="text-white font-bold text-xl mb-1 line-clamp-1 group-hover:text-[var(--accent-gold)] transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm line-clamp-2">
                                            {item.caption || 'Fasilitas penunjang kegiatan mahasantri'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-[var(--foreground)] rounded-2xl border border-dashed border-[var(--border-color)]">
                            <p className="text-[var(--text-secondary)]">
                                Belum ada data fasilitas yang ditambahkan.
                            </p>
                        </div>
                    )}
                </section>

                {/* Call to Action */}
                <section className="text-center" data-aos="fade-up">
                    <h2 className="text-2xl font-bold">Jelajahi Lebih Lanjut</h2>

                    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/galeri" className="btn bg-[var(--accent-olive)] text-white px-6 py-3 rounded-lg hover:bg-[var(--accent-olive)]/90 transition">
                            Lihat Galeri Kami
                        </Link>
                        <Link href="/jadwal" className="btn bg-[var(--accent-olive)] text-white px-6 py-3 rounded-lg hover:bg-[var(--accent-olive)]/90 transition">
                            Cek Jadwal Harian
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    )
}

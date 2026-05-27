"use client"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Youtube, Instagram } from "lucide-react"

import { usePathname } from "next/navigation"

export function Footer() {
    const pathname = usePathname()
    if (pathname?.startsWith('/admin')) return null
    return (
        <footer id="kontak" className="bg-[var(--background)] text-white border-t border-[var(--border-color)] font-body">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">

                    {/* Menu Cepat */}
                    <div>
                        <h3 className="footer-heading text-white font-heading font-bold text-lg mb-6">Menu Cepat</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="footer-link hover:text-[var(--accent-olive)] transition-all">Beranda Asrama</Link></li>
                            <li><Link href="/profile" className="footer-link hover:text-[var(--accent-olive)] transition-all">Profil Al Muhasibi</Link></li>
                            <li><Link href="/galeri" className="footer-link hover:text-[var(--accent-olive)] transition-all">Galeri Kegiatan</Link></li>
                            <li><Link href="/jadwal" className="footer-link hover:text-[var(--accent-olive)] transition-all">Jadwal Harian</Link></li>
                            <li><Link href="#kontak" className="footer-link hover:text-[var(--accent-olive)] transition-all">Kontak</Link></li>
                        </ul>
                    </div>

                    {/* Kontak Kami */}
                    <div>
                        <h3 className="footer-heading text-white font-heading font-bold text-lg mb-6">Kontak Kami</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-4">
                                <MapPin className="contact-icon text-[var(--accent-olive)] flex-shrink-0 h-5 w-5 mt-1" />
                                <div className="contact-text text-gray-100">
                                    <span className="block font-semibold">Mabna Al Muhasibi</span>
                                    <span>Jalan Gajahyana No. 50, Dinoyo, Sukun, Kota Malang</span>
                                    <a href="https://maps.app.goo.gl/4nyk3eHZDJGxnao88" target="_blank" rel="noopener noreferrer" className="block text-xs mt-1 text-white/60 hover:text-white">Lihat di Google Maps</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Phone className="contact-icon text-[var(--accent-olive)] flex-shrink-0 h-5 w-5 mt-1" />
                                <div className="contact-text flex flex-col gap-1 text-gray-100">
                                    <a href="https://wa.me/6281234567890?text=Halo%20Mas%20Muza,%20saya%20ingin%20bertanya%20tentang%20Asrama%20Al%20Muhasibi" target="_blank" rel="noopener noreferrer" className="hover:text-[#e8b84d] transition-colors">
                                        +62 812 3456 7890 (Mas Muza)
                                    </a>
                                    <a href="https://wa.me/6282245777101?text=Halo%20Mas%20Akmal,%20saya%20ingin%20bertanya%20tentang%20Asrama%20Al%20Muhasibi" target="_blank" rel="noopener noreferrer" className="hover:text-[#e8b84d] transition-colors">
                                        +62 822-4577-7101 (Mas Akmal)
                                    </a>
                                    <a href="https://wa.me/6285755883472?text=Halo%20Mas%20Ashif,%20saya%20ingin%20bertanya%20tentang%20Asrama%20Al%20Muhasibi" target="_blank" rel="noopener noreferrer" className="hover:text-[#e8b84d] transition-colors">
                                        +62 857-5588-3472 (Mas Ashif)
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Mail className="contact-icon text-[var(--accent-olive)] flex-shrink-0 h-5 w-5" />
                                <div className="contact-text text-gray-100">
                                    <a href="mailto:almuhasibidormitory56@gmail.com" className="hover:text-[#e8b84d]">almuhasibidormitory56@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Clock className="contact-icon text-[var(--accent-olive)] flex-shrink-0 h-5 w-5" />
                                <div className="contact-text text-gray-100">
                                    <span>Senin - Jum'at: 08.00 - 17.00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terhubung */}
                    <div>
                        <h3 className="footer-heading text-white font-heading font-bold text-lg mb-6">Terhubung</h3>

                        <div className="map-frame mb-6 h-[200px] w-full rounded-lg overflow-hidden border border-white/20 grayscale hover:grayscale-0 transition-all duration-500">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.487225684934!2d112.60415751167743!3d-7.948496592042811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78838cdec5a283%3A0x2125828450872ee7!2sMabna%20Putra%20Al%20Muhasibi!5e0!3m2!1sid!2sus!4v1769600710362!5m2!1sid!2sus"
                                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>

                        <div className="flex space-x-3">
                            <a href="http://www.youtube.com/@msaauinmalang" className="social-btn flex items-center justify-center w-10 h-10 rounded-full border border-white/50 text-white hover:bg-[var(--accent-olive)] hover:border-[var(--accent-olive)] transition-all" aria-label="Youtube" target="_blank" rel="noopener noreferrer">
                                <Youtube className="w-5 h-5" />
                            </a>
                            <a href="https://www.instagram.com/almuhasibiofficial" className="social-btn flex items-center justify-center w-10 h-10 rounded-full border border-white/50 text-white hover:bg-[var(--accent-olive)] hover:border-[var(--accent-olive)] transition-all" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://www.tiktok.com/@muhasibianmsaa" className="social-btn flex items-center justify-center w-10 h-10 rounded-full border border-white/50 text-white hover:bg-[var(--accent-olive)] hover:border-[var(--accent-olive)] transition-all" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright & Login Admin */}
                <div className="border-t border-[var(--border-color)] mt-8 md:mt-10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[var(--text-secondary)]">
                    <p className="order-2 md:order-1 mt-4 md:mt-0 text-center md:text-left">
                        © 2025 Asrama Al Muhasibi. Developed by <a href="https://muhammad-nailulgh-portfolio.vercel.app/" className="hover:text-[#2E7D32] font-semibold">Nailul</a>
                    </p>
                    <div className="order-1 md:order-2 flex flex-col md:flex-row gap-2 md:gap-6 items-center">
                        <Link href="/login" className="hover:text-[#2E7D32] transition-colors">
                            Login Admin
                        </Link>
                        <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeuNxPFpQJOZ2om1jSydCZ0Tnye7qy5tjUU_k2T50gB-LRBnA/viewform" className="hover:text-[#2E7D32] transition-colors">
                            Masukan
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

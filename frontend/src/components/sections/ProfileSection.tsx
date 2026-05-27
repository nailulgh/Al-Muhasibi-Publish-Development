import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function ProfileSection() {
  return (
    <section
      id="profil"
      className="py-20 md:py-28 bg-[var(--foreground)] border-y border-[var(--border-color)]"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            data-aos="fade-right"
            className="relative h-[400px] w-full rounded-2xl shadow-xl overflow-hidden group"
          >
            <Image
              src="/assets/FotoGeneral/gedungMuhasibi.jpg"
              alt="Gedung Asrama Al Muhasibi"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div data-aos="fade-left">
            <h2 className="text-3xl font-bold text-[var(--accent-olive)] mb-4 font-heading">
              Mengenal Al Muhasibi
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-6 font-body text-lg">
              Mabna Al-Muhasibi merupakan salah satu unit hunian asrama yang
              berada di bawah Pusat Ma’had al-Jami’ah (MSAA) UIN Maulana Malik
              Ibrahim Malang. Sebagai bagian dari sistem pembinaan mahasantri,
              Al-Muhasibi berperan dalam memperkuat pendidikan religius,
              intelektual, dan karakter mahasiswa melalui lingkungan asrama yang
              terintegrasi dengan nilai-nilai pesantren dan kampus.
            </p>
            <Link
              href="/profile"
              className="btn btn-primary inline-flex items-center justify-center gap-2"
            >
              Lihat Profil Lengkap <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

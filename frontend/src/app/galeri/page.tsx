import { fetchGallery } from '@/lib/api/gallery'
import GalleryClient from './GalleryClient'
import Link from 'next/link'

export const revalidate = 60

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galeri Kegiatan Al Muhasibi',
  description: 'Dokumentasi foto dan video kegiatan mahasantri Mabna Al Muhasibi UIN Maulana Malik Ibrahim Malang — kegiatan keislaman, akademik, dan sosial.',
  alternates: {
    canonical: 'https://al-muhasibi.vercel.app/galeri',
  },
  openGraph: {
    title: 'Galeri Kegiatan Al Muhasibi',
    description: 'Dokumentasi foto dan video kegiatan mahasantri Mabna Al Muhasibi.',
    url: 'https://al-muhasibi.vercel.app/galeri',
    images: [{
      url: 'https://nozwgjjkecyrpkpybrdf.supabase.co/storage/v1/object/public/profile-images/MusyMuhasibi-1.png',
      width: 1200,
      height: 630,
      alt: 'Galeri Kegiatan Mahasantri Al Muhasibi',
    }],
  },
}

export default async function GaleriPage() {
  const items = await fetchGallery()

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: 'https://al-muhasibi.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Galeri Kegiatan',
        item: 'https://al-muhasibi.vercel.app/galeri',
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <GalleryClient items={items} />
      <section className="bg-[var(--background)] py-12 border-t border-[var(--border-color)]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[var(--text-secondary)] mb-4">Ingin tahu lebih banyak tentang siapa di balik kegiatan asrama?</p>
          <Link href="/profile" className="text-[var(--accent-olive)] hover:underline font-semibold text-lg">
            Kenali Pengurus Al Muhasibi
          </Link>
        </div>
      </section>
    </>
  )
}

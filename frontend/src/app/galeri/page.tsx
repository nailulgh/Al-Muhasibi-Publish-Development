import { fetchGallery } from '@/lib/api/gallery'
import GalleryClient from './GalleryClient'

export const revalidate = 60

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galeri Kegiatan',
  description: 'Dokumentasi kegiatan dan momen berharga di Mabna Al Muhasibi.',
  alternates: {
    canonical: '/galeri',
  },
}

export default async function GaleriPage() {
  const items = await fetchGallery()

  return <GalleryClient items={items} />
}

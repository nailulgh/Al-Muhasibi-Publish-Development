'use client'

import { updateGallery } from '@/lib/api/gallery'
import ImageUpload from '@/components/ImageUpload'
import { useState } from 'react'
import { Save, Loader2, Instagram } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { value: 'Fasilitas Fisik', label: 'Fasilitas Fisik', subs: ['Gedung & Kelas', 'Area Asrama', 'Fasilitas Pendukung'] },
  { value: 'Kegiatan Mahasantri', label: 'Kegiatan Mahasantri', subs: ['Akademik', 'Ekstrakurikuler', 'Kehidupan Asrama', 'Acara Khusus'] },
  { value: 'Prestasi & Dokumentasi', label: 'Prestasi & Dokumentasi', subs: ['Penghargaan', 'Karya Mahasantri', 'Video'] },
]

export default function EditGalleryForm({ item, initialImages }: { item: any, initialImages: string[] }) {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(item.category || '')

  const currentSubs = CATEGORIES.find(c => c.value === selectedCategory)?.subs || []

  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    
    try {
      await updateGallery(item.id, {
        title: formData.get('title') as string,
        caption: formData.get('caption') as string || undefined,
        content: formData.get('content') as string || undefined,
        category: formData.get('category') as string,
        sub_category: formData.get('sub_category') as string || undefined,
        event_date: formData.get('event_date') as string || undefined,
        instagram_url: formData.get('instagram_url') as string || undefined,
        image_urls: imageUrls
      })
      router.push('/admin/gallery')
      router.refresh()
    } catch (error: any) {
      alert(`Error: ${error.message}`)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[var(--foreground)] rounded-xl border border-[var(--border-color)] p-6 md:p-8">
      <form action={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Judul</label>
              <input type="text" name="title" defaultValue={item.title} required
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Caption</label>
              <input type="text" name="caption" defaultValue={item.caption} required
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Kategori</label>
                <select name="category" required
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] outline-none"
                >
                  <option value="">Pilih...</option>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Sub-kategori</label>
                <select name="sub_category" defaultValue={item.sub_category || ''}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] outline-none"
                  disabled={currentSubs.length === 0}
                >
                  <option value="">Pilih...</option>
                  {currentSubs.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Tanggal (opsional)</label>
              <input type="date" name="event_date" defaultValue={item.event_date || ''}
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Deskripsi / Konten</label>
              <textarea name="content" defaultValue={item.content || ''} rows={4}
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                <span className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500" /> Link Instagram (opsional)</span>
              </label>
              <input type="url" name="instagram_url" defaultValue={item.instagram_url || ''}
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all"
                placeholder="https://www.instagram.com/p/..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Foto Dokumentasi</label>
              <ImageUpload value={imageUrls} onChange={setImageUrls} bucket="gallery-images" maxFiles={3} />
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                  Format: JPG, PNG, WEBP. Maks 2MB. Maksimal 3 Foto.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border-color)] flex justify-end gap-3">
          <Link href="/admin/gallery" className="btn px-6 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--background)] transition-colors">
            Batal
          </Link>
          <button type="submit" disabled={isSubmitting || imageUrls.length === 0}
            className="btn btn-primary bg-[var(--accent-gold)] text-[#423512] px-8 py-3 rounded-lg font-bold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /><span>Menyimpan...</span></>
            ) : (
              <><Save className="w-5 h-5" /><span>Simpan Perubahan</span></>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

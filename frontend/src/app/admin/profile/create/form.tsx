'use client'

import { createPengurus } from '@/lib/api/pengurus'
import ImageUpload from '@/components/ImageUpload'
import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CreatePengurusForm() {
  const [imageUrl, setImageUrl] = useState('')
  const imageValue = imageUrl ? [imageUrl] : []
  const handleImageChange = (urls: string[]) => setImageUrl(urls[urls.length - 1] || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await createPengurus({
        nama: formData.get('nama') as string,
        jabatan: formData.get('jabatan') as string,
        asal: formData.get('asal') as string,
        jurusan: formData.get('jurusan') as string,
        devisi: formData.get('devisi') as string,
        kategori: formData.get('kategori') as string,
        foto: imageUrl
      })
      router.push('/admin/profile')
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
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                required
                placeholder="Contoh: Muhammad Ilham"
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Jabatan</label>
              <input
                type="text"
                name="jabatan"
                required
                placeholder="Contoh: Ketua Mabna"
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Asal</label>
              <input
                type="text"
                name="asal"
                required
                placeholder="Contoh: Malang, Jawa Timur"
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Jurusan</label>
              <input
                type="text"
                name="jurusan"
                required
                placeholder="Contoh: Teknik Informatika"
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Divisi</label>
              <input
                type="text"
                name="devisi"
                required
                placeholder="Contoh: Keamanan"
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Kategori</label>
              <select
                name="kategori"
                defaultValue="TAMBAHAN"
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="UTAMA">Pengurus Utama (Tampil Di Atas)</option>
                <option value="TAMBAHAN">Pengurus Tambahan (Tampil Di Expand)</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Foto Profil</label>
              <div className="bg-[var(--background)] p-4 rounded-lg border border-[var(--border-color)]">
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Upload foto pengurus. Disarankan rasio 1:1 (Persegi).
                </p>
                <ImageUpload value={imageValue} onChange={handleImageChange} bucket="profile-images" maxFiles={1} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border-color)] flex justify-end gap-3">
          <Link href="/admin/profile" className="btn px-6 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--background)] transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary bg-[var(--accent-gold)] text-[#423512] px-8 py-3 rounded-lg font-bold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Simpan Pengurus</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

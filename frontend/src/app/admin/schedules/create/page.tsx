'use client'

import { createSchedule } from '@/lib/api/schedules'
import { useState } from 'react'
import { ArrowLeft, Save, Loader2, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export default function CreateSchedulePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await createSchedule({
        day: formData.get('day') as string,
        time_start: formData.get('time_start') as string,
        time_end: formData.get('time_end') as string,
        activity_name: formData.get('activity_name') as string,
        location: formData.get('location') as string,
      })
      router.push('/admin/schedules')
      router.refresh()
    } catch (error: any) {
      alert(`Error: ${error.message}`)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/schedules" 
          className="p-2 hover:bg-[var(--foreground)] rounded-full transition-colors text-[var(--text-secondary)]"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-heading">Tambah Jadwal Baru</h1>
        </div>
      </div>

      <div className="bg-[var(--foreground)] rounded-xl border border-[var(--border-color)] p-6 md:p-8">
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Hari</label>
            <select 
              name="day" 
              required
              defaultValue=""
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>Pilih Hari...</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Jam Mulai</label>
              <div className="relative">
                <input 
                  type="time" 
                  name="time_start"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all"
                />
                <Clock className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Jam Selesai</label>
              <div className="relative">
                <input 
                  type="time" 
                  name="time_end"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all"
                />
                <Clock className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Nama Kegiatan</label>
            <input 
              type="text" 
              name="activity_name"
              required
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all"
              placeholder="Contoh: Sholat Subuh Berjamaah"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Lokasi</label>
            <input 
              type="text" 
              name="location"
              required
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-olive)] focus:border-transparent outline-none transition-all"
              placeholder="Contoh: Masjid Ulul Albab"
            />
          </div>

          <div className="pt-6 border-t border-[var(--border-color)] flex justify-end">
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
                  <span>Simpan Jadwal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

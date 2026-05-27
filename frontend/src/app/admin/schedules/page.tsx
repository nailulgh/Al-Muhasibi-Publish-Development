import { fetchSchedules } from '@/lib/api/schedules'
import Link from 'next/link'
import { Plus, MapPin, Clock } from 'lucide-react'
import DeleteButton from '@/components/DeleteButton'

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

export default async function SchedulesPage() {
  const schedules = await fetchSchedules()

  // Group by day
  const groupedSchedules = days.reduce((acc, day) => {
    acc[day] = schedules.filter(s => s.day === day)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="space-y-8">
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-heading">Kelola Jadwal</h1>
          <p className="text-[var(--text-secondary)]">Jadwal kegiatan harian mahasantri</p>
        </div>
        <Link
          href="/admin/schedules/create"
          className="btn btn-primary inline-flex items-center gap-2 bg-[var(--accent-gold)] text-[#423512] px-4 py-2 rounded-lg font-medium hover:brightness-110 transition-all w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map((day) => (
          <div key={day} className="bg-[var(--foreground)] rounded-xl border border-[var(--border-color)] overflow-hidden flex flex-col">
            <div className="bg-[var(--accent-olive)]/10 p-4 border-b border-[var(--border-color)]">
              <h3 className="font-bold text-[var(--accent-olive)] text-lg text-center">{day}</h3>
            </div>
            <div className="divide-y divide-[var(--border-color)] flex-1">
              {groupedSchedules[day].length > 0 ? (
                groupedSchedules[day].map((schedule) => (
                  <div key={schedule.id} className="p-4 hover:bg-[var(--background)]/50 transition-colors relative group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-[var(--text-primary)]">{schedule.activity_name}</h4>
                      <DeleteButton id={schedule.id} resource="schedules" label="Hapus jadwal ini" />
                    </div>

                    <div className="space-y-1 text-sm text-[var(--text-secondary)]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{schedule.time_start.slice(0, 5)} - {schedule.time_end.slice(0, 5)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>{schedule.location}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[var(--text-secondary)] text-sm italic">
                  Tidak ada jadwal
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

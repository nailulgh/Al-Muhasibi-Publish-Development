import React from 'react'
import { Clock, MapPin } from 'lucide-react'
import type { Jadwal } from 'shared/types/schedule'

interface ScheduleCardProps {
    jadwal: Jadwal
}

const ScheduleCard = React.memo(({ jadwal }: ScheduleCardProps) => {
    return (
        <div className="bg-[var(--foreground)] p-4 rounded-xl border border-[var(--border-color)]">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-[var(--accent-olive)]">{jadwal.kegiatan}</h3>
                <span className="bg-[var(--accent-olive)]/20 text-[var(--accent-olive)] px-2 py-0.5 rounded text-xs">
                    {jadwal.hari}
                </span>
            </div>
            <div className="mt-2 text-sm text-[var(--text-secondary)] space-y-2">
                <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0" /><span>{jadwal.waktu}</span>
                </p>
                <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" /><span>{jadwal.tempat}</span>
                </p>
            </div>
        </div>
    )
})

ScheduleCard.displayName = 'ScheduleCard'

export default ScheduleCard

import React from 'react'
import type { Jadwal } from 'shared/types/schedule'

interface ScheduleRowProps {
    jadwal: Jadwal
}

const ScheduleRow = React.memo(({ jadwal }: ScheduleRowProps) => {
    return (
        <tr className="hover:bg-[var(--background)] transition-colors">
            <td className="p-4 font-medium whitespace-nowrap">{jadwal.hari}</td>
            <td className="p-4 font-mono text-sm whitespace-nowrap">{jadwal.waktu}</td>
            <td className="p-4 font-semibold text-[var(--accent-olive)]">{jadwal.kegiatan}</td>
            <td className="p-4">{jadwal.tempat}</td>
            <td className="p-4 whitespace-nowrap">
                <span className="bg-[var(--accent-olive)]/20 text-[var(--accent-olive)] px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                    {jadwal.kategori}
                </span>
            </td>
        </tr>
    )
})

ScheduleRow.displayName = 'ScheduleRow'

export default ScheduleRow

import { fetchSchedules } from '@/lib/api/schedules'
import JadwalClient from './JadwalClient'
import { Suspense } from 'react'
import { JadwalSkeleton } from '@/components/skeletons/JadwalSkeleton'
import { Metadata } from 'next'
import type { Jadwal } from 'shared/types/schedule'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Jadwal Kegiatan',
    description: 'Jadwal harian dan mingguan kegiatan mahasantri Asrama Al Muhasibi.',
    alternates: {
        canonical: '/jadwal',
    },
}

async function getSchedules() {
    const schedules = await fetchSchedules()

    const formattedData: Jadwal[] = schedules.map(item => ({
        id: item.id,
        hari: item.day,
        waktu: `${item.time_start?.slice(0, 5) || ''} - ${item.time_end?.slice(0, 5) || ''}`,
        kegiatan: item.activity_name,
        tempat: item.location,
        penanggungJawab: '-',
        kategori: 'Rutin Mingguan',
        time_start: item.time_start // Include raw time for sorting
    }))

    return formattedData
}

export default async function JadwalPage() {
    const schedules = await getSchedules()

    return (
        <Suspense fallback={<JadwalSkeleton />}>
            <JadwalClient initialData={schedules} />
        </Suspense>
    )
}

import { fetchSchedules } from '@/lib/api/schedules'
import JadwalClient from './JadwalClient'
import { Suspense } from 'react'
import { JadwalSkeleton } from '@/components/skeletons/JadwalSkeleton'
import { Metadata } from 'next'
import type { Jadwal } from 'shared/types/schedule'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Jadwal Harian Mahasantri Al Muhasibi',
    description: 'Jadwal kegiatan harian mahasantri Mabna Al Muhasibi UIN Maliki Malang — sholat berjamaah, ngaji, kajian, dan kegiatan asrama.',
    alternates: {
        canonical: 'https://al-muhasibi.vercel.app/jadwal',
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
                name: 'Jadwal Harian',
                item: 'https://al-muhasibi.vercel.app/jadwal',
            },
        ],
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <Suspense fallback={<JadwalSkeleton />}>
                <JadwalClient initialData={schedules} />
            </Suspense>
        </>
    )
}

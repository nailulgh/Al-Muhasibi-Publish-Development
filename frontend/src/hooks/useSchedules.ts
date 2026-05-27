'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { fetchSchedules } from '@/lib/api/schedules'
import type { Jadwal } from 'shared/types/schedule'

export function useSchedules(initialData: Jadwal[]) {
  const [schedules, setSchedules] = useState<Jadwal[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('realtime-schedules')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedules' },
        async () => {
          setLoading(true)
          try {
            const data = await fetchSchedules()
            const formatted: Jadwal[] = data.map(item => ({
              id: item.id,
              hari: item.day,
              waktu: `${item.time_start?.slice(0, 5) || ''} - ${item.time_end?.slice(0, 5) || ''}`,
              kegiatan: item.activity_name,
              tempat: item.location,
              penanggungJawab: '-',
              kategori: 'Rutin Mingguan',
              time_start: item.time_start
            }))
            setSchedules(formatted)
          } catch (e: any) {
            setError(e.message || 'Gagal memuat data')
          } finally {
            setLoading(false)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return { schedules, setSchedules, loading, error }
}

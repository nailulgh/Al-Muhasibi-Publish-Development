'use client'

import { useState, useEffect } from 'react'
import { fetchPrograms } from '@/lib/api/programs'
import type { Program } from 'shared/types/program'

export function usePrograms(initialData: Program[] | null = null) {
  const [programs, setPrograms] = useState<Program[]>(initialData || [])
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) return

    let isMounted = true
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchPrograms()
        if (isMounted) setPrograms(data)
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Gagal memuat program')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => { isMounted = false }
  }, [initialData])

  return { programs, setPrograms, loading, error }
}

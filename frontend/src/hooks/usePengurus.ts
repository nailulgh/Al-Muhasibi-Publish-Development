import { useState, useEffect } from 'react'
import type { Pengurus } from 'shared/types/pengurus'
import { fetchPengurus } from '@/lib/api/pengurus'

export function usePengurus() {
  const [pengurusList, setPengurusList] = useState<Pengurus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchPengurus()
      .then(setPengurusList)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  return { pengurusList, isLoading, error }
}

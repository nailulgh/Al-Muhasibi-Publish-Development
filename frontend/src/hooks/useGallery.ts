'use client'
import { useState, useEffect } from 'react'
import { fetchGallery } from '@/lib/api/gallery'
import type { GalleryItem } from '@/types/gallery'
import { createClient } from '@/utils/supabase/client'

export function useGallery(initialData: GalleryItem[] = []) {
  const [data, setData] = useState<GalleryItem[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    
    const fetchFreshData = async () => {
        try {
          const fresh = await fetchGallery()
          setData(fresh)
        } catch (e: any) {
          setError(e.message)
        }
    }

    const channel = supabase.channel('realtime-gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, fetchFreshData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_images' }, fetchFreshData)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { data, loading, error }
}

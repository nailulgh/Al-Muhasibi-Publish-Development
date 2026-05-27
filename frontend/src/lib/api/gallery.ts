import type { GalleryItem, CreateGalleryDto, UpdateGalleryDto } from 'shared/types/gallery'
import { apiFetch } from './client'

const BASE = '/api/gallery'

export async function fetchGallery(options?: { category?: string; limit?: number }): Promise<GalleryItem[]> {
  const params = new URLSearchParams()
  if (options?.category && options.category !== 'Semua') {
    params.append('category', options.category)
  }
  if (options?.limit) {
    params.append('limit', options.limit.toString())
  }
  
  const query = params.toString() ? `?${params.toString()}` : ''
  const { data, error } = await apiFetch<GalleryItem[]>(`${BASE}${query}`, { cache: 'no-store' })
  
  if (error) throw new Error(error.message)
  return data || []
}

export async function fetchGalleryById(id: string): Promise<GalleryItem> {
  const { data, error } = await apiFetch<GalleryItem>(`${BASE}/${id}`, { cache: 'no-store' })
  
  if (error) throw new Error(error.message)
  if (!data) throw new Error('Item galeri tidak ditemukan')
  
  return data
}

export async function createGallery(payload: CreateGalleryDto): Promise<GalleryItem> {
  const { data, error } = await apiFetch<GalleryItem>(BASE, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  
  if (error) throw new Error(error.message)
  if (!data) throw new Error('Gagal membuat galeri baru')
  
  return data
}

export async function updateGallery(id: string, payload: UpdateGalleryDto): Promise<GalleryItem> {
  const { data, error } = await apiFetch<GalleryItem>(`${BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
  
  if (error) throw new Error(error.message)
  if (!data) throw new Error('Gagal mengubah data galeri')
  
  return data
}

export async function deleteGallery(id: string): Promise<void> {
  const { error } = await apiFetch<{ success: boolean }>(`${BASE}/${id}`, {
    method: 'DELETE'
  })
  
  if (error) throw new Error(error.message)
}

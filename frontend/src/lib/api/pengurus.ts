import type { Pengurus, CreatePengurusDto, UpdatePengurusDto } from 'shared/types/pengurus'
import { apiFetch } from './client'

export async function fetchPengurus(): Promise<Pengurus[]> {
  const { data, error } = await apiFetch<Pengurus[]>('/api/pengurus', { cache: 'no-store' })
  if (error || !data) throw new Error(error?.message || 'Gagal memuat data pengurus')
  return data
}

export async function fetchPengurusById(id: string): Promise<Pengurus> {
  const { data, error } = await apiFetch<Pengurus>(`/api/pengurus/${id}`, { cache: 'no-store' })
  if (error || !data) throw new Error(error?.message || 'Gagal memuat detail pengurus')
  return data
}

export async function createPengurus(payload: CreatePengurusDto): Promise<Pengurus> {
  const { data, error } = await apiFetch<Pengurus>('/api/pengurus', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  if (error || !data) throw new Error(error?.message || 'Gagal menyimpan pengurus')
  return data
}

export async function updatePengurus(id: string, payload: UpdatePengurusDto): Promise<Pengurus> {
  const { data, error } = await apiFetch<Pengurus>(`/api/pengurus/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
  if (error || !data) throw new Error(error?.message || 'Gagal memperbarui pengurus')
  return data
}

export async function deletePengurus(id: string): Promise<void> {
  const { error } = await apiFetch<null>(`/api/pengurus/${id}`, {
    method: 'DELETE'
  })
  if (error) throw new Error(error.message || 'Gagal menghapus pengurus')
}

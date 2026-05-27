import type { Program, CreateProgramDto, UpdateProgramDto } from 'shared/types/program'
import { apiFetch } from './client'

export async function fetchPrograms(): Promise<Program[]> {
  const { data, error } = await apiFetch<Program[]>('/api/programs', { cache: 'no-store' })
  if (error || !data) throw new Error(error?.message || 'Gagal memuat data program')
  return data
}

export async function createProgram(payload: CreateProgramDto): Promise<Program> {
  const { data, error } = await apiFetch<Program>('/api/programs', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  if (error || !data) throw new Error(error?.message || 'Gagal menyimpan program')
  return data
}

export async function updateProgram(id: string, payload: UpdateProgramDto): Promise<Program> {
  const { data, error } = await apiFetch<Program>(`/api/programs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
  if (error || !data) throw new Error(error?.message || 'Gagal mengubah program')
  return data
}

export async function deleteProgram(id: string): Promise<void> {
  const { error } = await apiFetch<null>(`/api/programs/${id}`, {
    method: 'DELETE'
  })
  if (error) throw new Error(error.message || 'Gagal menghapus program')
}

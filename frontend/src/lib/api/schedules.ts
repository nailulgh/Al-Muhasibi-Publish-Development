import type { Schedule, CreateScheduleDto } from 'shared/types/schedule'
import { apiFetch } from './client'

export async function fetchSchedules(): Promise<Schedule[]> {
  const { data, error } = await apiFetch<Schedule[]>('/api/schedules', { cache: 'no-store' })
  if (error || !data) throw new Error(error?.message || 'Gagal memuat data jadwal')
  return data
}

export async function createSchedule(payload: CreateScheduleDto): Promise<Schedule> {
  const { data, error } = await apiFetch<Schedule>('/api/schedules', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  if (error || !data) throw new Error(error?.message || 'Gagal menyimpan data')
  return data
}

export async function deleteSchedule(id: string): Promise<void> {
  const { error } = await apiFetch<null>(`/api/schedules/${id}`, {
    method: 'DELETE'
  })
  if (error) throw new Error(error.message || 'Gagal menghapus data')
}

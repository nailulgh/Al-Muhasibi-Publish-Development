export interface Schedule {
  id: string
  day: string
  time_start: string
  time_end: string
  activity_name: string
  location: string
  created_at: string
}

export interface CreateScheduleDto {
  day: string
  time_start: string
  time_end: string
  activity_name: string
  location: string
}

export interface Jadwal {
  id: number | string
  hari: string
  waktu: string
  kegiatan: string
  tempat: string
  penanggungJawab: string
  kategori: string
  time_start?: string
}

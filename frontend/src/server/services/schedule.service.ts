import { scheduleRepository } from '@/server/repositories/schedule.repository'
import type { Schedule, CreateScheduleDto } from '@/types/schedule'

export const scheduleService = {
  async findAll(): Promise<Schedule[]> {
    return scheduleRepository.findAll()
  },

  async findById(id: string): Promise<Schedule> {
    const item = await scheduleRepository.findById(id)
    if (!item) throw new Error('Data tidak ditemukan')
    return item
  },

  async create(dto: CreateScheduleDto): Promise<Schedule> {
    // Validation
    if (!dto.day || !dto.time_start || !dto.time_end || !dto.activity_name || !dto.location) {
      throw new Error('Semua data wajib diisi')
    }
    return scheduleRepository.create(dto)
  },

  async delete(id: string): Promise<void> {
    const existing = await scheduleRepository.findById(id)
    if (!existing) {
      throw new Error('Data tidak ditemukan')
    }
    return scheduleRepository.delete(id)
  }
}

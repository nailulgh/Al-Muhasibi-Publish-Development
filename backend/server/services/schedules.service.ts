import { schedulesRepository } from '../repositories/schedules.repository'
import type { Schedule, CreateScheduleDto } from 'shared/types/schedule'

export const schedulesService = {
  async getAll(): Promise<Schedule[]> {
    return schedulesRepository.findAll()
  },

  async getById(id: string): Promise<Schedule | null> {
    return schedulesRepository.findById(id)
  },

  async create(payload: CreateScheduleDto): Promise<Schedule> {
    return schedulesRepository.create(payload)
  },

  async update(id: string, payload: Partial<CreateScheduleDto>): Promise<Schedule> {
    return schedulesRepository.update(id, payload)
  },

  async delete(id: string): Promise<void> {
    return schedulesRepository.deleteById(id)
  }
}

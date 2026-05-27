import { programsRepository } from '../repositories/programs.repository'
import type { Program, CreateProgramDto, UpdateProgramDto } from 'shared/types/program'

export const programsService = {
  async getAll(): Promise<Program[]> {
    return programsRepository.findAll()
  },

  async getById(id: string): Promise<Program | null> {
    return programsRepository.findById(id)
  },

  async create(payload: CreateProgramDto): Promise<Program> {
    return programsRepository.create(payload)
  },

  async update(id: string, payload: UpdateProgramDto): Promise<Program> {
    return programsRepository.update(id, payload)
  },

  async delete(id: string): Promise<void> {
    return programsRepository.deleteById(id)
  }
}

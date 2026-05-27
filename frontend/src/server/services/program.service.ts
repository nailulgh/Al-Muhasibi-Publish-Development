import { programRepository } from '@/server/repositories/program.repository'
import type { Program, CreateProgramDto, UpdateProgramDto } from '@/types/program'

export const programService = {
  async count(): Promise<number> {
    return programRepository.count()
  },

  async findAll(): Promise<Program[]> {
    return programRepository.findAll()
  },

  async findById(id: string): Promise<Program> {
    const item = await programRepository.findById(id)
    if (!item) throw new Error('Data tidak ditemukan')
    return item
  },

  async create(dto: CreateProgramDto): Promise<Program> {
    if (!dto.title) {
      throw new Error('Judul program wajib diisi')
    }
    return programRepository.create(dto)
  },

  async update(id: string, dto: UpdateProgramDto): Promise<Program> {
    const existing = await programRepository.findById(id)
    if (!existing) {
      throw new Error('Data tidak ditemukan')
    }
    return programRepository.update(id, dto)
  },

  async delete(id: string): Promise<void> {
    const existing = await programRepository.findById(id)
    if (!existing) {
      throw new Error('Data tidak ditemukan')
    }
    return programRepository.delete(id)
  }
}

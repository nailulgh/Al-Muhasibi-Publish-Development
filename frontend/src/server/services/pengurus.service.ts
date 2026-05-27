import { pengurusRepository } from '@/server/repositories/pengurus.repository'
import type { Pengurus, CreatePengurusDto, UpdatePengurusDto } from '@/types/pengurus'

export const pengurusService = {
  async findAll(): Promise<Pengurus[]> {
    return pengurusRepository.findAll()
  },

  async findById(id: string): Promise<Pengurus> {
    const item = await pengurusRepository.findById(id)
    if (!item) throw new Error('Data tidak ditemukan')
    return item
  },

  async create(dto: CreatePengurusDto): Promise<Pengurus> {
    if (!dto.nama || !dto.jabatan) {
      throw new Error('Nama dan jabatan wajib diisi')
    }
    return pengurusRepository.create({
      ...dto,
      kategori: dto.kategori || 'TAMBAHAN'
    })
  },

  async update(id: string, dto: UpdatePengurusDto): Promise<Pengurus> {
    const existing = await pengurusRepository.findById(id)
    if (!existing) {
      throw new Error('Data tidak ditemukan')
    }
    return pengurusRepository.update(id, dto)
  },

  async delete(id: string): Promise<void> {
    const existing = await pengurusRepository.findById(id)
    if (!existing) {
      throw new Error('Data tidak ditemukan')
    }
    return pengurusRepository.delete(id)
  }
}

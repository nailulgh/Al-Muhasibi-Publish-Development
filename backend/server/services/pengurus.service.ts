import { pengurusRepository } from '../repositories/pengurus.repository'
import { createServerClient } from '../db/supabase'
import type { Pengurus, CreatePengurusDto, UpdatePengurusDto } from 'shared/types/pengurus'

export const pengurusService = {
  async getAll(): Promise<Pengurus[]> {
    return pengurusRepository.findAll()
  },

  async getById(id: string): Promise<Pengurus> {
    const item = await pengurusRepository.findById(id)
    if (!item) throw new Error('Data pengurus tidak ditemukan')
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
    if (!existing) throw new Error('Data pengurus tidak ditemukan')
    
    if (dto.foto && existing.foto && dto.foto !== existing.foto) {
      await this.deleteStorageFile(existing.foto)
    }

    return pengurusRepository.update(id, dto)
  },

  async delete(id: string): Promise<void> {
    const existing = await pengurusRepository.findById(id)
    if (!existing) throw new Error('Data pengurus tidak ditemukan')

    if (existing.foto) {
      await this.deleteStorageFile(existing.foto)
    }

    return pengurusRepository.deleteById(id)
  },

  async deleteStorageFile(url: string): Promise<void> {
    if (url && url.includes('profile-images/')) {
      try {
        const parts = url.split('profile-images/')
        const filePath = parts[parts.length - 1]
        const supabase = createServerClient()
        const { error } = await supabase.storage
          .from('profile-images')
          .remove([filePath])
        if (error) {
          console.error('Error deleting profile image from storage:', error)
        }
      } catch (err) {
        console.error('Failed to delete profile image from storage:', err)
      }
    }
  }
}

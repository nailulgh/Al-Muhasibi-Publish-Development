import { galleryRepository } from '../repositories/gallery.repository'
import { createServerClient } from '../db/supabase'
import type { GalleryItem, CreateGalleryDto, UpdateGalleryDto } from 'shared/types/gallery'

/**
 * Extracts the file path from a Supabase storage public URL
 */
function extractPath(url: string, bucketName: string): string | null {
  try {
    const parts = url.split(`${bucketName}/`)
    return parts.length > 1 ? parts[1] : null
  } catch (e) {
    return null
  }
}

export const galleryService = {
  async findAll(options?: { category?: string; limit?: number }): Promise<GalleryItem[]> {
    return galleryRepository.findAll(options)
  },

  async findById(id: string): Promise<GalleryItem | null> {
    return galleryRepository.findById(id)
  },

  async create(payload: CreateGalleryDto): Promise<GalleryItem> {
    if (!payload.title || !payload.category) {
      throw new Error('Judul dan Kategori wajib diisi')
    }
    return galleryRepository.create(payload)
  },

  async update(id: string, payload: UpdateGalleryDto): Promise<GalleryItem> {
    const existing = await galleryRepository.findById(id)
    if (!existing) {
      throw new Error('Item galeri tidak ditemukan')
    }

    // Storage cleanup if images are being replaced
    if (payload.image_urls !== undefined) {
      const oldImageUrls = existing.gallery_images?.map(img => img.image_url) || []
      const newImageUrls = payload.image_urls || []

      // Identify images that are no longer in the new array
      const removedUrls = oldImageUrls.filter(oldUrl => !newImageUrls.includes(oldUrl))
      
      if (removedUrls.length > 0) {
        const supabase = createServerClient()
        const pathsToRemove = removedUrls
          .map(url => extractPath(url, 'gallery-images'))
          .filter((path): path is string => path !== null)

        if (pathsToRemove.length > 0) {
          await supabase.storage.from('gallery-images').remove(pathsToRemove)
        }
      }
    }

    return galleryRepository.update(id, payload)
  },

  async delete(id: string): Promise<void> {
    const existing = await galleryRepository.findById(id)
    if (!existing) {
      throw new Error('Item galeri tidak ditemukan')
    }

    // 1. Delete all associated images from storage
    const imageUrls = existing.gallery_images?.map(img => img.image_url) || []
    
    if (imageUrls.length > 0) {
      const supabase = createServerClient()
      const pathsToRemove = imageUrls
        .map(url => extractPath(url, 'gallery-images'))
        .filter((path): path is string => path !== null)
      
      if (pathsToRemove.length > 0) {
        await supabase.storage.from('gallery-images').remove(pathsToRemove)
      }
    }

    // 2. Delete from database (cascade will handle gallery_images table)
    await galleryRepository.deleteById(id)
  }
}

import { galleryRepository } from '@/server/repositories/gallery.repository'
import { galleryImageRepository } from '@/server/repositories/gallery-image.repository'
import type { GalleryItem, CreateGalleryDto, UpdateGalleryDto } from '@/types/gallery'

export const galleryService = {
  async findAll(options?: { category?: string, limit?: number }): Promise<GalleryItem[]> {
    return galleryRepository.findAll(options)
  },

  async count(): Promise<number> {
    return galleryRepository.count()
  },

  async findById(id: string): Promise<GalleryItem | null> {
    return galleryRepository.findById(id)
  },

  async create(dto: CreateGalleryDto): Promise<GalleryItem> {
    const { image_urls, ...rest } = dto
    const imageUrl = image_urls && image_urls.length > 0 ? image_urls[0] : null
    
    // 1. Create gallery item
    const created = await galleryRepository.create({
      ...rest,
      image_url: imageUrl
    })

    // 2. Create gallery images if provided
    if (image_urls && image_urls.length > 0) {
      const imagesToInsert = image_urls.map((url, index) => ({
        gallery_id: created.id,
        image_url: url,
        display_order: index
      }))
      await galleryImageRepository.createMany(imagesToInsert)
      // fetch latest with relations
      const fresh = await galleryRepository.findById(created.id)
      return fresh || created
    }

    return created
  },

  async update(id: string, dto: UpdateGalleryDto): Promise<GalleryItem> {
    const existing = await galleryRepository.findById(id)
    if (!existing) throw new Error('Data tidak ditemukan')

    const { image_urls, ...rest } = dto
    
    // Only update image_url if image_urls is provided (meaning it was modified)
    const updatePayload: any = { ...rest }
    if (image_urls !== undefined) {
      updatePayload.image_url = image_urls && image_urls.length > 0 ? image_urls[0] : null
    }

    // 1. Update gallery item
    const updated = await galleryRepository.update(id, updatePayload)

    // 2. Manage images if image_urls is provided
    if (image_urls !== undefined) {
      // Clear old images
      await galleryImageRepository.deleteByGalleryId(id)
      
      // Insert new ones
      if (image_urls.length > 0) {
        const imagesToInsert = image_urls.map((url, index) => ({
          gallery_id: id,
          image_url: url,
          display_order: index
        }))
        await galleryImageRepository.createMany(imagesToInsert)
      }
    }

    // Return fresh data with relations
    const fresh = await galleryRepository.findById(id)
    return fresh || updated
  },

  async deleteWithImages(id: string): Promise<void> {
    const existing = await galleryRepository.findById(id)
    if (!existing) throw new Error('Data tidak ditemukan')

    // 1. Collect all URLs to delete from storage
    const urls = new Set<string>()
    if (existing.image_url) urls.add(existing.image_url)
    if (existing.gallery_images) {
      existing.gallery_images.forEach(img => urls.add(img.image_url))
    }

    // 2. Delete from database
    await galleryRepository.delete(id)

    // 3. Cleanup storage
    if (urls.size > 0) {
      const pathsToDelete: string[] = []
      urls.forEach(url => {
        const pathParts = url.split('gallery-images/')
        if (pathParts.length > 1) {
          pathsToDelete.push(pathParts[1])
        }
      })
      await galleryRepository.removeImagesFromStorage(pathsToDelete)
    }
  }
}

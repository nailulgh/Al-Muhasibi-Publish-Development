import { createServerClient } from '../db/supabase'
import type { GalleryItem, CreateGalleryDto, UpdateGalleryDto } from 'shared/types/gallery'

export const galleryRepository = {
  async findAll(options?: { category?: string; limit?: number }): Promise<GalleryItem[]> {
    const supabase = createServerClient()
    
    let query = supabase
      .from('gallery')
      .select('*, gallery_images(id, image_url, display_order)')
      .order('created_at', { ascending: false })

    if (options?.category && options.category !== 'Semua') {
      query = query.eq('category', options.category)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    
    // Sort gallery_images by display_order for each item
    const formattedData = (data ?? []).map(item => ({
      ...item,
      gallery_images: item.gallery_images?.sort((a: any, b: any) => a.display_order - b.display_order) || []
    }))

    return formattedData as GalleryItem[]
  },

  async findById(id: string): Promise<GalleryItem | null> {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('gallery')
      .select('*, gallery_images(id, image_url, display_order)')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new Error(error.message)
    }

    if (data) {
       data.gallery_images = data.gallery_images?.sort((a: any, b: any) => a.display_order - b.display_order) || []
    }

    return data as GalleryItem | null
  },

  async create(payload: CreateGalleryDto): Promise<GalleryItem> {
    const supabase = createServerClient()
    
    // Extract image_urls from payload
    const { image_urls, ...galleryData } = payload

    // Insert into gallery table
    const insertData = {
      ...galleryData,
      image_url: image_urls && image_urls.length > 0 ? image_urls[0] : null
    }

    const { data: newGallery, error: galleryError } = await supabase
      .from('gallery')
      .insert(insertData)
      .select()
      .single()

    if (galleryError) throw new Error(galleryError.message)

    // Insert into gallery_images table
    if (image_urls && image_urls.length > 0) {
      const imagesToInsert = image_urls.map((url, index) => ({
        gallery_id: newGallery.id,
        image_url: url,
        display_order: index
      }))

      const { error: imagesError } = await supabase
        .from('gallery_images')
        .insert(imagesToInsert)

      if (imagesError) {
        // Rollback is tricky without explicit RPC transaction, but for this context we just throw.
        throw new Error(`Gagal menyimpan gambar: ${imagesError.message}`)
      }
    }

    return this.findById(newGallery.id) as Promise<GalleryItem>
  },

  async update(id: string, payload: UpdateGalleryDto): Promise<GalleryItem> {
    const supabase = createServerClient()
    
    const { image_urls, ...galleryData } = payload

    const updateData: any = { ...galleryData }
    
    if (image_urls !== undefined) {
       updateData.image_url = image_urls && image_urls.length > 0 ? image_urls[0] : null
    }

    // Update gallery table
    if (Object.keys(updateData).length > 0) {
      const { error: galleryError } = await supabase
        .from('gallery')
        .update(updateData)
        .eq('id', id)

      if (galleryError) throw new Error(galleryError.message)
    }

    // Update gallery_images if image_urls is provided
    if (image_urls !== undefined) {
      // Delete existing images
      const { error: deleteError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('gallery_id', id)
        
      if (deleteError) throw new Error(deleteError.message)

      // Insert new images
      if (image_urls.length > 0) {
        const imagesToInsert = image_urls.map((url, index) => ({
          gallery_id: id,
          image_url: url,
          display_order: index
        }))

        const { error: insertError } = await supabase
          .from('gallery_images')
          .insert(imagesToInsert)

        if (insertError) throw new Error(insertError.message)
      }
    }

    return this.findById(id) as Promise<GalleryItem>
  },

  async deleteById(id: string): Promise<void> {
    const supabase = createServerClient()
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}

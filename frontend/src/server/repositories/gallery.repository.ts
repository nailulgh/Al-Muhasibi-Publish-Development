import { createServerClient } from '@/server/db/supabase'
import type { GalleryItem, CreateGalleryDto, UpdateGalleryDto } from '@/types/gallery'

export const galleryRepository = {
  async findAll(options?: { category?: string, limit?: number }): Promise<GalleryItem[]> {
    const supabase = await createServerClient()
    let query = supabase
      .from('gallery')
      .select(`
        *,
        gallery_images (
          id,
          image_url,
          display_order
        )
      `)
      .order('created_at', { ascending: false })

    if (options?.category && options.category !== 'Semua') {
      query = query.eq('category', options.category)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query
    
    // Sort gallery_images by display_order for each item
    const formattedData = data?.map((item: any) => {
        if (item.gallery_images && Array.isArray(item.gallery_images)) {
            item.gallery_images.sort((a: any, b: any) => a.display_order - b.display_order)
        }
        return item
    })

    if (error) throw new Error(error.message)
    return formattedData ?? []
  },

  async count(): Promise<number> {
    const supabase = await createServerClient()
    const { count, error } = await supabase
      .from('gallery')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw new Error(error.message)
    return count ?? 0
  },

  async findById(id: string): Promise<GalleryItem | null> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('gallery')
      .select(`
        *,
        gallery_images (
          id,
          image_url,
          display_order
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new Error(error.message)
    }
    
    if (data && data.gallery_images && Array.isArray(data.gallery_images)) {
        data.gallery_images.sort((a: any, b: any) => a.display_order - b.display_order)
    }
    
    return data
  },

  async create(dto: Omit<CreateGalleryDto, 'image_urls'> & { image_url: string | null }): Promise<GalleryItem> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('gallery')
      .insert(dto)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async update(id: string, dto: Omit<UpdateGalleryDto, 'image_urls'> & { image_url?: string | null }): Promise<GalleryItem> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('gallery')
      .update(dto)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async delete(id: string): Promise<void> {
    const supabase = await createServerClient()
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },

  async removeImagesFromStorage(paths: string[]): Promise<void> {
    if (!paths.length) return
    const supabase = await createServerClient()
    const { error } = await supabase.storage.from('gallery-images').remove(paths)
    if (error) {
      console.error('Failed to cleanup storage:', error)
    }
  }
}

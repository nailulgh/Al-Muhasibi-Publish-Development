import { createServerClient } from '@/server/db/supabase'
import type { GalleryImage } from '@/types/gallery'

export const galleryImageRepository = {
  async createMany(images: { gallery_id: string, image_url: string, display_order: number }[]): Promise<void> {
    if (!images.length) return
    const supabase = await createServerClient()
    const { error } = await supabase.from('gallery_images').insert(images)
    if (error) throw new Error(error.message)
  },

  async deleteByGalleryId(galleryId: string): Promise<void> {
    const supabase = await createServerClient()
    const { error } = await supabase.from('gallery_images').delete().eq('gallery_id', galleryId)
    if (error) throw new Error(error.message)
  },
  
  async findByGalleryId(galleryId: string): Promise<GalleryImage[]> {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('gallery_id', galleryId)
        .order('display_order', { ascending: true })
        
    if (error) throw new Error(error.message)
    return data ?? []
  }
}

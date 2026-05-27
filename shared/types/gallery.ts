export interface GalleryItem {
  id: string
  title: string | null
  caption: string | null
  content: string | null
  image_url: string | null
  category: string
  sub_category: string | null
  event_date: string | null
  instagram_url: string | null
  created_at?: string
  gallery_images?: GalleryImage[]
}

export interface GalleryImage {
  id: string
  gallery_id: string
  image_url: string
  display_order: number
  created_at?: string
}

export interface CreateGalleryDto {
  title: string
  caption?: string
  content?: string
  category: string
  sub_category?: string
  event_date?: string
  instagram_url?: string
  image_urls?: string[]
}

export interface UpdateGalleryDto extends Partial<CreateGalleryDto> {}

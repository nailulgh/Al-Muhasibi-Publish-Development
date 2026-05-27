import { fetchGalleryById } from '@/lib/api/gallery'
import EditGalleryForm from './form'
import { notFound } from 'next/navigation'

export default async function EditGalleryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  
  let item = null;
  try {
    item = await fetchGalleryById(params.id)
  } catch (error) {
    notFound()
  }

  // Construct the initial images array
  let initialImages: string[] = []
  
  if (item.gallery_images && item.gallery_images.length > 0) {
    initialImages = item.gallery_images.map(img => img.image_url)
  } else if (item.image_url) {
    // Fallback for migrated data if gallery_images is empty but image_url exists
    initialImages = [item.image_url]
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-heading">Edit Item Galeri</h1>
          <p className="text-[var(--text-secondary)]">Perbarui informasi item galeri</p>
        </div>
      </div>
      
      <EditGalleryForm item={item} initialImages={initialImages} />
    </div>
  )
}

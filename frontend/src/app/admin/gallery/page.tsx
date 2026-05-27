import { fetchGallery } from '@/lib/api/gallery'
import Link from 'next/link'
import { Plus, Pencil, Calendar, ImageIcon, Instagram, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import DeleteButton from '@/components/DeleteButton'

export default async function GalleryAdminPage() {
  const items = await fetchGallery()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-heading">Kelola Galeri</h1>
          <p className="text-[var(--text-secondary)]">Dokumentasi kegiatan, fasilitas, dan prestasi asrama</p>
        </div>
        <Link
          href="/admin/gallery/create"
          className="btn btn-primary inline-flex items-center gap-2 bg-[var(--accent-gold)] text-[#423512] px-4 py-2 rounded-lg font-medium hover:brightness-110 transition-all w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Item</span>
        </Link>
      </div>

      <div className="bg-[var(--foreground)] rounded-xl border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-[var(--background)] border-b border-[var(--border-color)]">
              <tr>
                <th className="p-4 font-medium text-[var(--text-secondary)] w-24">Gambar</th>
                <th className="p-4 font-medium text-[var(--text-secondary)]">Judul & Caption</th>
                <th className="p-4 font-medium text-[var(--text-secondary)] w-40">Kategori</th>
                <th className="p-4 font-medium text-[var(--text-secondary)] w-36">Tanggal</th>
                <th className="p-4 font-medium text-[var(--text-secondary)] w-28 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {items?.map((item) => (
                <tr key={item.id} className="group hover:bg-[var(--background)]/50 transition-colors">
                  <td className="p-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--background)] border border-[var(--border-color)]">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.title || item.caption || ''} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="w-6 h-6 text-[var(--text-secondary)]" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1">
                      {item.title || item.caption || 'Tanpa judul'}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-1 mt-1">{item.caption}</p>
                    {item.instagram_url && (
                      <a href={item.instagram_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-pink-500 mt-1 hover:underline">
                        <Instagram className="w-3 h-3" /> Instagram
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--accent-olive)]/10 text-[var(--accent-olive)] font-medium">
                      {item.category}
                    </span>
                    {item.sub_category && (
                      <span className="block text-xs text-[var(--text-secondary)] mt-1">{item.sub_category}</span>
                    )}
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {item.event_date ? (
                      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--text-secondary)]">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/gallery/${item.id}/edit`}
                        className="p-2 text-[var(--accent-olive)] hover:bg-[var(--accent-olive)]/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteButton id={item.id} resource="gallery" label="Hapus item ini" />
                    </div>
                  </td>
                </tr>
              ))}
              {(!items || items.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--text-secondary)]">
                    Belum ada item galeri. Silakan tambah item baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

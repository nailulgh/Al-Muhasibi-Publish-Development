'use client'

import { Trash2 } from 'lucide-react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  id: string
  resource: 'schedules' | 'pengurus' | 'gallery'
  label?: string
}

export default function DeleteButton({ id, resource, label = 'Hapus' }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = async () => {
    try {
      if (resource === 'schedules') {
        const { deleteSchedule } = await import('@/lib/api/schedules')
        await deleteSchedule(id)
      } else if (resource === 'pengurus') {
        const { deletePengurus } = await import('@/lib/api/pengurus')
        await deletePengurus(id)
      } else if (resource === 'gallery') {
        const { deleteGallery } = await import('@/lib/api/gallery')
        await deleteGallery(id)
      }
      router.refresh()
    } catch (error: any) {
      alert(`Error: ${error.message || 'Gagal menghapus data'}`)
    }
  }

  return (
    <button
      type="button"
      disabled={isPending}
      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer disabled:opacity-50"
      title={label}
      onClick={() => {
        if (confirm(`${label}?`)) {
          startTransition(handleDelete)
        }
      }}
    >
      <Trash2 className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
    </button>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/server/db/supabase'
import { galleryService } from '@/server/services/gallery.service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const data = await galleryService.findById(resolvedParams.id)
    if (!data) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 })
    }
    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal memuat data' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Tidak memiliki akses' }, { status: 401 })
  }

  try {
    const resolvedParams = await params
    const body = await request.json()
    const data = await galleryService.update(resolvedParams.id, body)
    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menyimpan data' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Tidak memiliki akses' }, { status: 401 })
  }

  try {
    const resolvedParams = await params
    await galleryService.deleteWithImages(resolvedParams.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menghapus data' }, { status: 500 })
  }
}

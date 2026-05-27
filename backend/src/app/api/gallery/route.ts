import { NextResponse } from 'next/server'
import { galleryService } from '../../../../server/services/gallery.service'
import type { CreateGalleryDto } from 'shared/types/gallery'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || undefined
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined

    const data = await galleryService.findAll({ category, limit })
    
    return NextResponse.json({ data, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Gagal mengambil data galeri', code: 'FETCH_ERROR' } },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateGalleryDto = await request.json()
    
    // Validasi basic
    if (!body.title) {
      return NextResponse.json(
        { data: null, error: { message: 'Judul wajib diisi', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      )
    }

    if (!body.category) {
      return NextResponse.json(
        { data: null, error: { message: 'Kategori wajib diisi', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      )
    }

    const data = await galleryService.create(body)
    return NextResponse.json({ data, error: null }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Gagal membuat galeri baru', code: 'CREATE_ERROR' } },
      { status: 500 }
    )
  }
}

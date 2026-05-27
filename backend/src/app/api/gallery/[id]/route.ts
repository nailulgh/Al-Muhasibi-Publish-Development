import { NextResponse } from 'next/server'
import { galleryService } from '../../../../../server/services/gallery.service'
import type { UpdateGalleryDto } from 'shared/types/gallery'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await galleryService.findById(id)
    
    if (!data) {
      return NextResponse.json(
        { data: null, error: { message: 'Item galeri tidak ditemukan', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ data, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Gagal mengambil data galeri', code: 'FETCH_ERROR' } },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateGalleryDto = await request.json()
    const data = await galleryService.update(id, body)
    
    return NextResponse.json({ data, error: null })
  } catch (error: any) {
    if (error.message === 'Item galeri tidak ditemukan') {
      return NextResponse.json(
        { data: null, error: { message: error.message, code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Gagal mengubah data galeri', code: 'UPDATE_ERROR' } },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await galleryService.delete(id)
    
    return NextResponse.json({ data: { success: true }, error: null })
  } catch (error: any) {
    if (error.message === 'Item galeri tidak ditemukan') {
      return NextResponse.json(
        { data: null, error: { message: error.message, code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { data: null, error: { message: error.message || 'Gagal menghapus data galeri', code: 'DELETE_ERROR' } },
      { status: 500 }
    )
  }
}

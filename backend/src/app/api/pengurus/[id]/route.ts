import { NextResponse } from 'next/server'
import { pengurusService } from '../../../../../server/services/pengurus.service'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await pengurusService.getById(id)
    return NextResponse.json({ data, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Data tidak ditemukan', code: 'NOT_FOUND' } },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = await pengurusService.update(id, body)
    return NextResponse.json({ data, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Gagal memperbarui pengurus', code: 'UPDATE_ERROR' } },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await pengurusService.delete(id)
    return NextResponse.json({ data: { success: true }, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Gagal menghapus pengurus', code: 'DELETE_ERROR' } },
      { status: 400 }
    )
  }
}

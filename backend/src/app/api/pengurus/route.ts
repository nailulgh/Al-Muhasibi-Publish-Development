import { NextResponse } from 'next/server'
import { pengurusService } from '../../../../server/services/pengurus.service'

export async function GET() {
  try {
    const data = await pengurusService.getAll()
    return NextResponse.json({ data, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Terjadi kesalahan', code: 'FETCH_ERROR' } },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await pengurusService.create(body)
    return NextResponse.json({ data, error: null }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Gagal membuat pengurus', code: 'CREATE_ERROR' } },
      { status: 400 }
    )
  }
}

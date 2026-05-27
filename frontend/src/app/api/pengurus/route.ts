import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/server/db/supabase'
import { pengurusService } from '@/server/services/pengurus.service'

export async function GET(request: NextRequest) {
  try {
    const data = await pengurusService.findAll()
    return NextResponse.json({ data })
  } catch (error) {
    console.error('[API.pengurus.GET]', error)
    return NextResponse.json(
      { error: 'Gagal memuat data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Tidak memiliki akses' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const data = await pengurusService.create(body)
    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    console.error('[API.pengurus.POST]', error)
    return NextResponse.json(
      { error: error.message || 'Gagal menyimpan data' },
      { status: 500 }
    )
  }
}

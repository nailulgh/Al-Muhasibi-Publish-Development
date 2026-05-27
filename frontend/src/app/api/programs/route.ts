import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/server/db/supabase'
import { programService } from '@/server/services/program.service'

export async function GET(request: NextRequest) {
  try {
    const data = await programService.findAll()
    return NextResponse.json({ data })
  } catch (error) {
    console.error('[API.programs.GET]', error)
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
    const data = await programService.create(body)
    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    console.error('[API.programs.POST]', error)
    return NextResponse.json(
      { error: error.message || 'Gagal menyimpan data' },
      { status: 500 }
    )
  }
}

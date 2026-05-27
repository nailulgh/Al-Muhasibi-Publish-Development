import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/server/db/supabase'
import { programService } from '@/server/services/program.service'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Tidak memiliki akses' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    const body = await request.json()
    const data = await programService.update(id, body)
    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('[API.programs.id.PUT]', error)
    return NextResponse.json(
      { error: error.message || 'Gagal menyimpan data' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Tidak memiliki akses' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    await programService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[API.programs.id.DELETE]', error)
    return NextResponse.json(
      { error: error.message || 'Gagal menghapus data' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/server/db/supabase'
import { scheduleService } from '@/server/services/schedule.service'

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
    await scheduleService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[API.schedules.id.DELETE]', error)
    return NextResponse.json(
      { error: error.message || 'Gagal menghapus data' },
      { status: 500 }
    )
  }
}

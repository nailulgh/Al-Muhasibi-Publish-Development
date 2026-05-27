import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/server/db/supabase'
import { scheduleService } from '@/server/services/schedule.service'

export async function GET(request: NextRequest) {
  try {
    const data = await scheduleService.findAll()
    return NextResponse.json({ data })
  } catch (error) {
    console.error('[API.schedules.GET]', error)
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
    const data = await scheduleService.create(body)
    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    console.error('[API.schedules.POST]', error)
    return NextResponse.json(
      { error: error.message || 'Gagal menyimpan data' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/server/db/supabase'
import { galleryService } from '@/server/services/gallery.service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const category = searchParams.get('category') ?? undefined
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined
    
    const data = await galleryService.findAll({ category, limit })
    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal memuat data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Tidak memiliki akses' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = await galleryService.create(body)
    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menyimpan data' }, { status: 500 })
  }
}

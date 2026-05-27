import { NextResponse } from 'next/server'
import { createServerClient } from '../../../../../server/db/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json(
        { data: null, error: { message: 'File tidak ditemukan', code: 'BAD_REQUEST' } },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { data: null, error: { message: 'File harus berupa gambar', code: 'INVALID_FILE_TYPE' } },
        { status: 400 }
      )
    }

    // Limit to 2MB
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { data: null, error: { message: 'Ukuran file maksimal 2MB', code: 'FILE_TOO_LARGE' } },
        { status: 400 }
      )
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    
    // Convert File to ArrayBuffer, then to Buffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const supabase = createServerClient()
    const { error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(fileName)

    return NextResponse.json({ data: { url: publicUrl }, error: null }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Gagal mengupload gambar', code: 'UPLOAD_ERROR' } },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')
    
    if (!filePath) {
      return NextResponse.json(
        { data: null, error: { message: 'Path file tidak ditentukan', code: 'BAD_REQUEST' } },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    const { data, error } = await supabase.storage
      .from('gallery-images')
      .remove([filePath])

    if (error) throw error

    return NextResponse.json({ data, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Gagal menghapus gambar dari storage', code: 'DELETE_ERROR' } },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { programsService } from '../../../../../server/services/programs.service'
import type { ApiResponse } from 'shared/types/api'
import type { Program } from 'shared/types/program'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Program>>> {
  try {
    const { id } = await params
    const body = await request.json()
    const updated = await programsService.update(id, body)
    return NextResponse.json({ data: updated, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Internal Server Error', code: 'UPDATE_ERROR' } },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = await params
    await programsService.delete(id)
    return NextResponse.json({ data: null, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Internal Server Error', code: 'DELETE_ERROR' } },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { schedulesService } from '../../../../../server/services/schedules.service'
import type { ApiResponse } from 'shared/types/api'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = await params
    await schedulesService.delete(id)
    return NextResponse.json({ data: null, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Internal Server Error', code: 'DELETE_ERROR' } },
      { status: 500 }
    )
  }
}

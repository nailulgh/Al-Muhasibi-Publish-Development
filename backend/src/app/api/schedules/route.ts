import { NextResponse } from 'next/server'
import { schedulesService } from '../../../../server/services/schedules.service'
import type { ApiResponse } from 'shared/types/api'
import type { Schedule } from 'shared/types/schedule'

export async function GET(): Promise<NextResponse<ApiResponse<Schedule[]>>> {
  try {
    const schedules = await schedulesService.getAll()
    return NextResponse.json({ data: schedules, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Internal Server Error', code: 'FETCH_ERROR' } },
      { status: 500 }
    )
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<Schedule>>> {
  try {
    const body = await request.json()
    const schedule = await schedulesService.create(body)
    return NextResponse.json({ data: schedule, error: null }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Internal Server Error', code: 'CREATE_ERROR' } },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { programsService } from '../../../../server/services/programs.service'
import type { ApiResponse } from 'shared/types/api'
import type { Program } from 'shared/types/program'

export async function GET(): Promise<NextResponse<ApiResponse<Program[]>>> {
  try {
    const programs = await programsService.getAll()
    return NextResponse.json({ data: programs, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Internal Server Error', code: 'FETCH_ERROR' } },
      { status: 500 }
    )
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<Program>>> {
  try {
    const body = await request.json()
    const program = await programsService.create(body)
    return NextResponse.json({ data: program, error: null }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { message: error.message || 'Internal Server Error', code: 'CREATE_ERROR' } },
      { status: 500 }
    )
  }
}

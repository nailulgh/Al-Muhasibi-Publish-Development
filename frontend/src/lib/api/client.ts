import type { ApiResponse } from 'shared/types/api'

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message || 'Terjadi kesalahan')
    return json
  } catch (error) {
    return {
      data: null as any,
      error: { message: error instanceof Error ? error.message : 'Terjadi kesalahan', code: 'FETCH_ERROR' }
    }
  }
}

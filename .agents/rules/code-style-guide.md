---
trigger: always_on
---

# Rule: Code Style Guide

## TypeScript
- Selalu gunakan TypeScript strict mode
- Tidak boleh ada `any` — gunakan `unknown` lalu narrow, atau buat proper type di shared/
- Selalu definisikan return type untuk fungsi public
- Gunakan `interface` untuk object shapes, `type` untuk unions/primitives

## Penamaan
- Files: kebab-case (`schedules.service.ts`, `useGallery.ts`)
- Components: PascalCase (`GalleryCard.tsx`)
- Hooks: camelCase dengan prefix `use` (`useSchedules`)
- Services: camelCase dengan suffix `Service` (`schedulesService`)
- Repositories: camelCase dengan suffix `Repository` (`schedulesRepository`)
- Types/Interfaces: PascalCase (`Schedule`, `ApiResponse`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`)
- CSS classes: Tailwind utility hanya, pakai `cn()` untuk conditional

## React & Next.js
- Server Components: default (tidak perlu 'use client')
- Client Components: tambahkan 'use client' hanya jika perlu interaktivitas
- Tidak ada 'use server' di frontend/ — deprecated di arsitektur baru
- Gunakan React.memo() untuk list items yang sering re-render
- Semua image wajib pakai next/image dengan sizes prop

## Fetch & API
- Base URL selalu dari env: `process.env.NEXT_PUBLIC_API_URL`
- Semua fetch pakai wrapper dari `lib/api/client.ts`
- Selalu handle error — tidak boleh ada fetch tanpa try/catch
- Response harus divalidasi formatnya sebelum digunakan
- Loading dan error state wajib ditampilkan di UI

## CSS & Styling
- Wajib pakai CSS variables untuk warna — TIDAK hardcode hex
- Gunakan Tailwind utility classes
- Untuk conditional classes gunakan `clsx` atau `cn()`
- Responsive: mobile-first (sm: md: lg:)
- Dark mode: sudah handle via CSS variables, tidak perlu dark: prefix untuk warna brand

## Bahasa UI
- Semua teks UI dalam Bahasa Indonesia
- Error message: Bahasa Indonesia
- Console.log/error: boleh Bahasa Inggris
- Komentar kode: boleh Bahasa Inggris atau Indonesia

## Contoh Response Handler yang Benar
```typescript
// lib/api/client.ts
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
      data: null,
      error: { message: error instanceof Error ? error.message : 'Terjadi kesalahan', code: 'FETCH_ERROR' }
    }
  }
}
```

## Contoh Repository yang Benar
```typescript
// backend/server/repositories/schedules.repository.ts
import { createServerClient } from '../db/supabase'
import type { Schedule } from 'shared/types/schedule'

export const schedulesRepository = {
  async findAll(): Promise<Schedule[]> {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('time_start', { ascending: true })
    if (error) throw new Error(error.message)
    return data ?? []
  },

  async deleteById(id: string): Promise<void> {
    const supabase = createServerClient()
    const { error } = await supabase.from('schedules').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}
```

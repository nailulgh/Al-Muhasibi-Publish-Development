---
description: 
---

# Workflow: /scaffold-resource

## Trigger
`/scaffold-resource [resource-name] [table-name]`

Contoh: `/scaffold-resource schedule schedules`

## Yang Akan Dibuat Agen

### 1. shared/types/[resource].ts
Type definitions yang dipakai frontend dan backend.
```typescript
export interface Schedule {
  id: string
  day: string
  time_start: string
  time_end: string
  activity_name: string
  location: string
  created_at: string
}

export interface CreateScheduleDto {
  day: string
  time_start: string
  time_end: string
  activity_name: string
  location: string
}

export interface UpdateScheduleDto extends Partial<CreateScheduleDto> {}
```

### 2. backend/server/repositories/[resource].repository.ts
Query Supabase — findAll, findById, create, update, delete.

### 3. backend/server/services/[resource].service.ts
Business logic — validasi, transformasi, orchestrasi.

### 4. backend/src/app/api/[resource]/route.ts
Route Handlers — GET, POST, PUT, DELETE dengan proper error handling.

### 5. frontend/src/lib/api/[resource].ts
Fetch wrapper yang memanggil backend endpoint.

### 6. frontend/src/hooks/use[Resource].ts
Custom hook dengan state management (loading, error, data).

## Agen WAJIB
- Tampilkan Implementation Plan dulu sebelum menulis file
- Gunakan response format: `{ data, error, meta? }`
- Setiap fungsi punya TypeScript return type eksplisit
- Handle semua error dengan pesan Bahasa Indonesia
- Sesuaikan dengan tabel Supabase yang sudah ada (jangan buat migration baru)

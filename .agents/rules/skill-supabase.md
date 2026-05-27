---
trigger: always_on
---

# Rule: Supabase & Database

## Prinsip Utama
- Supabase client HANYA boleh diinisialisasi di `backend/server/db/supabase.ts`
- Frontend TIDAK boleh import atau menggunakan Supabase langsung (kecuali auth)
- Semua query database HANYA di layer repository

## Inisialisasi Supabase di Backend
```typescript
// backend/server/db/supabase.ts
import { createClient } from '@supabase/supabase-js'

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## Auth di Frontend (Exception yang Diizinkan)
```typescript
// frontend/src/lib/supabase-auth.ts — HANYA untuk auth
import { createBrowserClient } from '@supabase/ssr'

export function createAuthClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## RLS (Row Level Security) — Sudah Ada, Jangan Diubah
- Public read: semua table boleh dibaca tanpa auth
- Write: hanya authenticated users
- Jangan tambah atau hapus policy tanpa diskusi eksplisit

## Storage
- Bucket: gallery-images, profile-images, activity-images (sudah ada)
- Upload: HANYA dari backend (via service layer)
- Delete: HARUS hapus file storage sebelum hapus record DB
- URL: gunakan publicUrl dari Supabase storage

## Pola Query yang Benar
```typescript
// ✅ BENAR — di repository
const { data, error } = await supabase.from('schedules').select('*')
if (error) throw new Error(error.message)
return data ?? []

// ❌ SALAH — jangan return error Supabase mentah ke client
const { data, error } = await supabase.from('schedules').select('*')
return { data, error } // jangan begini
```

## Penanganan Relasi (gallery + gallery_images)
```typescript
// Fetch gallery dengan images sekaligus
const { data } = await supabase
  .from('gallery')
  .select('*, gallery_images(image_url, display_order)')
  .order('created_at', { ascending: false })
```

## File Cleanup Sebelum Delete
```typescript
// Wajib hapus file storage sebelum hapus record
async function deleteGalleryItem(id: string) {
  // 1. Ambil semua URLs dulu
  const { data: images } = await supabase
    .from('gallery_images')
    .select('image_url')
    .eq('gallery_id', id)

  // 2. Hapus dari storage
  const paths = images?.map(img => extractPath(img.image_url, 'gallery-images')) ?? []
  if (paths.length > 0) {
    await supabase.storage.from('gallery-images').remove(paths)
  }

  // 3. Baru hapus dari DB (cascade akan hapus gallery_images)
  await supabase.from('gallery').delete().eq('id', id)
}
```

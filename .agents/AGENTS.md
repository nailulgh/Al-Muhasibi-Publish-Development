# AGENTS.md — Al Muhasibi Monorepo Master Guide

## Konteks Project
Al Muhasibi Management System adalah platform manajemen asrama UIN Maliki Malang.
Arsitektur: **True Decoupled Monorepo** — frontend dan backend adalah dua aplikasi terpisah
yang di-deploy secara independen, berkomunikasi via HTTP REST API.

## Struktur Monorepo
```
├── frontend/          ← Next.js 16 (App Router) — hanya UI, deploy ke Vercel
├── backend/           ← Next.js 16 (API Only) — hanya Route Handlers, deploy ke Vercel
├── shared/            ← TypeScript types & constants yang dipakai keduanya
└── .agents/           ← File konfigurasi agen ini
```

## Status Migrasi
Project lama (mabna-app/) sedang dalam proses migrasi BERTAHAP ke struktur monorepo.
Jangan hapus mabna-app/ sampai semua fase migrasi selesai dan diverifikasi.

## Teknologi Stack (JANGAN UPGRADE TANPA DISKUSI)
- Next.js: 16.1.6
- React: 19.2.3
- TypeScript: ^5
- Supabase JS: ^2.95.3
- Tailwind: ^4
- date-fns: ^4.1.0
- lucide-react: ^0.563.0

## Aturan Komunikasi Frontend ↔ Backend
- Frontend HANYA boleh fetch ke `NEXT_PUBLIC_API_URL` (backend URL)
- Frontend DILARANG import apapun dari folder backend/
- Frontend DILARANG akses Supabase langsung (kecuali auth client-side)
- Backend DILARANG import apapun dari folder frontend/
- Shared types diimport dari shared/ oleh keduanya
- Semua response backend menggunakan format: `{ data, error, meta }`

## Aturan Backend (Next.js API Only)
- Hanya boleh ada folder app/api/ — tidak ada pages, components, atau UI
- Semua Supabase query HANYA di layer repository
- Semua business logic HANYA di layer service
- Route Handlers hanya boleh: validasi input, panggil service, return response
- Gunakan Supabase server client (bukan browser client)

## Aturan Frontend (Next.js UI Only)
- Tidak ada folder app/api/ — semua data fetch ke backend
- Server Components boleh fetch langsung ke backend (bukan via hook)
- Client Components wajib pakai custom hooks dari hooks/
- Semua fetch wrapper ada di lib/api/
- DILARANG: 'use server', Server Actions, direct Supabase import

## Aturan Shared
- Hanya berisi TypeScript types, interfaces, enums, dan constants
- Tidak boleh ada logic, fetch, atau framework-specific code
- Semua nama type menggunakan PascalCase

## CSS & Desain (JANGAN DIUBAH)
Gunakan CSS variables yang sudah ada:
- `--accent-olive` — warna primer hijau
- `--accent-gold` — warna sekunder emas
- `--background`, `--foreground`
- `--text-primary`, `--text-secondary`
- `--border-color`
- Font: `--font-heading` (Montserrat), `--font-body` (Open Sans), `--font-arabic` (Amiri)

## Larangan Absolut untuk Agen 
- ❌ Jangan ubah tampilan UI apapun — desain harus identik dengan mabna-app/
- ❌ Jangan ubah database schema atau file .sql
- ❌ Jangan hardcode warna, selalu pakai CSS variables
- ❌ Jangan ganti bahasa UI dari Indonesia ke Inggris
- ❌ Jangan hapus mabna-app/ sebelum semua fase migrasi selesai
- ❌ Jangan tambah dependency baru tanpa persetujuan eksplisit
- ❌ Jangan ubah URL publik yang sudah ada (/galeri, /jadwal, /profile)

## Database (Supabase — TIDAK BERUBAH)
Tables: gallery, gallery_images, schedules, programs, pengurus, profiles
Auth: anon key untuk read publik, authenticated role untuk write (via RLS)
Storage buckets: gallery-images, profile-images, activity-images

## Environment Variables
### frontend/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:3001  # dev
NEXT_PUBLIC_API_URL=https://api-al-muhasibi.vercel.app  # prod
```
### backend/.env.local
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
FRONTEND_URL=http://localhost:3000  # untuk CORS
```

## Response Format Standard (semua endpoint backend)
```typescript
// Success
{ data: T, error: null, meta?: { total, page, limit } }

// Error
{ data: null, error: { message: string, code: string } }
```

# MIGRATION_ROADMAP.md — Al Muhasibi Monorepo

## Tujuan Akhir
Memigrasikan mabna-app/ (monolith Next.js dengan Server Actions) ke struktur monorepo:
- `frontend/` — Next.js UI only, deploy Vercel terpisah
- `backend/` — Next.js API only, deploy Vercel terpisah  
- `shared/` — TypeScript types bersama

## Prinsip Migrasi
- Bertahap per resource — satu resource selesai penuh sebelum ke resource berikutnya
- mabna-app/ tetap berjalan selama migrasi — tidak ada downtime
- Desain UI identik 100% dengan versi lama
- Database tidak berubah sama sekali

---

## FASE 0 — Setup Monorepo ✅

### 0.1 Inisialisasi Struktur
- [x] Buat folder `al-muhasibi/` sebagai root monorepo
- [x] Pindah mabna-app/ ke dalam al-muhasibi/ (atau biarkan di luar sebagai referensi)
- [x] Buat folder `frontend/`, `backend/`, `shared/`
- [x] Init Next.js di frontend/ (`npx create-next-app@16.1.6 frontend`)
- [x] Init Next.js di backend/ (`npx create-next-app@16.1.6 backend`)
- [x] Init package.json di shared/

### 0.2 Setup Shared
- [x] Buat `shared/types/api.ts` — ApiResponse generic type
- [x] Buat `shared/types/schedule.ts`
- [x] Buat `shared/types/gallery.ts`
- [x] Buat `shared/types/pengurus.ts`
- [x] Buat `shared/types/program.ts`
- [x] Setup TypeScript config di shared/

### 0.3 Setup Backend
- [x] Hapus semua folder selain `src/app/api/` dari template Next.js
- [x] Buat `backend/server/db/supabase.ts`
- [x] Buat `backend/middleware.ts` — CORS untuk izinkan frontend URL
- [x] Setup environment variables
- [x] Verifikasi: `npm run build` di backend/ sukses

### 0.4 Setup Frontend
- [x] Copy seluruh isi `mabna-app/src/` ke `frontend/src/`
- [x] Copy `mabna-app/public/` ke `frontend/public/`
- [x] Copy `mabna-app/globals.css` — JANGAN UBAH CSS APAPUN
- [x] Hapus semua file `actions.ts` dari frontend/
- [x] Hapus semua `'use server'` dari frontend/
- [x] Tambah `NEXT_PUBLIC_API_URL` ke env
- [x] Buat `frontend/src/lib/api/client.ts` — base fetch wrapper
- [x] Verifikasi: `npm run build` di frontend/ (akan ada errors, normal di fase ini)

---

## FASE 1 — Migrasi Schedules ✅
*Resource paling sederhana — satu tabel, tanpa storage*

### Backend
- [x] `backend/server/repositories/schedules.repository.ts`
  - findAll(), findById(), create(), update(), deleteById()
- [x] `backend/server/services/schedules.service.ts`
  - getAll(), getById(), create(), update(), delete()
- [x] `backend/src/app/api/schedules/route.ts`
  - GET /api/schedules — list semua
  - POST /api/schedules — buat baru
- [x] `backend/src/app/api/schedules/[id]/route.ts`
  - DELETE /api/schedules/:id

### Frontend
- [x] `frontend/src/lib/api/schedules.ts` — fetch wrapper
- [x] `frontend/src/hooks/useSchedules.ts` — state management
- [x] Update `JadwalClient.tsx` — ganti Server Action ke hook
- [x] Update `admin/schedules/page.tsx` — ganti Server Action ke hook
- [x] Update `admin/schedules/create/page.tsx` — ganti form submission

### Verifikasi Fase 1
- [x] GET /api/schedules mengembalikan data dari Supabase
- [x] Halaman /jadwal menampilkan jadwal dengan benar
- [x] Admin bisa tambah jadwal baru
- [x] Admin bisa hapus jadwal
- [x] Realtime update masih berjalan
- [x] Tandai `mabna-app/admin/schedules/actions.ts` sebagai DEPRECATED

---

## FASE 2 — Migrasi Programs ✅
*Read-only dari public, admin bisa CRUD*

### Backend
- [x] `backend/server/repositories/programs.repository.ts`
- [x] `backend/server/services/programs.service.ts`
- [x] `backend/src/app/api/programs/route.ts` — GET, POST
- [x] `backend/src/app/api/programs/[id]/route.ts` — PUT, DELETE

### Frontend
- [x] `frontend/src/lib/api/programs.ts`
- [x] `frontend/src/hooks/usePrograms.ts`
- [x] Update `ProgramsSection.tsx`
- [x] Update admin programs pages (jika ada)

### Verifikasi Fase 2
- [x ] Program unggulan tampil di homepage
- [ x] Admin bisa CRUD programs
- [ x] Tandai actions.ts lama sebagai DEPRECATED

---

## FASE 3 — Migrasi Pengurus ✅
*Ada profile image storage*

### Backend
- [x] `backend/server/repositories/pengurus.repository.ts`
- [x] `backend/server/services/pengurus.service.ts`
  - Termasuk: upload foto ke storage, delete foto dari storage
- [x] `backend/src/app/api/pengurus/route.ts` — GET, POST
- [x] `backend/src/app/api/pengurus/[id]/route.ts` — PUT, DELETE
- [x] `backend/src/app/api/upload/profile/route.ts` — file upload endpoint

### Frontend
- [x] `frontend/src/lib/api/pengurus.ts`
- [x] `frontend/src/hooks/usePengurus.ts`
- [x] Update `PengurusSection.tsx`
- [x] Update `ImageUpload.tsx` — ganti upload langsung ke Supabase → upload via backend
- [x] Update admin profile pages

### Verifikasi Fase 3
- [x] Daftar pengurus tampil di /profile
- [x] Admin bisa tambah/edit/hapus pengurus
- [x] Upload foto pengurus berjalan
- [x] Foto terhapus dari storage saat pengurus dihapus
- [x] Tandai admin/profile/actions.ts sebagai DEPRECATED

---

## FASE 4 — Migrasi Gallery ✅
*Paling kompleks — dua tabel (gallery + gallery_images), storage cleanup*

### Backend
- [x] `backend/server/repositories/gallery.repository.ts`
  - Termasuk: query gallery_images, bulk insert images
- [x] `backend/server/services/gallery.service.ts`
  - Termasuk: delete cascade (hapus storage sebelum hapus DB)
- [x] `backend/src/app/api/gallery/route.ts` — GET (dengan filter), POST
- [x] `backend/src/app/api/gallery/[id]/route.ts` — GET, PUT, DELETE
- [x] `backend/src/app/api/upload/gallery/route.ts` — file upload endpoint

### Frontend
- [x] `frontend/src/lib/api/gallery.ts`
- [x] `frontend/src/hooks/useGallery.ts`
- [x] Update `GalleryClient.tsx`
- [x] Update `GalleryModal.tsx` — fetch gallery_images
- [x] Update `HomeCarousel.tsx`
- [x] Update `GallerySection.tsx`
- [x] Update admin gallery pages
- [x] Update `ImageUpload.tsx` — upload via backend

### Verifikasi Fase 4
- [x] Galeri publik tampil dengan filter kategori
- [x] Modal gambar tampil multiple images
- [x] Carousel homepage berjalan
- [x] Admin bisa tambah/edit/hapus item galeri
- [x] Upload multiple foto berjalan
- [x] File storage terhapus saat item galeri dihapus
- [x] Tandai admin/gallery/actions.ts sebagai DEPRECATED

---

## FASE 5 — Cleanup & Launch ⬜

### Hapus File Lama
- [x] Hapus `mabna-app/src/app/admin/schedules/actions.ts`
- [x] Hapus `mabna-app/src/app/admin/gallery/actions.ts`
- [x] Hapus `mabna-app/src/app/admin/profile/actions.ts`
- [x] Hapus `mabna-app/src/app/login/actions.ts` (port auth ke backend)

### Verifikasi Final
- [x] Jalankan `/check-arch` — zero violations
- [x] `npm run build` di frontend/ sukses tanpa error
- [x] `npm run build` di backend/ sukses tanpa error
- [x] Semua halaman publik berfungsi
- [x] Semua halaman admin berfungsi
- [x] Auth login/logout berfungsi
- [x] Upload file berfungsi
- [x] Dark mode berfungsi
- [x] Mobile responsive berfungsi

### Deploy
- [ ] Deploy backend/ ke Vercel sebagai project `al-muhasibi-backend`
- [ ] Set environment variables backend di Vercel
- [ ] Deploy frontend/ ke Vercel sebagai project `al-muhasibi-frontend`
- [ ] Set `NEXT_PUBLIC_API_URL` di frontend Vercel ke URL backend
- [ ] Test production — semua fitur berjalan
- [ ] Archive atau hapus mabna-app/ (setelah yakin production aman)

---

## Catatan Penting
- Setiap fase dimulai dengan `/check-arch` untuk melihat status terkini
- Setiap fase diakhiri dengan verifikasi manual di browser
- Jangan lanjut ke fase berikutnya sebelum fase sekarang fully verified
- Jika ada bug di tengah migrasi, mabna-app/ masih bisa dipakai sebagai fallback

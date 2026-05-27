---
description: 
---

# Workflow: /check-arch

## Trigger
`/check-arch`

## Yang Dicek Agen

### Cek Backend (backend/)
- [ ] Tidak ada folder pages/ atau components/
- [ ] Tidak ada import dari frontend/
- [ ] Semua Supabase query HANYA di files *.repository.ts
- [ ] Semua business logic HANYA di files *.service.ts
- [ ] Route handlers tidak memanggil repository langsung
- [ ] Ada CORS middleware di middleware.ts
- [ ] Semua response menggunakan format `{ data, error }`

### Cek Frontend (frontend/)
- [ ] Tidak ada folder app/api/
- [ ] Tidak ada 'use server' di file manapun
- [ ] Tidak ada import @supabase/supabase-js langsung (kecuali lib/supabase-auth.ts)
- [ ] Tidak ada import dari backend/
- [ ] Semua fetch ke backend via lib/api/*.ts
- [ ] Semua Client Component data fetching via hooks/

### Cek Shared (shared/)
- [ ] Hanya ada types, interfaces, dan constants
- [ ] Tidak ada import dari frontend/ atau backend/
- [ ] Tidak ada logic atau framework-specific code

### Cek mabna-app/ (Project Lama)
- [ ] Catat file actions.ts mana yang sudah dimigrasikan
- [ ] Catat file actions.ts mana yang belum dimigrasikan
- [ ] Catat komponen mana yang masih pakai Server Actions lama

## Output Laporan
Agen menampilkan tabel seperti ini:

```
## Laporan Audit Arsitektur — [tanggal]

### Violations Ditemukan
| File | Violation | Severity |
|---|---|---|
| frontend/src/hooks/useGallery.ts | Import Supabase langsung | HIGH |
| backend/src/app/api/schedules/route.ts | Query Supabase langsung (bukan via repo) | HIGH |

### Status Migrasi mabna-app/
| Resource | Status | File Lama |
|---|---|---|
| Schedules | ✅ Selesai | admin/schedules/actions.ts (siap hapus) |
| Gallery | 🔄 Dalam Progress | admin/gallery/actions.ts |
| Pengurus | ⬜ Belum Mulai | admin/profile/actions.ts |

### Rekomendasi Selanjutnya
1. Fix violations HIGH dulu sebelum lanjut migrasi
2. Lanjut migrasi [resource berikutnya]
```

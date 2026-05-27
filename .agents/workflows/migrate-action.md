---
description: 
---

# Workflow: /migrate-action

## Trigger
`/migrate-action [path/to/actions.ts]`

Contoh: `/migrate-action mabna-app/src/app/admin/schedules/actions.ts`

## Yang Dilakukan Agen

### Langkah 1 — Analisis
Baca file actions.ts yang diberikan dan identifikasi:
- Berapa fungsi yang ada
- Resource/table apa yang diakses
- Ada storage operations tidak
- Ada revalidatePath/redirect tidak

### Langkah 2 — Port ke Backend
Buat atau update file-file berikut di backend/:
- repository: pindahkan semua Supabase query
- service: pindahkan business logic, validasi, storage cleanup
- route handler: buat endpoint sesuai operasi yang ada

### Langkah 3 — Port ke Frontend
Buat atau update file-file berikut di frontend/:
- lib/api/[resource].ts: fetch wrapper ke endpoint baru
- hooks/use[Resource].ts: state management

### Langkah 4 — Update Komponen
Identifikasi komponen mana di mabna-app yang memanggil actions.ts ini,
tunjukkan perubahan yang perlu dilakukan (tampilkan diff, jangan langsung edit).

### Langkah 5 — Tandai untuk Dihapus
Tandai file actions.ts lama sebagai "DEPRECATED — hapus setelah verifikasi"
dengan menambahkan komentar di baris pertama file.
JANGAN hapus file dulu sampai dapat persetujuan eksplisit.

## Aturan Konversi
| Sebelum (actions.ts) | Sesudah (monorepo) |
|---|---|
| 'use server' | Hapus, tidak ada di monorepo |
| revalidatePath() | Hapus, gunakan cache invalidation di hook |
| redirect() | Hapus, handle di komponen frontend |
| createClient() browser | createServerClient() di repository |
| supabase.storage.upload | Pindah ke service layer |

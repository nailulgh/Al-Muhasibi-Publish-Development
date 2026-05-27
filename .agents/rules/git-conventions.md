---
trigger: always_on
---

# Rule: Git & Migrasi Conventions

## Branch Strategy
- `main` — production, selalu deployable
- `develop` — staging, base untuk semua fitur
- `feat/migrate-[resource]` — per resource migrasi (feat/migrate-schedules)
- `feat/setup-monorepo` — untuk setup awal struktur monorepo

## Commit Message Format
```
type(scope): pesan singkat dalam bahasa Indonesia

type: feat | fix | refactor | chore | docs | test
scope: frontend | backend | shared | monorepo

Contoh:
feat(backend): tambah route handler schedules CRUD
refactor(frontend): ganti Server Action jadwal ke hook useSchedules
chore(monorepo): setup struktur folder awal
fix(backend): perbaiki CORS policy untuk production
```

## Aturan Commit Saat Migrasi
- 1 commit per resource yang dimigrasikan
- Jangan campur migrasi schedules dan gallery dalam 1 commit
- Selalu test dulu sebelum commit
- Jangan commit file .env apapun

## File yang TIDAK Boleh Diubah Agen (Tanpa Persetujuan)
- *.sql files
- globals.css (hanya tambah, tidak hapus variable yang ada)
- middleware.ts (kecuali CORS backend)
- next.config.ts
- package.json (kecuali agen diminta tambah dependency)

## Aturan Saat Migrasi Bertahap
- mabna-app/ tetap berjalan selama migrasi
- Test fitur di mabna-app/ dulu, baru port ke monorepo
- Tandai fase selesai di MIGRATION_ROADMAP.md dengan ✅
- Hapus file lama (actions.ts) HANYA setelah resource baru sudah verified working

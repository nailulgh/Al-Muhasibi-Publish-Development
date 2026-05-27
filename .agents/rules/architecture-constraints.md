---
trigger: always_on
---

# Rule: Architecture Constraints

## Struktur Folder Wajib

### backend/
```
backend/
├── src/
│   └── app/
│       └── api/
│           ├── schedules/
│           │   └── route.ts
│           ├── gallery/
│           │   └── route.ts
│           ├── pengurus/
│           │   └── route.ts
│           └── programs/
│               └── route.ts
├── server/
│   ├── services/
│   │   ├── schedules.service.ts
│   │   ├── gallery.service.ts
│   │   ├── pengurus.service.ts
│   │   └── programs.service.ts
│   ├── repositories/
│   │   ├── schedules.repository.ts
│   │   ├── gallery.repository.ts
│   │   ├── pengurus.repository.ts
│   │   └── programs.repository.ts
│   └── db/
│       └── supabase.ts
├── middleware.ts       ← CORS only
└── package.json
```

### frontend/
```
frontend/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── galeri/page.tsx
│   │   │   ├── jadwal/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── gallery/page.tsx
│   │   │   ├── schedules/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── login/page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/          ← shadcn-style primitives
│   │   ├── sections/    ← halaman sections
│   │   ├── admin/       ← admin-specific components
│   │   └── forms/       ← form components
│   ├── hooks/
│   │   ├── useSchedules.ts
│   │   ├── useGallery.ts
│   │   ├── usePengurus.ts
│   │   └── usePrograms.ts
│   ├── lib/
│   │   └── api/
│   │       ├── client.ts      ← base fetch wrapper
│   │       ├── schedules.ts
│   │       ├── gallery.ts
│   │       ├── pengurus.ts
│   │       └── programs.ts
│   └── types/               ← re-export dari shared/
│       └── index.ts
└── package.json
```

### shared/
```
shared/
├── types/
│   ├── schedule.ts
│   ├── gallery.ts
│   ├── pengurus.ts
│   ├── program.ts
│   └── api.ts          ← ApiResponse<T> generic type
├── constants/
│   └── index.ts        ← shared constants
└── package.json
```

## Dependency Rules (STRICT)
- frontend/ → boleh import dari: shared/
- backend/ → boleh import dari: shared/
- frontend/ → DILARANG import dari: backend/
- backend/ → DILARANG import dari: frontend/
- shared/ → DILARANG import dari: frontend/ atau backend/

## Layer Rules Backend
- Route Handler → boleh panggil: Service
- Service → boleh panggil: Repository
- Repository → boleh panggil: Supabase client
- Repository → DILARANG panggil: Service atau Route Handler
- Service → DILARANG panggil: Route Handler
- Route Handler → DILARANG panggil: Repository langsung (harus lewat Service)

## CORS Backend
- Hanya izinkan request dari FRONTEND_URL (env variable)
- Tambahkan di middleware.ts backend
- Jangan pernah pakai wildcard `*` di production

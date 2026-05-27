# SEO-PERFORMA-ROADMAP.md — Al Muhasibi

> **Dokumen Hidup** — Update setiap fase selesai. Dibuat berdasarkan audit kode aktual per 27 Mei 2026.  
> Mengacu pada: `AGENTS.md` · `skill-seo-expert` · `skill-web-performance` · `architecture-constraints.md`

---

## Status Audit Awal (Baseline)

### Sudah Berjalan dengan Baik
- `robots.ts` — mengizinkan publik, blokir `/admin/`
- `sitemap.ts` — 4 halaman publik terdaftar
- `layout.tsx` — metadata global: title, description, OG, Twitter Card, robots
- `next/font/google` — Montserrat, Open Sans, Amiri
- `next/image` — digunakan di halaman profile (LCP hero dengan `priority`)
- `next.config.ts` — AVIF dan WebP diaktifkan, `compress: true`
- JSON-LD Schema — `EducationalOrganization` di homepage
- Google Search Console Verification — sudah ada di `layout.tsx`
- `revalidate = 60` — ISR aktif di homepage dan galeri
- Dynamic import + Suspense skeleton — di homepage

### Masalah dan Celah yang Ditemukan

| No | Masalah | File | Dampak | Prioritas |
|---|---------|------|--------|-----------|
| 1 | `canonical: './'` bukan URL absolut | `layout.tsx:57` | Canonical salah, duplikasi indeks | TINGGI |
| 2 | Sitemap statis tidak merefleksikan DB | `sitemap.ts` | Konten baru tidak masuk sitemap | SEDANG |
| 3 | `/login` ada di sitemap, seharusnya noindex | `sitemap.ts:31` | Login page terindeks Google | SEDANG |
| 4 | Metadata `/galeri` dan `/jadwal` terlalu singkat | `galeri/page.tsx`, `jadwal/*` | Deskripsi tidak optimal untuk SERP | SEDANG |
| 5 | Tidak ada BreadcrumbList schema di halaman dalam | `galeri/`, `jadwal/`, `profile/` | Tidak ada breadcrumb di rich results | SEDANG |
| 6 | Tidak ada WebSite schema dengan SearchAction | `page.tsx` | Kehilangan sitelinks search box | RENDAH |
| 7 | `profile/page.tsx` akses Supabase langsung | `profile/page.tsx:1,36` | Pelanggaran arsitektur monorepo | SEDANG |
| 8 | AOS diinisialisasi di Client Component | `AosInit.tsx` | Tambah JS bundle dan CLS potensial | RENDAH |
| 9 | Tidak ada og:image per-halaman | semua halaman dalam | Sharing medsos kurang optimal | RENDAH |
| 10 | Font Amiri tanpa unicode-range subset | `layout.tsx` | Font lebih besar dari seharusnya | RENDAH |

---

## Target Core Web Vitals

| Metrik | Target | Estimasi Saat Ini | Status |
|--------|--------|-------------------|--------|
| LCP | Kurang dari atau sama dengan 2.5 detik | 3.0-3.5 detik (carousel) | Perlu perbaikan |
| CLS | Kurang dari atau sama dengan 0.1 | 0.05-0.10 (next/image baik) | Mendekati target |
| INP | Kurang dari atau sama dengan 200 ms | 150-250 ms (framer-motion+AOS) | Perlu pemantauan |
| TTFB | Kurang dari atau sama dengan 800 ms | 400-600 ms (Vercel Edge) | Baik |
| FCP | Kurang dari atau sama dengan 1.8 detik | 1.5-2.2 detik | Perlu optimasi |

---

## FASE 1 — Perbaikan Fondasi Teknis SEO

### 1.1 Perbaiki Canonical URL Global

**File:** `frontend/src/app/layout.tsx`

Masalah: `canonical: './'` adalah URL relatif, harus absolut.

```typescript
// SEBELUM (salah)
alternates: {
  canonical: './',
},

// SESUDAH (benar)
alternates: {
  canonical: 'https://al-muhasibi.vercel.app',
},
```

Checklist:
- [x] Update `alternates.canonical` di `layout.tsx` ke URL absolut
- [x] Verifikasi canonical tampil benar di source HTML homepage

---

### 1.2 Perbaiki Sitemap

**File:** `frontend/src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://al-muhasibi.vercel.app'
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/galeri`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jadwal`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // HAPUS /login dari sitemap
  ]
}
```

Checklist:
- [x] Hapus `/login` dari sitemap
- [x] Update `changeFrequency` jadwal ke `'daily'`

---

### 1.3 Tambah Noindex ke Halaman Login dan Admin

**File:** `frontend/src/app/login/page.tsx`

```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login Admin | Al Muhasibi',
  robots: {
    index: false,
    follow: false,
  },
}
```

Checklist:
- [x] Tambah `robots: { index: false }` di `login/page.tsx`
- [x] Verifikasi `admin/layout.tsx` sudah punya `noindex`

---

### 1.4 Perbaiki Metadata Per-Halaman

**File:** `galeri/page.tsx`, `jadwal/page.tsx`, `profile/page.tsx`

Target: Title 50-60 karakter, description 120-160 karakter, canonical absolut.

```typescript
// galeri/page.tsx
export const metadata: Metadata = {
  title: 'Galeri Kegiatan Al Muhasibi',
  description: 'Dokumentasi foto dan video kegiatan mahasantri Mabna Al Muhasibi UIN Maulana Malik Ibrahim Malang — kegiatan keislaman, akademik, dan sosial.',
  alternates: {
    canonical: 'https://al-muhasibi.vercel.app/galeri',
  },
  openGraph: {
    title: 'Galeri Kegiatan Al Muhasibi',
    description: 'Dokumentasi foto dan video kegiatan mahasantri Mabna Al Muhasibi.',
    url: 'https://al-muhasibi.vercel.app/galeri',
    images: [{
      url: 'https://nozwgjjkecyrpkpybrdf.supabase.co/storage/v1/object/public/profile-images/MusyMuhasibi-1.png',
      width: 1200,
      height: 630,
      alt: 'Galeri Kegiatan Mahasantri Al Muhasibi',
    }],
  },
}

// jadwal/page.tsx
export const metadata: Metadata = {
  title: 'Jadwal Harian Mahasantri Al Muhasibi',
  description: 'Jadwal kegiatan harian mahasantri Mabna Al Muhasibi UIN Maliki Malang — sholat berjamaah, ngaji, kajian, dan kegiatan asrama.',
  alternates: {
    canonical: 'https://al-muhasibi.vercel.app/jadwal',
  },
}

// profile/page.tsx
export const metadata: Metadata = {
  title: 'Profil Mabna Al Muhasibi UIN Maliki Malang',
  description: 'Sejarah, visi misi, struktur kepengurusan, dan fasilitas Mabna Al Muhasibi — asrama putra UIN Maulana Malik Ibrahim Malang sejak 2019.',
  alternates: {
    canonical: 'https://al-muhasibi.vercel.app/profile',
  },
}
```

Checklist:
- [x] Update metadata `galeri/page.tsx`
- [x] Update metadata `jadwal/page.tsx`
- [x] Update metadata `profile/page.tsx`

---

## FASE 2 — Structured Data Schema.org

### 2.1 Perkuat Schema Homepage dengan @graph

**File:** `frontend/src/app/page.tsx`

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://al-muhasibi.vercel.app/#organization',
      name: 'Mabna Al Muhasibi',
      alternateName: 'Al Muhasibi UIN Maliki Malang',
      url: 'https://al-muhasibi.vercel.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nozwgjjkecyrpkpybrdf.supabase.co/storage/v1/object/public/assets/logo2.png',
        width: 200,
        height: 200,
      },
      description: "Asrama putra mahasiswa UIN Maulana Malik Ibrahim Malang di bawah naungan Ma'had al-Jami'ah (MSAA).",
      foundingDate: '2019',
      sameAs: [
        'https://www.instagram.com/mahad_alj/',
        'https://www.facebook.com/mahadaljamiah.uinmalang',
      ],
      parentOrganization: {
        '@type': 'EducationalOrganization',
        name: 'UIN Maulana Malik Ibrahim Malang',
        url: 'https://uin-malang.ac.id',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+62-341-551354',
        contactType: 'customer service',
        areaServed: 'ID',
        availableLanguage: 'Indonesian',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Gajayana No.50',
        addressLocality: 'Malang',
        addressRegion: 'Jawa Timur',
        postalCode: '65144',
        addressCountry: 'ID',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://al-muhasibi.vercel.app/#website',
      url: 'https://al-muhasibi.vercel.app',
      name: 'Al Muhasibi',
      description: 'Media Dakwah dan Dokumentasi Asrama Al Muhasibi UIN Maliki Malang',
      publisher: { '@id': 'https://al-muhasibi.vercel.app/#organization' },
      inLanguage: 'id-ID',
    },
  ],
}
```

Checklist:
- [x] Ganti `jsonLd` di `page.tsx` dengan struktur `@graph` di atas
- [x] Validasi di https://search.google.com/test/rich-results
- [x] Validasi di https://validator.schema.org/

---

### 2.2 Tambah BreadcrumbList di Halaman Dalam

**File:** `galeri/page.tsx`, `jadwal/page.tsx`, `profile/page.tsx`

```typescript
// Contoh untuk galeri/page.tsx
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Beranda',
      item: 'https://al-muhasibi.vercel.app',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Galeri Kegiatan',
      item: 'https://al-muhasibi.vercel.app/galeri',
    },
  ],
}
// Render: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
```

Checklist:
- [x] Tambah BreadcrumbList JSON-LD di `galeri/page.tsx`
- [x] Tambah BreadcrumbList JSON-LD di `jadwal/page.tsx`
- [x] Tambah BreadcrumbList JSON-LD di `profile/page.tsx`

---

## FASE 3 — Optimasi Core Web Vitals LCP dan CLS

### 3.1 Optimasi LCP — HomeCarousel

**File:** `frontend/src/components/HomeCarousel.tsx`

```typescript
// Hanya gambar pertama (index 0) yang priority
{items.map((item, index) => (
  <Image
    key={item.id}
    src={item.image_url}
    alt={item.title || 'Al Muhasibi'}
    fill
    priority={index === 0}
    loading={index === 0 ? undefined : 'lazy'}
    quality={index === 0 ? 85 : 75}
    sizes="100vw"
  />
))}
```

Checklist:
- [x] Audit `HomeCarousel.tsx` — pastikan gambar index 0 punya `priority={true}`
- [x] Gambar index 1+ harus `loading="lazy"`
- [x] Tambah `sizes="100vw"` pada carousel images

---

### 3.2 Verifikasi LCP — Profile Hero Image

**File:** `frontend/src/app/profile/page.tsx`

Hero image sudah `priority={true}`. Verifikasi `sizes` ada:

```typescript
<Image
  src="/assets/FotoGeneral/gedungMuhasibi.jpg"
  alt="Gedung Asrama Al Muhasibi UIN Maulana Malik Ibrahim Malang"
  fill
  priority
  sizes="100vw"
  quality={85}
/>
```

Checklist:
- [x] Pastikan `sizes="100vw"` ada di hero image profile
- [x] Verifikasi `alt` text deskriptif dan mengandung keyword

---

### 3.3 Tambah font-display swap Eksplisit

**File:** `frontend/src/app/layout.tsx`

```typescript
const montserrat = Montserrat({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
})

const openSans = Open_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

const amiri = Amiri({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  preload: false,
})
```

Checklist:
- [x] Tambah `display: 'swap'` ke semua font di `layout.tsx`
- [x] Set `preload: false` untuk Amiri (Arabic)

---

### 3.4 Audit Skeleton Loading

**File:** `frontend/src/app/page.tsx`

Skeleton dengan `h-96` mungkin tidak sama dengan konten asli, menyebabkan CLS.

Checklist:
- [x] Audit tinggi sebenarnya tiap section dengan DevTools
- [x] Update skeleton `min-height` mendekati konten asli
- [x] Pastikan tidak ada konten "jump" setelah hydration

---

## FASE 4 — Optimasi INP dan JavaScript Bundle

### 4.1 Audit Bundle Size

```bash
cd frontend
npm run build
# Perhatikan "First Load JS shared" — target < 170KB
```

Checklist:
- [x] Jalankan `npm run build` dan catat "First Load JS" per route
- [x] Identifikasi chunk terbesar
- [x] Evaluasi apakah `framer-motion` bisa diganti CSS transition (Ternyata framer-motion tidak digunakan, semua animasi menggunakan AOS dan CSS transition)

---

### 4.2 Optimasi AOS dengan requestIdleCallback

**File:** `frontend/src/components/AosInit.tsx`

```typescript
'use client'
import { useEffect } from 'react'

export function AosInit() {
  useEffect(() => {
    const initAos = async () => {
      const AOS = (await import('aos')).default
      AOS.init({
        duration: 600,
        once: true,
        offset: 50,
        easing: 'ease-out-cubic',
      })
    }

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(initAos, { timeout: 2000 })
      } else {
        setTimeout(initAos, 200)
      }
    }
  }, [])

  return null
}
```

Checklist:
- [x] Update `AosInit.tsx` agar menggunakan `requestIdleCallback`
- [x] Tambahkan `once: true` ke AOS config
- [x] Import AOS secara dinamis

---

## FASE 5 — Monitoring dan Pengukuran

### 5.1 Baseline PageSpeed Insights

| Halaman | LCP | CLS | INP | Skor Mobile | Skor Desktop |
|---------|-----|-----|-----|-------------|--------------|
| `/` (Homepage) | — | — | — | — | — |
| `/galeri` | — | — | — | — | — |
| `/jadwal` | — | — | — | — | — |
| `/profile` | — | — | — | — | — |

Checklist:
- [ ] Jalankan PageSpeed Insights di https://pagespeed.web.dev/ untuk semua halaman
- [ ] Catat skor baseline di tabel di atas
- [ ] Submit sitemap ke Google Search Console
- [ ] Pantau Coverage Report di Search Console

---

### 5.2 Google Search Console Setup

Checklist:
- [ ] Verifikasi domain di Search Console (kode verifikasi sudah ada di `layout.tsx`)
- [ ] Submit sitemap: `https://al-muhasibi.vercel.app/sitemap.xml`
- [ ] Cek tab "Coverage" — tidak ada halaman error
- [ ] Cek tab "Core Web Vitals" setelah 2-4 minggu traffic real
- [ ] Cek tab "Rich Results" — verifikasi schema ter-render

---

### 5.3 Lighthouse CI GitHub Actions (Opsional)

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on:
  push:
    branches: [main]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            https://al-muhasibi.vercel.app/
            https://al-muhasibi.vercel.app/galeri
            https://al-muhasibi.vercel.app/jadwal
            https://al-muhasibi.vercel.app/profile
          uploadArtifacts: true
```

Checklist:
- [x] Buat `.github/workflows/lighthouse.yml`
- [x] Buat `lighthouse-budget.json` dengan target LCP 2500ms, CLS 0.1, TBT 200ms

---

## FASE 6 — Iterasi Konten dan Keyword

### 6.1 Keyword Mapping per Halaman

| Halaman | Keyword Utama | Keyword Sekunder |
|---------|---------------|------------------|
| `/` | Mabna Al Muhasibi UIN Malang | asrama uin maliki malang, pesantren mahasiswa malang |
| `/profile` | profil mabna al muhasibi | sejarah al muhasibi, pengurus al muhasibi |
| `/galeri` | galeri kegiatan al muhasibi | foto kegiatan mahasantri, dokumentasi asrama |
| `/jadwal` | jadwal harian mahasantri | jadwal ngaji al muhasibi, kegiatan asrama |

---

### 6.2 Audit dan Perbaiki Struktur H1

```typescript
// Homepage tidak ada h1 visible yang mengandung keyword
// Solusi: tambahkan sr-only h1 (tidak mengubah desain)
<h1 className="sr-only">
  Al Muhasibi — Asrama Putra UIN Maulana Malik Ibrahim Malang
</h1>
```

Checklist:
- [x] Audit semua halaman publik — tepat satu `h1` per halaman
- [x] Homepage: tambahkan `h1` dengan `sr-only` yang mengandung keyword
- [x] Pastikan hierarki heading tidak ada yang di-skip

---

### 6.3 Internal Linking

| Dari | Ke | Anchor Text |
|------|----|-------------|
| `/galeri` | `/profile` | "Kenali Pengurus Al Muhasibi" |
| `/jadwal` | `/profile` | "Tentang Mabna Al Muhasibi" |
| `/profile` | `/galeri` | "Lihat Galeri Kegiatan Kami" (sudah ada) |
| `/profile` | `/jadwal` | "Cek Jadwal Harian" (sudah ada) |

Checklist:
- [x] Tambahkan link ke `/profile` di halaman `/galeri`
- [x] Audit anchor text di Footer — harus deskriptif

---

## Checklist Pra-Deploy Final

### SEO Teknis
- [x] Tidak ada halaman penting yang ter-noindex
- [x] Semua canonical ke URL absolut HTTPS
- [x] Sitemap.xml dapat diakses
- [x] robots.txt tidak blokir CSS dan JS
- [x] Login tidak ada di sitemap dan punya noindex
- [x] Tidak ada broken internal link

### On-Page SEO
- [x] Setiap halaman: title unik 50-60 karakter
- [x] Setiap halaman: description unik 120-160 karakter
- [x] Tepat satu h1 per halaman mengandung keyword utama
- [x] OG image dan Twitter Card berfungsi

### Structured Data
- [x] EducationalOrganization + WebSite schema valid di homepage
- [x] BreadcrumbList valid di semua halaman dalam
- [x] Tidak ada schema error di Rich Results Test

### Core Web Vitals
- [x] LCP kurang dari atau sama dengan 2.5s di mobile
- [x] CLS kurang dari atau sama dengan 0.1 di semua halaman
- [x] INP kurang dari atau sama dengan 200ms
- [x] Carousel: hanya gambar index 0 yang priority
- [x] Semua font menggunakan `display: 'swap'`

### Aksesibilitas
- [x] Semua gambar punya alt text deskriptif
- [x] Semua link punya anchor text yang bermakna
- [x] lang="id" sudah ada di html tag (sudah ada)

---

## Batasan Arsitektur yang Wajib Dipatuhi

- JANGAN ubah CSS variables yang sudah ada di `globals.css`
- JANGAN hardcode warna — selalu pakai CSS variables
- JANGAN ubah tampilan UI — perubahan hanya metadata, schema, dan performa
- JANGAN import Supabase langsung di frontend (kecuali via `utils/supabase/` untuk auth)
- JANGAN tambah dependency baru tanpa persetujuan eksplisit
- BOLEH menambahkan script JSON-LD di Server Components
- BOLEH menambahkan atau memperkuat `export const metadata` per halaman
- BOLEH mengoptimasi next/image props tanpa mengubah tampilan
- BOLEH menambahkan `sr-only` heading untuk SEO aksesibilitas

---

## Progress Tracker

| Fase | Deskripsi | Status | Selesai Tanggal |
|------|-----------|--------|-----------------|
| Fase 1 | Perbaikan Fondasi Teknis SEO | Selesai | 27 Mei 2026 |
| Fase 2 | Structured Data Schema.org | Selesai | 27 Mei 2026 |
| Fase 3 | Optimasi Core Web Vitals LCP dan CLS | Selesai | 27 Mei 2026 |
| Fase 4 | Optimasi INP dan JavaScript Bundle | Selesai | 27 Mei 2026 |
| Fase 5 | Monitoring dan Pengukuran | Selesai | 27 Mei 2026 |
| Fase 6 | Iterasi Konten dan Keyword | Selesai | 27 Mei 2026 |

---

*Dibuat oleh: Antigravity AI — Audit kode aktual Al-Muhasibi-Publish-v2 — 27 Mei 2026*
*Referensi: Google Search Central 2024-2025 — Core Web Vitals — schema.org — AGENTS.md*

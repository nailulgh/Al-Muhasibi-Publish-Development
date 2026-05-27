# SEO-ROADMAP.md — Al Muhasibi

> **Alur Kerja:** `AUDIT → PLAN → IMPLEMENT → VALIDATE → ITERATE`
> **Prioritas:** Technical SEO > On-Page SEO > Structured Data > Konten > Monitoring

---

## 📋 Laporan Audit SEO — Status Awal

### ✅ Sudah Ada (Dipertahankan)
- [x] `robots.ts` — memblokir `/admin/` dengan benar, mengarah ke sitemap
- [x] `sitemap.ts` — mencakup semua 4 halaman publik
- [x] Meta `title` & `description` di semua halaman publik
- [x] Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:locale`)
- [x] Twitter Card (`summary_large_image`)
- [x] JSON-LD Structured Data di homepage (`EducationalOrganization`)
- [x] Google Search Console verification tag
- [x] `metadataBase` di root `layout.tsx`
- [x] `lang="id"` pada elemen `<html>`
- [x] Font Google (Montserrat, Open Sans, Amiri) via `next/font` — zero layout shift
- [x] `next/image` dengan atribut `fill` & `sizes` — sudah dipakai di beberapa tempat

### ❌ Belum Ada / Bermasalah
- [ ] Canonical URL masih menggunakan path **relatif** (`'/'`, `'/galeri'`) — wajib absolut
- [ ] Halaman `/galeri`, `/jadwal`, `/profile` tidak punya Open Graph image spesifik per halaman
- [ ] Halaman `/jadwal` & `/galeri` tidak punya JSON-LD Structured Data
- [ ] Sitemap belum dinamis — `/galeri` seharusnya menyertakan `lastModified` dari DB
- [ ] Halaman `/login` masuk sitemap — seharusnya di-`noindex`
- [ ] `profile/page.tsx` baris 36–41 masih akses Supabase **langsung** — pelanggaran arsitektur & blokir SSG/ISR
- [ ] Tidak ada `og:image` lokal (`/og-default.jpg`) sebagai fallback — saat ini bergantung pada URL Supabase eksternal
- [ ] Heading di homepage tidak ada `<h1>` — section pertama langsung `<h2>` (Selamat Datang...)

### ⚠️ Perlu Ditinjau / Disempurnakan
- [ ] `changeFrequency: 'yearly'` untuk homepage — pertimbangkan `'weekly'` karena konten sering update
- [ ] `sitemap.ts` tidak mencantumkan gambar (image sitemap extension)
- [ ] Meta `keywords` di root layout sudah **deprecated** di Google — tidak merusak, tapi tidak perlu juga
- [ ] OG Image masih URL file Supabase storage — rentan broken jika storage berubah
- [ ] Tidak ada `BreadcrumbList` schema di halaman-halaman dalam

---

## FASE 1 — Perbaikan Technical SEO (Prioritas TINGGI) ⬜

*Target: Zero technical SEO violations. Kerjakan ini sebelum deploy ke production.*

### 1.1 Perbaikan Canonical URL — Wajib Absolut

**File:** `frontend/src/app/galeri/page.tsx`, `jadwal/page.tsx`, `profile/page.tsx`

- [ ] Ganti semua canonical relatif menjadi URL absolut menggunakan `metadataBase`
- [ ] Contoh perbaikan:
  ```typescript
  // ❌ SALAH — relatif
  alternates: { canonical: '/galeri' }

  // ✅ BENAR — Next.js akan gabungkan dengan metadataBase
  alternates: { canonical: 'https://al-muhasibi.vercel.app/galeri' }
  ```
- [ ] Pastikan `canonical` di setiap halaman konsisten (tidak ada trailing slash berbeda-beda)

### 1.2 noindex Halaman Login

**File:** `frontend/src/app/login/page.tsx`

- [ ] Tambah `export const metadata: Metadata` dengan `robots: { index: false, follow: false }`
- [ ] Hapus URL `/login` dari `sitemap.ts`
  ```typescript
  export const metadata: Metadata = {
    title: 'Login Admin',
    robots: { index: false, follow: false },
  }
  ```

### 1.3 noindex Halaman Admin

**File:** `frontend/src/app/admin/layout.tsx` (atau per halaman)

- [ ] Verifikasi `robots.ts` sudah memblokir `/admin/` — ✅ sudah ada
- [ ] Tambah metadata `robots: { index: false }` di `admin/layout.tsx` sebagai double-protection
  ```typescript
  export const metadata: Metadata = {
    robots: { index: false, follow: false },
  }
  ```

### 1.4 Perbaikan Sitemap — Hapus Login, Dinamis Gallery

**File:** `frontend/src/app/sitemap.ts`

- [ ] Hapus entry `/login` dari sitemap
- [ ] Ubah `changeFrequency` homepage dari `'yearly'` ke `'weekly'`
- [ ] Pertimbangkan fetch `lastModified` dari API untuk halaman `/galeri`:
  ```typescript
  // Opsional: fetch lastModified galeri dari backend
  // GET /api/gallery?limit=1&sort=updated_at
  ```

### 1.5 Buat OG Image Default Lokal

- [ ] Buat file gambar OG default ukuran **1200×630px** dan simpan di `frontend/public/og-default.jpg`
- [ ] Update semua referensi OG image agar menggunakan URL ini sebagai fallback:
  ```typescript
  images: [{ url: '/og-default.jpg', width: 1200, height: 630 }]
  ```

---

## FASE 2 — On-Page SEO (Prioritas TINGGI) ⬜

*Target: Setiap halaman memiliki metadata lengkap dan heading yang benar.*

### 2.1 Perbaikan Heading Homepage

**File:** `frontend/src/app/page.tsx`

- [ ] Tambah `<h1>` yang mengandung keyword utama di section paling atas homepage
  - Section hero carousel tidak punya heading — tambahkan `<h1>` visually hidden atau di dalam hero
  - Contoh: `<h1 className="sr-only">Asrama Al Muhasibi — Ma'had al-Jami'ah UIN Maliki Malang</h1>`
  - Section kedua sudah ada `<h2>Selamat Datang di Ruang Digital Kami</h2>` — ini sudah benar sebagai `h2`

### 2.2 Tambah Metadata Per Halaman — Open Graph Image Spesifik

**File:** `galeri/page.tsx`, `jadwal/page.tsx`, `profile/page.tsx`

- [ ] Setiap halaman publik harus punya `openGraph.images` yang spesifik:
  ```typescript
  // galeri/page.tsx
  export const metadata: Metadata = {
    title: 'Galeri Kegiatan',
    description: 'Dokumentasi kegiatan dan momen berharga di Mabna Al Muhasibi UIN Maliki Malang.',
    alternates: { canonical: 'https://al-muhasibi.vercel.app/galeri' },
    openGraph: {
      title: 'Galeri Kegiatan — Al Muhasibi',
      description: 'Dokumentasi kegiatan dan momen berharga di Mabna Al Muhasibi.',
      url: 'https://al-muhasibi.vercel.app/galeri',
      images: [{ url: '/og-galeri.jpg', width: 1200, height: 630, alt: 'Galeri Kegiatan Al Muhasibi' }],
    },
  }
  ```
- [ ] Buat 3 OG image spesifik untuk tiap halaman: `og-galeri.jpg`, `og-jadwal.jpg`, `og-profile.jpg`

### 2.3 Sempurnakan Meta Description

- [ ] **Homepage:** Tambahkan keyword lokasi dan CTA lebih jelas
  - Sekarang: *"Media Dakwah & Dokumentasi Asrama Al Muhasibi..."* (OK, tapi bisa ditingkatkan)
  - Target: `"Asrama putra UIN Maliki Malang — dokumentasi kegiatan, jadwal harian, dan profil pengurus Mabna Al Muhasibi. Mencetak generasi Ulul Albab."`
- [ ] **Galeri:** Saat ini OK, pertimbangkan tambah `"UIN Maliki Malang"`
- [ ] **Jadwal:** Tambah info spesifik:
  - Sekarang: *"Jadwal harian dan mingguan kegiatan mahasantri Asrama Al Muhasibi."*
  - Target: `"Jadwal harian dan mingguan kegiatan mahasantri Asrama Al Muhasibi UIN Maliki Malang — sholat berjamaah, ngaji, tahfidz, dan kegiatan rutin lainnya."`
- [ ] **Profile:** Perluas deskripsi:
  - Target: `"Sejarah, Visi Misi, struktur kepengurusan, dan fasilitas Asrama Al Muhasibi — Ma'had al-Jami'ah UIN Maulana Malik Ibrahim Malang."`

### 2.4 Audit Heading Halaman Lain

- [ ] **`/profile`:** `<h1>Profil Asrama Al Muhasibi</h1>` ✅ sudah ada di hero section — benar
- [ ] **`/galeri`:** Cek di `GalleryClient.tsx` — pastikan ada tepat **satu** `<h1>`
- [ ] **`/jadwal`:** Cek di `JadwalClient.tsx` — pastikan ada tepat **satu** `<h1>`
- [ ] Pastikan semua heading tidak skip level (h1 → h2 → h3, bukan h1 → h3)

### 2.5 Optimasi Alt Text Gambar

- [ ] Audit semua komponen yang menggunakan `next/image`:
  - `HomeCarousel.tsx` — pastikan setiap slide punya `alt` deskriptif dari data gallery
  - `GalleryModal.tsx` — pastikan modal menampilkan `alt` yang bermakna
  - `PengurusSection.tsx` — foto pengurus harus punya `alt="Foto [Nama Pengurus], [Jabatan]"`
- [ ] Pastikan gambar hero di `/profile` punya alt yang benar: ✅ sudah ada `alt="Gedung Asrama Al Muhasibi"`

---

## FASE 3 — Structured Data / Schema.org (Prioritas MENENGAH) ⬜

*Target: Rich snippets untuk semua halaman kunci.*

### 3.1 Sempurnakan JSON-LD Homepage

**File:** `frontend/src/app/page.tsx`

- [ ] Tambahkan `@type: "CollegeOrUniversity"` atau gunakan `@graph` gabungan:
  ```json
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://al-muhasibi.vercel.app/#organization",
        "name": "Mabna Al Muhasibi",
        "alternateName": ["Al Muhasibi", "Asrama Al Muhasibi"],
        "url": "https://al-muhasibi.vercel.app",
        "logo": { "@type": "ImageObject", "url": "https://al-muhasibi.vercel.app/logo.png" },
        "parentOrganization": {
          "@type": "CollegeOrUniversity",
          "name": "Universitas Islam Negeri Maulana Malik Ibrahim Malang",
          "url": "https://uin-malang.ac.id"
        },
        "sameAs": [
          "https://www.instagram.com/mahad_alj/",
          "https://www.facebook.com/mahadaljamiah.uinmalang"
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Jl. Gajayana No.50",
          "addressLocality": "Malang",
          "addressRegion": "Jawa Timur",
          "postalCode": "65144",
          "addressCountry": "ID"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://al-muhasibi.vercel.app/#website",
        "url": "https://al-muhasibi.vercel.app",
        "name": "Al Muhasibi",
        "description": "Media dakwah dan dokumentasi Asrama Al Muhasibi UIN Maliki Malang",
        "publisher": { "@id": "https://al-muhasibi.vercel.app/#organization" },
        "inLanguage": "id-ID"
      }
    ]
  }
  ```
- [ ] Hapus `telephone` yang mungkin bukan nomor langsung Al Muhasibi — verifikasi dulu

### 3.2 Tambah JSON-LD Halaman `/profile`

**File:** `frontend/src/app/profile/page.tsx`

- [ ] Tambah `AboutPage` schema:
  ```json
  {
    "@type": "AboutPage",
    "@id": "https://al-muhasibi.vercel.app/profile#webpage",
    "url": "https://al-muhasibi.vercel.app/profile",
    "name": "Profil Asrama Al Muhasibi",
    "description": "Sejarah, visi misi, dan struktur kepengurusan Asrama Al Muhasibi",
    "isPartOf": { "@id": "https://al-muhasibi.vercel.app/#website" }
  }
  ```

### 3.3 Tambah JSON-LD Halaman `/jadwal`

**File:** `frontend/src/app/jadwal/page.tsx` atau `JadwalClient.tsx`

- [ ] Tambah `Event` schema untuk jadwal rutin (jika jadwal bersifat berulang):
  ```json
  {
    "@type": "Schedule",
    "name": "Jadwal Kegiatan Mahasantri Al Muhasibi",
    "organizer": { "@id": "https://al-muhasibi.vercel.app/#organization" }
  }
  ```

### 3.4 Tambah BreadcrumbList di Halaman Dalam

- [ ] Tambah `BreadcrumbList` di `/galeri`, `/jadwal`, `/profile`:
  ```json
  {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Beranda", "item": "https://al-muhasibi.vercel.app" },
      { "@type": "ListItem", "position": 2, "name": "Galeri", "item": "https://al-muhasibi.vercel.app/galeri" }
    ]
  }
  ```

---

## FASE 4 — Performa & Core Web Vitals (Prioritas MENENGAH) ⬜

*Target: LCP < 2.5s, CLS < 0.1, INP < 200ms.*

### 4.1 Perbaiki Arsitektur Violation di `/profile`

**File:** `frontend/src/app/profile/page.tsx` baris 36–41

- [ ] **KRITIS (pelanggaran arsitektur):** Hapus akses Supabase langsung di frontend!
  ```typescript
  // ❌ SALAH — ini ada di profile/page.tsx sekarang:
  const supabase = await createClient()
  const { data: fasilitasItems } = await supabase.from('gallery').select('*')...

  // ✅ BENAR — gunakan API backend:
  const fasilitasItems = await fetchGallery({ category: 'Fasilitas Fisik', limit: 6 })
  ```
- [ ] Tambahkan parameter `category` ke `GET /api/gallery` di backend jika belum ada

### 4.2 Optimasi Gambar

- [ ] Audit `HomeCarousel.tsx`:
  - Gambar pertama (above-the-fold): pastikan `priority={true}` dan `fetchpriority="high"`
  - Gambar berikutnya: `loading="lazy"`
- [ ] Audit semua `next/image`:
  - Pastikan semua punya atribut `sizes` yang tepat
  - Format: Supabase sudah melayani format modern? (Cek apakah perlu transform ke WebP)
- [ ] Pertimbangkan `placeholder="blur"` untuk gambar yang punya `blurDataURL`

### 4.3 Optimasi Loading

- [ ] Homepage sudah pakai `dynamic()` dengan `loading` skeleton — ✅ bagus
- [ ] Pastikan `revalidate = 60` di halaman galeri sudah optimal (ISR)
- [ ] Halaman `/jadwal` pakai `force-dynamic` — apakah perlu? Pertimbangkan ISR jika jadwal jarang berubah

### 4.4 Resource Hints

**File:** `frontend/src/app/layout.tsx`

- [ ] Tambah `<link rel="preconnect">` untuk domain eksternal:
  ```typescript
  // Di layout.tsx metadata:
  other: {
    'link': [
      { rel: 'preconnect', href: 'https://nozwgjjkecyrpkpybrdf.supabase.co' },
      { rel: 'dns-prefetch', href: 'https://nozwgjjkecyrpkpybrdf.supabase.co' },
    ]
  }
  ```

---

## FASE 5 — Konten & Keyword Strategy (Prioritas RENDAH) ⬜

*Target: Konten yang relevan untuk target audiens (mahasiswa baru, wali santri, umum).*

### 5.1 Target Keyword Utama (Research)

Berdasarkan konteks project, keyword yang relevan:

| Cluster | Keyword Utama | Volume Estimasi |
|---|---|---|
| Brand | "Al Muhasibi", "Mabna Al Muhasibi" | Rendah–Menengah |
| Lokal | "asrama UIN Malang", "pesantren mahasiswa Malang" | Menengah |
| Informasional | "jadwal kegiatan asrama", "Ma'had al-Jami'ah UIN" | Rendah |
| Navigasional | "Al Muhasibi UIN Maliki Malang" | Rendah |

- [ ] Pasang **Google Search Console** (sudah ada verification tag — pastikan sudah diverifikasi)
- [ ] Setelah 1 bulan, cek query apa yang mendatangkan klik di GSC
- [ ] Gunakan data nyata untuk update keyword strategy

### 5.2 Optimasi Konten Halaman

- [ ] **Homepage:** Teks "Selamat Datang di Ruang Digital Kami" bisa lebih keyword-rich
  - Tambahkan menyebut "Asrama Al Muhasibi UIN Maliki Malang" secara alami di body text
- [ ] **Profile:** Konten sejarah sudah bagus dan kaya informasi — pertahankan
- [ ] **Jadwal:** Halaman ini informatif — pastikan nama hari dalam bahasa Indonesia jelas (Senin, Selasa, ...)

### 5.3 Internal Linking

- [ ] Pastikan footer atau navigasi mencantumkan semua link publik:
  - `/` (Beranda) → `/galeri` → `/jadwal` → `/profile`
- [ ] Di halaman Profile, CTA "Lihat Galeri Kami" sudah ada ✅ — tambahkan juga sebaliknya
- [ ] Pertimbangkan breadcrumb navigasi yang terlihat (bukan hanya schema) untuk halaman dalam

---

## FASE 6 — Monitoring & Iterasi (Berkelanjutan) ⬜

*Target: Data-driven SEO improvement setelah production live.*

### 6.1 Setup Google Search Console

- [ ] Verifikasi domain di Google Search Console (verification tag sudah ada di `layout.tsx`)
- [ ] Submit sitemap: `https://al-muhasibi.vercel.app/sitemap.xml`
- [ ] Monitor: Coverage report, Core Web Vitals, Performance report

### 6.2 Setup Google Analytics (Opsional)

- [ ] Pasang Google Analytics 4 (GA4) atau gunakan Vercel Analytics (lebih mudah)
- [ ] Vercel Analytics sudah built-in jika deploy ke Vercel — aktifkan dari dashboard

### 6.3 Checklist Bulanan

- [ ] Cek Google Search Console: ada halaman yang di-crawl tapi error?
- [ ] Cek Core Web Vitals report di GSC
- [ ] Update `lastModified` di sitemap.ts berdasarkan konten terbaru
- [ ] Review keyword baru yang muncul organik dan optimasi halaman terkait

---

## Ringkasan Prioritas Implementasi

| No | Task | File | Dampak | Kompleksitas | Status |
|----|------|------|--------|--------------|--------|
| 1 | Canonical URL absolut | `galeri`, `jadwal`, `profile` page.tsx | 🔴 Tinggi | 🟢 Mudah | ⬜ |
| 2 | noindex `/login` + hapus dari sitemap | `login/page.tsx`, `sitemap.ts` | 🔴 Tinggi | 🟢 Mudah | ⬜ |
| 3 | Perbaiki akses Supabase langsung di `/profile` | `profile/page.tsx` | 🔴 Tinggi | 🟡 Sedang | ⬜ |
| 4 | Tambah `<h1>` di homepage | `page.tsx` | 🟠 Menengah | 🟢 Mudah | ⬜ |
| 5 | noindex Admin layout | `admin/layout.tsx` | 🟠 Menengah | 🟢 Mudah | ⬜ |
| 6 | OG image lokal sebagai fallback | `public/og-default.jpg` | 🟠 Menengah | 🟢 Mudah | ⬜ |
| 7 | OG image per halaman | `galeri`, `jadwal`, `profile` | 🟠 Menengah | 🟢 Mudah | ⬜ |
| 8 | Sempurnakan JSON-LD Homepage | `page.tsx` | 🟠 Menengah | 🟡 Sedang | ⬜ |
| 9 | Tambah JSON-LD Profile & Jadwal | `profile`, `jadwal` | 🟡 Rendah | 🟡 Sedang | ⬜ |
| 10 | BreadcrumbList schema | Semua halaman dalam | 🟡 Rendah | 🟡 Sedang | ⬜ |
| 11 | Submit sitemap ke GSC | Google Search Console | 🔴 Tinggi | 🟢 Mudah | ⬜ |
| 12 | Optimasi gambar (priority, sizes) | `HomeCarousel`, komponen lain | 🟠 Menengah | 🟡 Sedang | ⬜ |
| 13 | Resource hints (preconnect) | `layout.tsx` | 🟡 Rendah | 🟢 Mudah | ⬜ |
| 14 | Meta description lebih kaya keyword | Semua halaman | 🟡 Rendah | 🟢 Mudah | ⬜ |

---

## Catatan Penting

- **Jangan ubah URL publik** yang sudah ada (`/galeri`, `/jadwal`, `/profile`) — sudah diindeks, jika diubah harus 301 redirect
- **Jangan ubah `globals.css`** — CSS variables sudah membantu performa (no render-blocking)
- **Hapus `meta keywords`** di `layout.tsx` — sudah deprecated dan tidak berpengaruh di Google (opsional, tidak merusak)
- **Domain produksi final** — saat ini masih `al-muhasibi.vercel.app`. Jika suatu saat pindah ke domain custom, semua `metadataBase` dan canonical harus diupdate + pasang 301 redirect
- **Tidak perlu dependency baru** untuk semua task SEO ini — semua bisa dikerjakan dengan Next.js Metadata API yang sudah ada

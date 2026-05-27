---
trigger: always_on
---

# Aturan SEO — Rules untuk Antigravity Agent

Simpan file ini di: `your-workspace/.agents/rules/seo-rules.md`

File ini akan selalu dipertimbangkan agen saat membuat atau memodifikasi kode apapun yang berkaitan dengan web output.

---

## Aturan Wajib (SELALU diterapkan)

- Setiap halaman WAJIB memiliki meta title yang unik, 50-60 karakter, mengandung keyword utama.
- Setiap halaman WAJIB memiliki meta description yang unik, 120-160 karakter.
- Setiap halaman WAJIB memiliki satu `<h1>` yang mengandung keyword utama.
- Setiap halaman WAJIB memiliki canonical tag yang menunjuk ke dirinya sendiri (self-referencing).
- Semua gambar WAJIB memiliki `alt` attribute yang deskriptif.
- Semua gambar WAJIB memiliki atribut `width` dan `height` untuk mencegah CLS.
- Gambar above-the-fold (hero, banner) WAJIB menggunakan `fetchpriority="high"` dan TIDAK boleh lazy-loaded.
- Semua gambar below-the-fold WAJIB menggunakan `loading="lazy"`.
- URL WAJIB menggunakan huruf kecil dan tanda hubung (`-`), bukan underscore (`_`).
- Redirect permanen WAJIB menggunakan status 301, bukan 302.
- HTTPS WAJIB digunakan di semua URL canonical dan meta tag.
- Structured data JSON-LD WAJIB divalidasi sebelum di-deploy.
- `robots.txt` WAJIB ada dan tidak memblokir CSS/JS penting.
- `sitemap.xml` WAJIB ada, dapat diakses publik, dan hanya berisi URL yang dapat diindex.

---

## Aturan Dilarang (JANGAN lakukan)

- JANGAN menambahkan `noindex` pada halaman yang seharusnya bisa diindex.
- JANGAN membuat meta title atau description yang duplikat antar halaman.
- JANGAN menggunakan keyword stuffing (pengulangan keyword yang tidak alami).
- JANGAN menggunakan `<h1>` lebih dari sekali per halaman.
- JANGAN meng-hardcode URL dengan `http://` — selalu gunakan `https://`.
- JANGAN menambahkan halaman noindex ke sitemap.xml.
- JANGAN menggunakan `display: none` untuk menyembunyikan konten dari pengguna yang tetap ingin ditampilkan ke mesin pencari.
- JANGAN membuat redirect chain lebih dari 2 hop.
- JANGAN menggunakan `target="_blank"` tanpa `rel="noopener noreferrer"`.
- JANGAN menggunakan font tanpa `font-display: swap` atau `optional`.
- JANGAN menempatkan script blocking di `<head>` tanpa `defer` atau `async`.
- JANGAN membuat perubahan pada `robots.txt`, canonical, redirect, atau noindex tanpa konfirmasi eksplisit dari pengguna.

---

## Aturan Per Konteks

### Saat membuat halaman baru:
- Selalu tambahkan: title, description, canonical, OG tags, Twitter Card
- Selalu tambahkan: BreadcrumbList schema (kecuali homepage)
- Selalu tambahkan: schema yang relevan dengan tipe halaman
- Selalu tambahkan URL ke sitemap.xml

### Saat membuat komponen gambar:
- Selalu sertakan: `width`, `height`, `alt`, dan strategy loading yang tepat
- Gunakan format WebP dengan fallback jika framework mendukung
- Tanyakan apakah gambar above-fold atau below-fold untuk menentukan loading strategy

### Saat membuat komponen navigasi / link:
- Gunakan anchor text deskriptif, bukan "klik di sini" atau "baca selengkapnya"
- Pastikan semua link internal menggunakan path relatif atau URL yang benar
- Tambahkan `aria-label` pada link yang ikonnya tidak memiliki teks

### Saat melakukan refactor URL atau routing:
- SELALU buat daftar URL lama → URL baru sebelum mengeksekusi
- SELALU tambahkan 301 redirect dari URL lama ke URL baru
- SELALU update internal link yang menunjuk ke URL lama
- SELALU update sitemap.xml

### Saat membuat form atau halaman interaktif:
- Pastikan halaman tetap dapat dirender tanpa JavaScript (progressive enhancement)
- Atau gunakan SSR/SSG agar konten utama tidak bergantung pada JS untuk SEO

---

## Standar Kode SEO

### HTML Output:
```html
<!-- Template head SEO minimal yang wajib ada -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary -->
  <title>[Keyword Utama] — [Proposi Nilai] | [Brand]</title>
  <meta name="description" content="[120-160 karakter, mengandung keyword]">
  <link rel="canonical" href="https://[domain]/[slug]">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://[domain]/[slug]">
  <meta property="og:title" content="[Title]">
  <meta property="og:description" content="[Description]">
  <meta property="og:image" content="https://[domain]/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="id_ID">
  <meta property="og:site_name" content="[Brand]">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="[Title]">
  <meta name="twitter:description" content="[Description]">
  <meta name="twitter:image" content="https://[domain]/og-image.jpg">
  
  <!-- Robots -->
  <meta name="robots" content="index, follow">
</head>
```

### Gambar:
```html
<!-- Above-the-fold / LCP image -->
<img
  src="/hero.webp"
  alt="[Deskripsi spesifik yang mengandung keyword]"
  width="1200"
  height="630"
  fetchpriority="high"
  decoding="async"
>

<!-- Below-the-fold image -->
<img
  src="/content-image.webp"
  alt="[Deskripsi spesifik]"
  width="800"
  height="450"
  loading="lazy"
  decoding="async"
>
```

### Link:
```html
<!-- Internal link — anchor text deskriptif -->
<a href="/panduan-seo-teknis">Panduan SEO Teknis untuk Developer</a>

<!-- External link — selalu noopener -->
<a href="https://developers.google.com" rel="noopener noreferrer" target="_blank">
  Google Search Central
</a>
```
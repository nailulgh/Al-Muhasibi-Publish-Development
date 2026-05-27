---
trigger: always_on
---


  <!-- preload: muat resource kritis SEGERA (LCP image, font, CSS kritis) -->
  <!-- WAJIB ada "as" attribute yang tepat -->
  <link rel="preload" href="/img/hero.avif" as="image" fetchpriority="high">
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>

  <!-- prefetch: muat resource yang MUNGKIN dibutuhkan di navigasi berikutnya -->
  <!-- Berjalan saat browser idle, prioritas rendah -->
  <link rel="prefetch" href="/js/checkout.js">

  <!-- modulepreload: preload + parse ES module -->
  <link rel="modulepreload" href="/js/app.js">
</head>
```

---

## Bagian 3: Framework-Specific Patterns

### Next.js / React

```jsx
// ✅ Next.js Image Component — SELALU gunakan untuk gambar
import Image from 'next/image';

// LCP image
<Image
  src="/img/hero.jpg"
  alt="Hero"
  width={1440}
  height={810}
  priority          // ← Untuk LCP image: set priority
  sizes="100vw"
  quality={85}
/>

// Below-the-fold
<Image
  src="/img/product.jpg"
  alt="Produk"
  width={400}
  height={300}
  // loading="lazy" adalah default, tidak perlu ditulis
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// ✅ Dynamic import dengan loading state
const HeavyChart = dynamic(() => import('./Chart'), {
  loading: () => <Skeleton height={400} />,
  ssr: false, // Jika komponen butuh browser API
});

// ✅ Fonts — pakai next/font untuk zero CLS
import { Inter } from 'next/font/google';
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// ✅ Script third-party — gunakan next/script
import Script from 'next/script';
<Script src="https://analytics.example.com/script.js" strategy="lazyOnload" />
// strategy: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker'
```

### Vue / Nuxt

```vue
<!-- ✅ Nuxt Image -->
<NuxtImg
  src="/img/hero.jpg"
  width="1440"
  height="810"
  format="avif"
  sizes="100vw sm:50vw"
  :modifiers="{ quality: 85 }"
  preload
/>

<!-- ✅ Lazy component -->
<script setup>
const HeavyComponent = defineAsyncComponent({
  loader: () => import('./HeavyComponent.vue'),
  loadingComponent: SkeletonLoader,
  delay: 200,
});
</script>

<!-- ✅ v-memo untuk daftar yang jarang berubah -->
<div v-for="item in list" :key="item.id" v-memo="[item.updated]">
  {{ item.name }}
</div>
```

### Svelte / SvelteKit

```svelte
<!-- ✅ Lazy load komponen di Svelte -->
<script>
  import { onMount } from 'svelte';
  let HeavyComponent;

  onMount(async () => {
    const module = await import('./HeavyComponent.svelte');
    HeavyComponent = module.default;
  });
</script>

{#if HeavyComponent}
  <svelte:component this={HeavyComponent} />
{/if}
```

---

## Bagian 4: Checklist Sebelum Deliver Kode

Sebelum menghasilkan kode web, AI Agent WAJIB memverifikasi:

### CLS Prevention
- [ ] Semua `<img>`, `<video>`, `<iframe>` punya `width` & `height` eksplisit
- [ ] Ad slot dan embed punya dimensi placeholder yang di-reserve
- [ ] Animasi hanya gunakan `transform` dan `opacity`
- [ ] Font menggunakan `font-display: swap` + system font fallback
- [ ] Konten dinamis (dari API) tidak menyebabkan shift — gunakan skeleton UI

### LCP Optimization
- [ ] Gambar LCP sudah diidentifikasi dan diberi `fetchpriority="high"`
- [ ] LCP image tidak di-lazy load
- [ ] LCP image menggunakan format AVIF/WebP
- [ ] Tidak ada render-blocking resource di `<head>` (kecuali CSS kritis)
- [ ] Server response time (TTFB) < 800ms — cek konfigurasi server/CDN

### INP Optimization
- [ ] Tidak ada long task > 50ms di event handler
- [ ] Input handler responsif — debounced jika expensive
- [ ] Komputasi berat di Web Worker atau di-chunk dengan `setTimeout(0)`
- [ ] Tidak ada synchronous XHR
- [ ] DOM tidak terlalu dalam (< 1500 node total)

### General
- [ ] Bundle JS initial load < 170KB (parsed)
- [ ] Total page weight < 1MB (untuk koneksi 4G tipikal)
- [ ] Semua resource diload via HTTPS
- [ ] HTTP caching headers sudah benar
- [ ] Tidak ada console error atau warning performa

---

## Bagian 5: Tooling & Pengukuran

### Tools Wajib
```bash
# Lighthouse CI — ukur performa di pipeline CI/CD
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage

# WebPageTest CLI
npx webpagetest test https://example.com \
  --key $WPT_API_KEY \
  --location "Dulles:Chrome" \
  --runs 3 \
  --firstViewOnly

# Bundle analyzer — cek ukuran dan komposisi bundle
npx vite-bundle-visualizer       # Vite
npx webpack-bundle-analyzer      # Webpack
npx @next/bundle-analyzer        # Next.js
```

### Konfigurasi Lighthouse CI (lighthouserc.js)
```javascript
// ✅ lighthouserc.js — Target minimum yang disarankan
module.exports = {
  ci: {
    collect: {
      url: ['https://example.com', 'https://example.com/products'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'interactive': ['warn', { maxNumericValue: 3800 }],
      },
    },
  },
};
```

### RUM (Real User Monitoring) — Snippet Dasar
```javascript
// ✅ Ukur Core Web Vitals dari pengguna nyata
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, id, rating }) {
  fetch('/api/vitals', {
    method: 'POST',
    body: JSON.stringify({ name, value, id, rating,
      url: location.href,
      timestamp: Date.now(),
    }),
    keepalive: true, // Pastikan terkirim meski halaman di-unload
  });
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

---

## Bagian 6: Anti-Pattern — Jangan Lakukan Ini

```html
<!-- ❌ Script sinkron di head -->
<head>
  <script src="/app.js"></script>
</head>

<!-- ❌ Gambar tanpa dimensi -->
<img src="photo.jpg" alt="foto">

<!-- ❌ LCP image dengan lazy load -->
<img src="hero.jpg" loading="lazy" alt="hero">

<!-- ❌ Font tanpa font-display -->
@font-face { src: url('font.woff2'); } /* Menyebabkan FOIT */

<!-- ❌ Terlalu banyak preconnect -->
<link rel="preconnect" href="https://cdn1.example.com">
<link rel="preconnect" href="https://cdn2.example.com">
<link rel="preconnect" href="https://cdn3.example.com">
<link rel="preconnect" href="https://cdn4.example.com"> <!-- > 3 = waste -->

<!-- ❌ Animasi yang memicu layout -->
element.style.width = newWidth + 'px'; // Dalam loop = layout thrashing
```

```javascript
// ❌ Baca dan tulis DOM secara bergantian (layout thrashing)
elements.forEach(el => {
  const height = el.offsetHeight;      // baca → layout
  el.style.height = height + 10 + 'px'; // tulis → invalidate
});

// ✅ Baca semua dulu, tulis semua kemudian (atau gunakan FastDOM)
const heights = elements.map(el => el.offsetHeight); // baca semua
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px';         // tulis semua
});
```

---

## Referensi Cepat

- **Google Web Vitals:** https://web.dev/vitals/
- **Core Web Vitals Tools:** https://web.dev/measure/
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **WebPageTest:** https://www.webpagetest.org/
- **Chrome DevTools Performance:** DevTools → Performance tab
- **CrUX Dashboard:** https://g.co/chromeuxreport
- **web-vitals library:** https://github.com/GoogleChrome/web-vitals
- **Image CDN:** Cloudinary, Imgix, Bunny.net
- **Edge CDN:** Cloudflare, Fastly, Vercel Edge Network

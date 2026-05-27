import dynamic from 'next/dynamic';
import { fetchGallery } from '@/lib/api/gallery';
import { fetchPrograms } from '@/lib/api/programs';
// Dynamically import components
const HomeCarousel = dynamic(() => import('@/components/HomeCarousel'), {
  // Loading handled by the component itself (first image has priority)
});

const ProgramsSection = dynamic(() => import('@/components/sections/ProgramsSection'), {
  loading: () => <div className="min-h-[500px] animate-pulse bg-gray-100 rounded-xl w-full" />,
});

const ProfileSection = dynamic(() => import('@/components/sections/ProfileSection'), {
  loading: () => <div className="min-h-[500px] animate-pulse bg-gray-100 rounded-xl w-full" />,
});

const GallerySection = dynamic(() => import('@/components/sections/GallerySection'), {
  loading: () => <div className="min-h-[600px] animate-pulse bg-gray-100 rounded-xl w-full" />,
});

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch Programs - Select only needed fields
  const programs = await fetchPrograms();

  // Fetch Latest Gallery Items for Carousel & Preview
  const galleryItems = await fetchGallery({ limit: 5 });

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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">
        Al Muhasibi — Asrama Putra UIN Maulana Malik Ibrahim Malang
      </h1>
      {/* Hero Section with Carousel */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-[var(--background)]">
        {galleryItems && galleryItems.length > 0 ? (
          <HomeCarousel items={galleryItems} />
        ) : (
          <HomeCarousel items={[]} />
        )}
      </section>

      {/* Welcome & Quote Section - Kept here as it's small and high up */}
      <section className="py-20 md:py-28 bg-[var(--background)] border-y border-[var(--border-color)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-[var(--accent-olive)] font-heading">
              Selamat Datang di Ruang Digital Kami
            </h2>
            <p className="mt-4 text-lg text-[var(--text-secondary)]">
              Website ini didedikasikan untuk menyebarkan informasi,
              mendokumentasikan kegiatan, dan menjadi sarana dakwah bagi seluruh
              civitas akademika, wali santri, dan masyarakat umum yang tertarik
              dengan kehidupan di Asrama Al Muhasibi.
            </p>
          </div>

          <div className="text-center max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            <blockquote className="relative">
              <div className="mt-10 text-center">
                <p className="text-2xl md:text-3xl italic text-[var(--text-primary)] leading-relaxed font-amiri">
                  خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ
                </p>
                <p className="mt-3 text-base md:text-lg text-[var(--text-secondary)]">
                  Artinya: "Sebaik-baik manusia adalah yang paling bermanfaat
                  bagi manusia".
                </p>
                <p className="mt-1 text-sm md:text-base text-[var(--text-secondary)] italic">
                  (HR. Ahmad, ath-Thabrani, ad-Daruquthni)
                </p>
              </div>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Program Unggulan Section */}
      <ProgramsSection programs={programs} />

      {/* Profil Singkat Section */}
      <ProfileSection />

      {/* Galeri Preview Section */}
      <GallerySection galleryItems={galleryItems} />
    </>
  );
}

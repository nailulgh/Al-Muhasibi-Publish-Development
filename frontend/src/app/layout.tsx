import type { Metadata } from "next";
import { Montserrat, Open_Sans, Amiri } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://al-muhasibi.vercel.app'),
  title: {
    default: "Al Muhasibi - Asrama UIN Maliki Malang",
    template: "%s | Al Muhasibi"
  },
  description: "Media Dakwah & Dokumentasi Asrama Al Muhasibi, Mencetak Generasi Ulul Albab Melalui Pengembangan Spiritual dan Intelektual Islami.",
  keywords: [
    "Al Muhasibi",
    "Asrama",
    "Pesantren",
    "Pesantren Mahasiswa",
    "UIN Maliki Malang",
    "Mahad Aly",
    "Pendidikan Islam",
    "Mabna Al Muhasibi",
    "Mabna",
    "Mabna Al Muhasibi UIN Maliki Malang",
    "Mabna UIN Maliki Malang",
    "Universitas Islam Negeri Maulana Malik Ibrahim Malang",
  ],
  authors: [{ name: "Mabna Al Muhasibi" }],
  creator: "Muhammad Nailul Ghufron Majid",
  publisher: "Mabna Al Muhasibi",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://al-muhasibi.vercel.app',
  },
  openGraph: {
    title: "Al Muhasibi - Asrama UIN Maliki Malang",
    description: "Media Dakwah & Dokumentasi Asrama Al Muhasibi, Mencetak Generasi Ulul Albab Melalui Pengembangan Spiritual dan Intelektual Islami.",
    url: 'https://al-muhasibi.vercel.app',
    siteName: 'Al Muhasibi',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: 'https://nozwgjjkecyrpkpybrdf.supabase.co/storage/v1/object/public/profile-images/MusyMuhasibi-1.png',
        width: 1200,
        height: 630,
        alt: 'Pengurus & Mahasantri Al Muhasibi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Al Muhasibi - Asrama UIN Maliki Malang",
    description: "Media Dakwah & Dokumentasi Asrama Al Muhasibi, Mencetak Generasi Ulul Albab Melalui Pengembangan Spiritual dan Intelektual Islami.",
    creator: '@almuhasibi',
    images: ['https://nozwgjjkecyrpkpybrdf.supabase.co/storage/v1/object/public/profile-images/MusyMuhasibi-1.png'],
  },
  verification: {
    google: [
      "WzXGSX4LUMflTHkk811Ln77zyPGSlxoe_c9t1MHYQBo",
      "jHjrlbXMgkR_mXm0bXqTBAbvF_9PWArh9vdThalELpc"
    ],
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { AosInit } from "@/components/AosInit";
// ... imports

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${openSans.variable} ${amiri.variable} antialiased bg-[var(--background)] text-[var(--text-primary)]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AosInit />
          <Header user={user} />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}


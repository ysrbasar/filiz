import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google'
import { ServiceWorkerRegistrar } from '@/components/layout/ServiceWorkerRegistrar'
import './globals.css'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Filiz — Tohumdan Hasada Dijital Tarım Platformu',
    template: '%s | Filiz',
  },
  description:
    'Türkiye\'nin kapsamlı dijital tarım platformu. Tohum, fide, organik gübre satışı; QR destekli yetiştirme rehberleri ve yapay zeka bitki danışmanı.',
  keywords: ['tohum', 'fide', 'organik tarım', 'bahçecilik', 'dijital tarım', 'bitki yetiştirme'],
  authors: [{ name: 'Filiz' }],
  creator: 'Filiz',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Filiz',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Filiz',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@filizplatform',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#4ade80" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  )
}

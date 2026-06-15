import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { HowItWorks } from '@/components/home/HowItWorks'
import { FeaturedSeeds } from '@/components/home/FeaturedSeeds'
import { SeasonalPicks } from '@/components/home/SeasonalPicks'
import { HobbySetsBanner } from '@/components/home/HobbySetsBanner'
import { AcademyTeaser } from '@/components/home/AcademyTeaser'
import { AIAdvisorTeaser } from '@/components/home/AIAdvisorTeaser'

export const metadata: Metadata = {
  title: 'Filiz — Tohumdan Hasada Dijital Tarım Platformu',
  description: 'QR destekli kişiselleştirilmiş yetiştirme rehberleri, bölgesel ekim takvimleri ve yapay zeka bitki danışmanı. Türkiye\'nin en kapsamlı dijital tarım ve tohum e-ticaret platformu.',
  openGraph: {
    title: 'Filiz — Tohumdan Hasada Dijital Tarım',
    description: 'Türkiye\'nin dijital tarım platformu. Tohum al, QR oku, rehberle büyüt.',
    images: ['/og-home.jpg'],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Filiz',
  url: 'https://filiz.com.tr',
  logo: 'https://filiz.com.tr/logo.png',
  description: 'Türkiye\'nin dijital tarım ve tohum e-ticaret platformu',
  sameAs: ['https://instagram.com/filizplatform', 'https://twitter.com/filizplatform'],
  contactPoint: { '@type': 'ContactPoint', email: 'info@filiz.com.tr', contactType: 'customer service' },
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <HeroSection />
      <HowItWorks />
      <FeaturedSeeds />
      <SeasonalPicks />
      <HobbySetsBanner />
      <AcademyTeaser />
      <AIAdvisorTeaser />
    </>
  )
}

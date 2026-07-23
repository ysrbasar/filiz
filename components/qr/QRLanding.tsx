'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sprout, Star, ArrowRight, CheckCircle, Loader2, MapPin } from 'lucide-react'
import { GrowthTimeline } from '@/components/tohum/GrowthTimeline'
import { MonthlyCalendarGrid } from '@/components/tohum/MonthlyCalendarGrid'
import { CitySelector } from '@/components/tohum/CitySelector'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface Props {
  seed: any
  userId: string | null
  plantedSeed: { id: string; currentStageOrder: number } | null
}

export function QRLanding({ seed, userId, plantedSeed }: Props) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)
  const [started, setStarted] = useState(!!plantedSeed)

  const calendarToShow = selectedCity
    ? seed.regionCalendars.find((c: any) => c.city === selectedCity)
    : seed.regionCalendars[0] ?? null

  async function startGrowing() {
    if (!userId) return
    setStarting(true)
    try {
      const res = await fetch('/api/garden/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seedId: seed.id, city: selectedCity }),
      })
      if (res.ok) setStarted(true)
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <div>
            <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden bg-white/20 mb-6 ring-4 ring-white/30">
              {seed.images[0] ? (
                <Image src={seed.images[0]} alt={seed.name} width={96} height={96} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Sprout className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="text-primary-200 text-sm font-medium mb-2">QR Tohum Rehberi</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">{seed.name}</h1>
            {seed.scientificName && (
              <p className="text-primary-200 italic text-sm mb-4">{seed.scientificName}</p>
            )}
            <p className="text-primary-100 text-base leading-relaxed max-w-xl mx-auto">
              {seed.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Bahçe Başlat / Devam Et */}
        {userId ? (
          <div className={cn(
            'rounded-2xl p-6 mb-8 text-center border-2',
            started ? 'bg-primary-50 border-primary-300' : 'bg-white border-primary-200 shadow-filiz'
          )}>
            {started ? (
              <>
                <CheckCircle className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                <h2 className="font-display font-bold text-text-primary text-lg mb-2">Bahçenize Eklendi!</h2>
                <p className="text-text-secondary text-sm mb-4">
                  {seed.name} bahçenizde büyüyor. İlerlemenizi takip edin.
                </p>
                <Link
                  href="/bahcem"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                >
                  Bahçeme Git <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <Sprout className="w-10 h-10 text-primary-400 mx-auto mb-3" />
                <h2 className="font-display font-bold text-text-primary text-lg mb-2">Bu Tohumu Yetiştirmeye Başla</h2>
                <p className="text-text-secondary text-sm mb-4">
                  Dijital bahçenize ekleyin, büyüme sürecini takip edin ve hatırlatmalar alın.
                </p>
                {selectedCity && (
                  <p className="text-xs text-primary-600 mb-3 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" /> {selectedCity} için özelleştirilecek
                  </p>
                )}
                <Button
                  size="lg"
                  onClick={startGrowing}
                  disabled={starting}
                  className="bg-primary-500 hover:bg-primary-600 rounded-xl"
                >
                  {starting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sprout className="w-4 h-4 mr-2" />}
                  Bahçene Ekle
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 mb-8 text-center">
            <Star className="w-10 h-10 text-primary-400 mx-auto mb-3" />
            <h2 className="font-display font-bold text-text-primary text-lg mb-2">Kişiselleştirilmiş Rehber</h2>
            <p className="text-text-secondary text-sm mb-4">
              Bahçenize eklemek ve kişisel büyüme takviminizi görmek için giriş yapın.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href={`/giris?callbackUrl=/qr/${seed.slug}`}
                className="bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href={`/kayit?callbackUrl=/qr/${seed.slug}`}
                className="bg-white border border-primary-300 text-primary-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-50 transition-colors"
              >
                Kayıt Ol
              </Link>
            </div>
          </div>
        )}

        {/* Büyüme Zaman Çizelgesi */}
        {seed.stages.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-text-primary mb-6">Büyüme Aşamaları</h2>
            <GrowthTimeline stages={seed.stages} />
          </section>
        )}

        {/* Ekim Takvimi */}
        {seed.regionCalendars.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
              <h2 className="font-display text-2xl font-bold text-text-primary">Ekim Takvimi</h2>
              <CitySelector
                calendars={seed.regionCalendars}
                selectedCity={selectedCity}
                onChange={setSelectedCity}
              />
            </div>
            {calendarToShow && (
              <MonthlyCalendarGrid
                plantingMonths={calendarToShow.plantingMonths}
                harvestMonths={calendarToShow.harvestMonths}
                city={calendarToShow.city}
                notes={calendarToShow.notes}
              />
            )}
          </section>
        )}

        {/* SSS */}
        {seed.faqs.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-4">Sık Sorulan Sorular</h2>
            <div className="space-y-3">
              {seed.faqs.map((faq: any) => (
                <details key={faq.id} className="bg-white border border-primary-100 rounded-2xl overflow-hidden group">
                  <summary className="p-5 font-semibold text-text-primary cursor-pointer list-none flex justify-between items-center">
                    {faq.question}
                    <span className="text-primary-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed border-t border-primary-50 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Alt link */}
        <div className="mt-10 text-center">
          <Link href={`/tohum/${seed.slug}`} className="text-primary-600 hover:underline text-sm">
            {seed.name} — Tam Ürün Sayfası →
          </Link>
        </div>
      </div>
    </div>
  )
}

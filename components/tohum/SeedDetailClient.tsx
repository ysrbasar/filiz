'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Star, Droplets, Sun, Sprout, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { GrowthTimeline } from '@/components/tohum/GrowthTimeline'
import { MonthlyCalendarGrid } from '@/components/tohum/MonthlyCalendarGrid'
import { CitySelector } from '@/components/tohum/CitySelector'
import { cn } from '@/lib/utils/cn'

const DIFFICULTY_MAP = {
  BEGINNER: { label: 'Başlangıç', color: 'bg-primary-100 text-primary-700' },
  INTERMEDIATE: { label: 'Orta Seviye', color: 'bg-amber-100 text-amber-700' },
  ADVANCED: { label: 'İleri Seviye', color: 'bg-red-100 text-red-600' },
}

const WATER_MAP = { LOW: 'Az Su', MEDIUM: 'Orta Su', HIGH: 'Çok Su' }
const SUN_MAP = { FULL_SUN: 'Tam Güneş', PARTIAL_SHADE: 'Yarı Gölge', FULL_SHADE: 'Gölge' }

const MONTHS_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

interface Props {
  seed: any
}

export function SeedDetailClient({ seed }: Props) {
  const [activeImage, setActiveImage] = useState(0)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const addItem = useCartStore((s) => s.addItem)

  const diff = DIFFICULTY_MAP[seed.difficulty as keyof typeof DIFFICULTY_MAP]

  const cityCalendar = selectedCity
    ? seed.regionCalendars.find((c: any) => c.city === selectedCity)
    : null

  const defaultCalendar = seed.regionCalendars[0] ?? null

  const calendarToShow = cityCalendar ?? defaultCalendar

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="text-sm text-text-secondary flex items-center gap-2">
          <a href="/" className="hover:text-primary-600">Ana Sayfa</a>
          <span>/</span>
          <a href="/tohum" className="hover:text-primary-600">Tohumlar</a>
          <span>/</span>
          <span className="text-text-primary font-medium">{seed.name}</span>
        </nav>
      </div>

      {/* Hero bölümü */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Görseller */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-primary-50 mb-4 shadow-filiz">
              {seed.images[activeImage] ? (
                <Image
                  src={seed.images[activeImage]}
                  alt={seed.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sprout className="w-24 h-24 text-primary-200" />
                </div>
              )}
            </div>
            {seed.images.length > 1 && (
              <div className="flex gap-3">
                {seed.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      'relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all',
                      activeImage === i ? 'border-primary-500' : 'border-transparent'
                    )}
                  >
                    <Image src={img} alt={`${seed.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Bilgiler */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className={cn('text-xs font-semibold px-3 py-1 rounded-full', diff.color)}>
                {diff.label}
              </span>
              {seed.featured && (
                <span className="bg-accent-gold text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" fill="white" />
                  Öne Çıkan
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl font-bold text-text-primary mb-1">{seed.name}</h1>
            {seed.scientificName && (
              <p className="text-text-secondary italic text-lg mb-4">{seed.scientificName}</p>
            )}

            <p className="text-text-secondary leading-relaxed mb-6">{seed.description}</p>

            {/* Özellikler */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-primary-50 rounded-2xl p-4 flex items-center gap-3">
                <Droplets className="w-5 h-5 text-sky-500" />
                <div>
                  <p className="text-xs text-text-secondary">Su İhtiyacı</p>
                  <p className="font-semibold text-text-primary text-sm">{WATER_MAP[seed.waterNeeds as keyof typeof WATER_MAP]}</p>
                </div>
              </div>
              <div className="bg-primary-50 rounded-2xl p-4 flex items-center gap-3">
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-text-secondary">Işık İhtiyacı</p>
                  <p className="font-semibold text-text-primary text-sm">{SUN_MAP[seed.sunlight as keyof typeof SUN_MAP]}</p>
                </div>
              </div>
              {seed.soilType && (
                <div className="bg-earth-100 rounded-2xl p-4 flex items-center gap-3 col-span-2">
                  <Sprout className="w-5 h-5 text-earth-400" />
                  <div>
                    <p className="text-xs text-text-secondary">Toprak Tipi</p>
                    <p className="font-semibold text-text-primary text-sm">{seed.soilType}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Fiyat & Satın Al */}
            <div className="bg-white border border-primary-100 rounded-2xl p-6 shadow-filiz">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-primary-600">{seed.price.toFixed(2)} ₺</span>
                <span className="text-sm text-text-secondary">/ paket</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn('w-2.5 h-2.5 rounded-full', seed.stock > 0 ? 'bg-primary-500' : 'bg-red-400')} />
                <span className="text-sm text-text-secondary">
                  {seed.stock > 0 ? `${seed.stock} adet stokta` : 'Stok tükendi'}
                </span>
              </div>
              <Button
                size="lg"
                className="w-full bg-primary-500 hover:bg-primary-600 rounded-xl text-base font-semibold"
                disabled={seed.stock === 0}
                onClick={() => addItem({ id: seed.id, type: 'seed', slug: seed.slug, name: seed.name, price: seed.price, image: seed.images[0] ?? '' })}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Sepete Ekle
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Büyüme Zaman Çizelgesi */}
      {seed.stages.length > 0 && (
        <section className="bg-primary-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider block mb-2">
                Büyüme Yolculuğu
              </span>
              <h2 className="font-display text-3xl font-bold text-text-primary">Tohumdan Hasada</h2>
            </div>
            <GrowthTimeline stages={seed.stages} />
          </div>
        </section>
      )}

      {/* Bölgesel Ekim Takvimi */}
      {seed.regionCalendars.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider block mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Bölgesel Takvim
                </span>
                <h2 className="font-display text-3xl font-bold text-text-primary">Ne Zaman Ekeceğim?</h2>
              </div>
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
          </div>
        </section>
      )}

      {/* Aylık Görevler */}
      {seed.monthlyTasks.length > 0 && (
        <section className="bg-earth-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider block mb-2">Aylık Plan</span>
              <h2 className="font-display text-3xl font-bold text-text-primary">Ne Yapmalıyım?</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                const tasks = seed.monthlyTasks.filter((t: any) => t.month === month)
                return (
                  <div key={month} className={cn(
                    'rounded-2xl p-4 bg-white',
                    tasks.length > 0 ? 'shadow-filiz border border-primary-100' : 'opacity-40'
                  )}>
                    <p className="text-xs font-bold text-primary-500 mb-2">{MONTHS_TR[month - 1]}</p>
                    {tasks.length === 0 ? (
                      <p className="text-xs text-text-secondary">Görev yok</p>
                    ) : (
                      <ul className="space-y-1">
                        {tasks.map((t: any) => (
                          <li key={t.id} className="text-xs text-text-primary flex items-start gap-1">
                            <span className="text-primary-400 mt-0.5">•</span>
                            {t.task}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* SSS */}
      {seed.faqs.length > 0 && (
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-bold text-text-primary">Sık Sorulan Sorular</h2>
            </div>
            <div className="space-y-3">
              {seed.faqs.map((faq: any) => (
                <div key={faq.id} className="bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    className="w-full flex items-center justify-between p-5 text-left"
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  >
                    <span className="font-semibold text-text-primary pr-4">{faq.question}</span>
                    {openFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-primary-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-secondary shrink-0" />
                    )}
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-5 pb-5 text-text-secondary text-sm leading-relaxed border-t border-primary-50 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

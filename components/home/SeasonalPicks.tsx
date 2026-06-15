'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocationStore } from '@/store/locationStore'

const MONTH_NAMES = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']

interface Seed {
  id: string
  slug: string
  name: string
  images: string[]
  price: number
}

export function SeasonalPicks() {
  const city = useLocationStore((s) => s.city)
  const [seeds, setSeeds] = useState<Seed[]>([])
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const m = new Date().getMonth() + 1
    setMonth(m)
    setLoading(true)

    const url = city
      ? `/api/seasonal?month=${m}&city=${encodeURIComponent(city)}`
      : `/api/seasonal?month=${m}`

    fetch(url)
      .then((r) => r.json())
      .then((data) => setSeeds(data.seeds ?? []))
      .catch(() => setSeeds([]))
      .finally(() => setLoading(false))
  }, [city])

  const monthName = MONTH_NAMES[month - 1]

  if (!loading && seeds.length === 0) return null

  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-primary-200" />
            </div>
            <div>
              <p className="text-primary-300 text-sm font-medium flex items-center gap-1.5">
                {city && <><MapPin className="w-3.5 h-3.5" />{city} · </>}
                {monthName} için
              </p>
              <h2 className="font-display text-2xl font-bold">Mevsimlik Ekimler</h2>
            </div>
          </div>
          <Link href="/tohum" className="text-primary-200 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors">
            Tümü <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-primary-500/30 rounded-2xl p-4 h-[82px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {seeds.map((seed) => (
              <Link
                key={seed.id}
                href={`/tohum/${seed.slug}`}
                className="group bg-primary-500/50 hover:bg-primary-500 rounded-2xl p-4 flex items-center gap-3 transition-all border border-primary-500 hover:border-primary-400"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-primary-400">
                  {seed.images[0] && (
                    <Image src={seed.images[0]} alt={seed.name} width={56} height={56} className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm group-hover:text-primary-100 transition-colors">{seed.name}</p>
                  <p className="text-primary-300 text-sm font-bold mt-0.5">{seed.price.toFixed(2)} ₺</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

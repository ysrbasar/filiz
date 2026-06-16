'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const SETS = [
  {
    title: 'Balkon Bahçe Seti',
    description: '3 saksı + toprak + gübre + 5 çeşit tohum. Balkonda tarıma ilk adım.',
    price: '299,90 ₺',
    originalPrice: '399,90 ₺',
    emoji: '🪴',
    bg: 'from-primary-100 to-primary-50',
    href: '/magaza/balkon-bahce-seti',
  },
  {
    title: 'Mutfak Bahçesi Seti',
    description: 'Domates, biber, fesleğen, nane, maydanoz. Taze malzeme sofrada.',
    price: '189,90 ₺',
    originalPrice: '249,90 ₺',
    emoji: '🍅',
    bg: 'from-earth-200 to-earth-100',
    href: '/magaza/mutfak-bahcesi-seti',
  },
  {
    title: 'Çocuk Bahçe Seti',
    description: 'Eğlenceli şekilli saksılar ve hızlı büyüyen tohumlar. Küçükler için.',
    price: '149,90 ₺',
    originalPrice: '199,90 ₺',
    emoji: '🌻',
    bg: 'from-yellow-100 to-yellow-50',
    href: '/magaza/cocuk-bahce-seti',
  },
]

export function HobbySetsBanner() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider block mb-2">
            Hobi Setleri
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
            Her İhtiyaca Hazır Set
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {SETS.map((set) => (
            <Link
              key={set.title}
              href={set.href}
              className={`group block bg-gradient-to-br ${set.bg} rounded-3xl p-7 border border-primary-100 hover:shadow-filiz-hover transition-all hover:-translate-y-1`}
            >
              <div className="text-5xl mb-5">{set.emoji}</div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-2">{set.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-5">{set.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-primary-600">{set.price}</span>
                  <span className="text-sm text-text-secondary line-through ml-2">{set.originalPrice}</span>
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:gap-2 transition-all">
                  İncele <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

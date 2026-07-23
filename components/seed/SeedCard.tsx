'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Droplets, Sun, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface SeedCardProps {
  id: string
  slug: string
  name: string
  scientificName?: string | null
  price: number
  image: string
  category: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  waterNeeds: 'LOW' | 'MEDIUM' | 'HIGH'
  sunlight: 'FULL_SUN' | 'PARTIAL_SHADE' | 'FULL_SHADE'
  featured?: boolean
}

const DIFFICULTY_LABELS: Record<string, { label: string; className: string }> = {
  BEGINNER:     { label: 'Başlangıç',   className: 'bg-primary-100 text-primary-600' },
  INTERMEDIATE: { label: 'Orta',        className: 'bg-earth-200 text-earth-400' },
  ADVANCED:     { label: 'İleri',       className: 'bg-red-100 text-red-600' },
}

const WATER_ICONS = { LOW: '💧', MEDIUM: '💧💧', HIGH: '💧💧💧' }
const SUN_ICONS   = { FULL_SUN: '☀️', PARTIAL_SHADE: '⛅', FULL_SHADE: '🌥️' }

export function SeedCard({ id, slug, name, scientificName, price, image, difficulty, waterNeeds, sunlight, featured }: SeedCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const diff = DIFFICULTY_LABELS[difficulty]

  return (
    <article
      className="group bg-white rounded-3xl overflow-hidden shadow-filiz hover:shadow-filiz-hover transition-all border border-primary-100"
    >
      {/* Görsel */}
      <Link href={`/tohum/${slug}`} className="block">
        <div className="relative h-52 bg-primary-50 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {featured && (
            <div className="absolute top-3 left-3">
              <span className="bg-accent-gold text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" fill="white" />
                Öne Çıkan
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', diff.className)}>
              {diff.label}
            </span>
          </div>
        </div>
      </Link>

      {/* İçerik */}
      <div className="p-5">
        <Link href={`/tohum/${slug}`}>
          <h3 className="font-display font-bold text-text-primary text-lg mb-0.5 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>
          {scientificName && (
            <p className="text-xs text-text-secondary italic mb-3">{scientificName}</p>
          )}
        </Link>

        {/* İkonlar */}
        <div className="flex items-center gap-3 mb-4 text-sm text-text-secondary">
          <span title="Su ihtiyacı">{WATER_ICONS[waterNeeds]}</span>
          <span title="Işık ihtiyacı">{SUN_ICONS[sunlight]}</span>
        </div>

        {/* Alt kısım */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary-600">{price.toFixed(2)} ₺</span>
            <span className="text-xs text-text-secondary ml-1">/ paket</span>
          </div>
          <Button
            size="sm"
            onClick={() => addItem({ id, type: 'seed', slug, name, price, image })}
            className="bg-primary-400 hover:bg-primary-500 rounded-xl touch-target"
            aria-label={`${name} sepete ekle`}
          >
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            Ekle
          </Button>
        </div>
      </div>
    </article>
  )
}

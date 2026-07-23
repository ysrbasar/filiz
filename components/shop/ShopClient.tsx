'use client'

import { useState, useMemo } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { SeedCard } from '@/components/seed/SeedCard'
import { ProductCard } from '@/components/shop/ProductCard'
import { cn } from '@/lib/utils/cn'

type Tab = 'all' | 'seeds' | 'products'
type SortKey = 'featured' | 'price_asc' | 'price_desc' | 'newest'
type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Öne Çıkanlar' },
  { value: 'newest', label: 'En Yeni' },
  { value: 'price_asc', label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'price_desc', label: 'Fiyat: Yüksekten Düşüğe' },
]

interface Props {
  products: any[]
  seeds: any[]
}

export function ShopClient({ products, seeds }: Props) {
  const [tab, setTab] = useState<Tab>('all')
  const [sort, setSort] = useState<SortKey>('featured')
  const [difficulties, setDifficulties] = useState<Difficulty[]>([])
  const [maxPrice, setMaxPrice] = useState<number>(1000)
  const [showFilters, setShowFilters] = useState(false)

  const allItems = useMemo(() => {
    const s = seeds.map((s) => ({ ...s, _type: 'seed' as const }))
    const p = products.map((p) => ({ ...p, _type: 'product' as const }))
    return [...s, ...p]
  }, [seeds, products])

  const filtered = useMemo(() => {
    let items = tab === 'seeds'
      ? allItems.filter((i) => i._type === 'seed')
      : tab === 'products'
      ? allItems.filter((i) => i._type === 'product')
      : allItems

    if (difficulties.length > 0) {
      items = items.filter((i) => i._type === 'seed' && difficulties.includes(i.difficulty))
    }

    items = items.filter((i) => i.price <= maxPrice)

    if (sort === 'price_asc') items = [...items].sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc') items = [...items].sort((a, b) => b.price - a.price)
    else if (sort === 'newest') items = [...items].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())

    return items
  }, [allItems, tab, sort, difficulties, maxPrice])

  function toggleDifficulty(d: Difficulty) {
    setDifficulties((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d])
  }

  const DIFF_LABELS: Record<Difficulty, string> = {
    BEGINNER: 'Başlangıç',
    INTERMEDIATE: 'Orta',
    ADVANCED: 'İleri',
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Başlık */}
      <div className="bg-primary-50 py-12 border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider block mb-2">
            Filiz Mağaza
          </span>
          <h1 className="font-display text-4xl font-bold text-text-primary mb-4">
            Doğal Tarımın Her Şeyi
          </h1>

          {/* Tab'lar */}
          <div className="flex gap-2 flex-wrap">
            {([['all', 'Tümü'], ['seeds', 'Tohumlar'], ['products', 'Ürünler']] as [Tab, string][]).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={cn(
                  'px-5 py-2 rounded-xl text-sm font-medium transition-all',
                  tab === value
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-text-secondary hover:bg-primary-100'
                )}
              >
                {label}
                <span className="ml-2 text-xs opacity-70">
                  ({value === 'all' ? allItems.length : value === 'seeds' ? seeds.length : products.length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-text-secondary">
            <strong className="text-text-primary">{filtered.length}</strong> ürün
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                showFilters ? 'bg-primary-500 text-white border-primary-500' : 'bg-white border-primary-200 hover:border-primary-400'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtrele
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="px-4 py-2 rounded-xl border border-primary-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Filtreler */}
        {showFilters && (
          <div
            className="bg-white border border-primary-100 rounded-2xl p-6 mb-6 grid sm:grid-cols-2 gap-6"
          >
            {(tab === 'all' || tab === 'seeds') && (
              <div>
                <p className="text-sm font-semibold text-text-primary mb-3">Zorluk Seviyesi</p>
                <div className="flex gap-2 flex-wrap">
                  {(Object.keys(DIFF_LABELS) as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleDifficulty(d)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                        difficulties.includes(d)
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'border-primary-200 text-text-secondary hover:border-primary-400'
                      )}
                    >
                      {DIFF_LABELS[d]}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-text-primary mb-3">
                Maksimum Fiyat: <strong className="text-primary-600">{maxPrice} ₺</strong>
              </p>
              <input
                type="range"
                min={10}
                max={1000}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary-500"
              />
            </div>
          </div>
        )}

        {/* Ürün grid'i */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary">Filtreye uyan ürün bulunamadı.</p>
            <button onClick={() => { setDifficulties([]); setMaxPrice(1000) }} className="mt-3 text-primary-600 text-sm underline">
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, i) =>
              item._type === 'seed' ? (
                <SeedCard
                  key={item.id}
                  id={item.id}
                  slug={item.slug}
                  name={item.name}
                  scientificName={item.scientificName}
                  price={item.price}
                  image={item.images?.[0] ?? ''}
                  category={item.category}
                  difficulty={item.difficulty}
                  waterNeeds={item.waterNeeds}
                  sunlight={item.sunlight}
                  featured={item.featured}
                />
              ) : (
                <ProductCard key={item.id} product={item} index={i} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}

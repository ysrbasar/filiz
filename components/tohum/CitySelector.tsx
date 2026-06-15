'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, ChevronDown, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Calendar {
  id: string
  city: string
  climateGroup: string
}

interface Props {
  calendars: Calendar[]
  selectedCity: string | null
  onChange: (city: string | null) => void
}

export function CitySelector({ calendars, selectedCity, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const cities = Array.from(new Set(calendars.map((c) => c.city))).sort()
  const filtered = cities.filter((c) => c.toLowerCase().includes(search.toLowerCase()))

  const groups: Record<string, string[]> = {}
  filtered.forEach((city) => {
    const group = calendars.find((c) => c.city === city)?.climateGroup ?? 'Diğer'
    if (!groups[group]) groups[group] = []
    groups[group].push(city)
  })

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
          selectedCity
            ? 'bg-primary-500 text-white border-primary-500'
            : 'bg-white text-text-primary border-primary-200 hover:border-primary-400'
        )}
      >
        <MapPin className="w-4 h-4" />
        {selectedCity ?? 'Şehir Seç'}
        {selectedCity ? (
          <X
            className="w-3.5 h-3.5 ml-1"
            onClick={(e) => { e.stopPropagation(); onChange(null); setOpen(false) }}
          />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-primary-100 rounded-2xl shadow-filiz-hover z-50 overflow-hidden">
          {/* Arama */}
          <div className="p-3 border-b border-primary-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Şehir ara..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-primary-50 rounded-lg outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          {/* Liste */}
          <div className="max-h-64 overflow-y-auto p-2">
            {Object.entries(groups).map(([group, citiesInGroup]) => (
              <div key={group} className="mb-2">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wide px-3 py-1.5">{group}</p>
                {citiesInGroup.map((city) => (
                  <button
                    key={city}
                    onClick={() => { onChange(city); setOpen(false); setSearch('') }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors',
                      selectedCity === city
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'hover:bg-primary-50 text-text-primary'
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-text-secondary py-4">Sonuç bulunamadı</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

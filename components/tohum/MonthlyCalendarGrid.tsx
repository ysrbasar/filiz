'use client'

import { cn } from '@/lib/utils/cn'

const MONTHS = [
  { short: 'Oca', full: 'Ocak' },
  { short: 'Şub', full: 'Şubat' },
  { short: 'Mar', full: 'Mart' },
  { short: 'Nis', full: 'Nisan' },
  { short: 'May', full: 'Mayıs' },
  { short: 'Haz', full: 'Haziran' },
  { short: 'Tem', full: 'Temmuz' },
  { short: 'Ağu', full: 'Ağustos' },
  { short: 'Eyl', full: 'Eylül' },
  { short: 'Eki', full: 'Ekim' },
  { short: 'Kas', full: 'Kasım' },
  { short: 'Ara', full: 'Aralık' },
]

const CURRENT_MONTH = new Date().getMonth() + 1

interface Props {
  plantingMonths: number[]
  harvestMonths: number[]
  city: string
  notes?: string | null
}

export function MonthlyCalendarGrid({ plantingMonths, harvestMonths, city, notes }: Props) {
  return (
    <div>
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mb-6">
        {MONTHS.map((m, i) => {
          const month = i + 1
          const isPlanting = plantingMonths.includes(month)
          const isHarvest = harvestMonths.includes(month)
          const isCurrent = month === CURRENT_MONTH
          const isBoth = isPlanting && isHarvest

          return (
            <div
              key={month}
              title={`${m.full}${isPlanting ? ' · Ekim' : ''}${isHarvest ? ' · Hasat' : ''}`}
              className={cn(
                'relative rounded-xl p-3 text-center border-2 transition-all cursor-default',
                isBoth
                  ? 'bg-gradient-to-b from-primary-200 to-amber-100 border-primary-400'
                  : isPlanting
                  ? 'bg-primary-100 border-primary-400'
                  : isHarvest
                  ? 'bg-amber-50 border-amber-400'
                  : 'bg-white border-gray-100 opacity-40'
              )}
            >
              {isCurrent && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary-500 border-2 border-white" />
              )}
              <p className={cn(
                'text-xs font-bold mb-1',
                isPlanting || isHarvest ? 'text-text-primary' : 'text-text-secondary'
              )}>
                {m.short}
              </p>
              <div className="flex flex-col items-center gap-0.5">
                {isPlanting && <span className="text-xs leading-none">🌱</span>}
                {isHarvest && <span className="text-xs leading-none">🌾</span>}
                {!isPlanting && !isHarvest && <span className="text-xs text-gray-300 leading-none">—</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Açıklama */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-primary-200 border border-primary-400" />
          <span>Ekim Zamanı</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-amber-100 border border-amber-400" />
          <span>Hasat Zamanı</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary-500 inline-block" />
          <span>Bu Ay</span>
        </div>
        {city && (
          <div className="ml-auto text-xs bg-primary-50 text-primary-600 px-3 py-1 rounded-full font-medium">
            📍 {city}
          </div>
        )}
      </div>

      {notes && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>Not:</strong> {notes}
        </div>
      )}
    </div>
  )
}

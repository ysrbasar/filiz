'use client'

import { useEffect, useState } from 'react'
import { Thermometer, Droplets, Wind, ChevronDown, CloudRain, Sun, Cloud, CloudSnow, Zap, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface WeatherData {
  city: { name: string; climateGroup: string; suitablePlants: string[]; plantingPeriod: string }
  weather: {
    current: {
      temperature_2m: number
      relative_humidity_2m: number
      apparent_temperature: number
      weather_code: number
      wind_speed_10m: number
      precipitation: number
    }
    daily: {
      time: string[]
      temperature_2m_max: number[]
      temperature_2m_min: number[]
      weather_code: number[]
      precipitation_sum: number[]
      relative_humidity_2m_max: number[]
    }
  }
}

const DAYS_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

function weatherIcon(code: number, size = 'w-5 h-5') {
  if (code === 0) return <Sun className={cn(size, 'text-amber-400')} />
  if (code <= 3) return <Cloud className={cn(size, 'text-gray-400')} />
  if (code <= 67) return <CloudRain className={cn(size, 'text-sky-400')} />
  if (code <= 77) return <CloudSnow className={cn(size, 'text-blue-300')} />
  return <Zap className={cn(size, 'text-yellow-500')} />
}

function weatherLabel(code: number) {
  if (code === 0) return 'Açık'
  if (code <= 3) return 'Parçalı Bulutlu'
  if (code <= 51) return 'Sisli / Çiseleme'
  if (code <= 67) return 'Yağmurlu'
  if (code <= 77) return 'Karlı'
  return 'Fırtınalı'
}

export function WeatherWidget({ city }: { city: string }) {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!city) return
    setLoading(true)
    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [city])

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2 animate-pulse">
        <div className="w-4 h-4 rounded-full bg-white/30" />
        <div className="w-16 h-3 rounded bg-white/30" />
      </div>
    )
  }

  if (!data?.weather) return null

  const { current, daily } = data.weather
  const temp = Math.round(current.temperature_2m)
  const humidity = current.relative_humidity_2m
  const feelsLike = Math.round(current.apparent_temperature)

  return (
    <div className="relative">
      {/* Compact bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-2xl px-4 py-2 transition-all text-white text-sm"
      >
        {weatherIcon(current.weather_code, 'w-4 h-4')}
        <span className="font-bold">{temp}°C</span>
        <span className="text-white/70 hidden sm:inline">{humidity}% nem</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-white/60 transition-transform', expanded && 'rotate-180')} />
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-filiz-hover border border-primary-100 overflow-hidden z-50">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-primary-100 mb-0.5">{city} • Şu an</p>
                <div className="flex items-center gap-2">
                  {weatherIcon(current.weather_code, 'w-8 h-8')}
                  <span className="text-4xl font-bold">{temp}°</span>
                </div>
                <p className="text-sm text-primary-100 mt-1">{weatherLabel(current.weather_code)} · Hissedilen {feelsLike}°</p>
              </div>
              <button onClick={() => setExpanded(false)} className="text-white/60 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5" /> {humidity}%</span>
              <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5" /> {Math.round(current.wind_speed_10m)} km/s</span>
              <span className="flex items-center gap-1"><CloudRain className="w-3.5 h-3.5" /> {current.precipitation} mm</span>
            </div>
          </div>

          {/* 7-day forecast */}
          <div className="p-3">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 px-1">7 Günlük Tahmin</p>
            <div className="space-y-1">
              {daily.time.map((dateStr, i) => {
                const date = new Date(dateStr)
                const dayLabel = i === 0 ? 'Bugün' : DAYS_TR[date.getDay()]
                return (
                  <div key={dateStr} className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-primary-50 transition-colors">
                    <span className="text-sm text-text-secondary w-12">{dayLabel}</span>
                    <div className="flex items-center gap-1">
                      {weatherIcon(daily.weather_code[i], 'w-4 h-4')}
                    </div>
                    <span className="text-xs text-sky-500 flex items-center gap-0.5">
                      <Droplets className="w-3 h-3" />{daily.relative_humidity_2m_max[i]}%
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-text-secondary">{Math.round(daily.temperature_2m_min[i])}°</span>
                      <span className="text-text-secondary">/</span>
                      <span className="font-semibold text-text-primary">{Math.round(daily.temperature_2m_max[i])}°</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* İklim tavsiyesi */}
          {data.city && (
            <div className="px-4 pb-4">
              <div className="bg-primary-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-primary-600 mb-1">Bu Dönem Ekilebilir</p>
                <p className="text-xs text-text-secondary">{data.city.suitablePlants.join(', ')}</p>
                <p className="text-xs text-primary-500 mt-1 font-medium">Ekim Dönemi: {data.city.plantingPeriod}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

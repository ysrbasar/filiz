'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Sprout, Leaf, Sun, Scissors, Flower2, Apple,
  ChevronDown, CheckCircle2, Lightbulb, AlertTriangle, Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const STAGE_ICONS: Record<string, React.ElementType> = {
  SEED:        Sprout,
  SPROUT:      Sprout,
  SEEDLING:    Leaf,
  YOUNG_PLANT: Leaf,
  FLOWERING:   Flower2,
  FRUITING:    Apple,
  HARVEST:     Scissors,
}

const STAGE_COLORS: Record<string, { bg: string; ring: string; text: string; line: string }> = {
  SEED:        { bg: 'bg-amber-100',   ring: 'ring-amber-300',   text: 'text-amber-700',   line: 'from-amber-300' },
  SPROUT:      { bg: 'bg-primary-100', ring: 'ring-primary-300', text: 'text-primary-700', line: 'from-primary-300' },
  SEEDLING:    { bg: 'bg-primary-100', ring: 'ring-primary-400', text: 'text-primary-700', line: 'from-primary-400' },
  YOUNG_PLANT: { bg: 'bg-emerald-100', ring: 'ring-emerald-400', text: 'text-emerald-700', line: 'from-emerald-400' },
  FLOWERING:   { bg: 'bg-pink-100',    ring: 'ring-pink-300',    text: 'text-pink-700',    line: 'from-pink-300' },
  FRUITING:    { bg: 'bg-orange-100',  ring: 'ring-orange-300',  text: 'text-orange-700',  line: 'from-orange-300' },
  HARVEST:     { bg: 'bg-earth-100',   ring: 'ring-earth-400',   text: 'text-earth-500',   line: 'from-earth-400' },
}

const fallbackColor = { bg: 'bg-primary-100', ring: 'ring-primary-300', text: 'text-primary-700', line: 'from-primary-300' }

interface Stage {
  id: string
  order: number
  title: string
  slug: string
  description: string
  durationDays: number
  tips: string[]
  warnings: string[]
  tasks: string[]
  animationType: string
}

interface Props {
  stages: Stage[]
  activeStageOrder?: number
}

function useIntersecting(ref: React.RefObject<HTMLDivElement | null>) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { rootMargin: '-60px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return inView
}

function StageCard({ stage, index, total, isOpen, onToggle, dayStart }: {
  stage: Stage
  index: number
  total: number
  isOpen: boolean
  onToggle: () => void
  dayStart: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useIntersecting(ref)
  const color = STAGE_COLORS[stage.animationType] ?? fallbackColor
  const Icon = STAGE_ICONS[stage.animationType] ?? Leaf
  const isLast = index === total - 1

  return (
    <div ref={ref} className="relative flex gap-4">
      {/* Dikey zaman çizgisi */}
      <div className="flex flex-col items-center shrink-0 w-10">
        <div
          className={cn(
            'w-10 h-10 rounded-2xl flex items-center justify-center ring-2 shrink-0 z-10 cursor-pointer transition-all duration-300',
            color.bg, color.ring,
            isOpen && 'scale-110 shadow-md',
            inView ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          )}
          style={{ transition: `transform 0.3s ${index * 0.07}s, opacity 0.3s ${index * 0.07}s` }}
          onClick={onToggle}
        >
          <Icon className={cn('w-5 h-5', color.text)} />
        </div>
        {!isLast && (
          <div
            className={cn('w-0.5 flex-1 min-h-[24px] bg-gradient-to-b to-transparent mt-1', color.line)}
            style={{
              transform: inView ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: 'top',
              transition: `transform 0.4s ${index * 0.07 + 0.15}s`,
            }}
          />
        )}
      </div>

      {/* Kart */}
      <div
        className={cn(
          'flex-1 mb-4 rounded-2xl border overflow-hidden transition-all duration-200',
          isOpen ? 'border-primary-300 shadow-filiz' : 'border-gray-100 bg-white hover:border-primary-200 hover:shadow-sm',
          inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
        )}
        style={{ transition: `opacity 0.4s ${index * 0.07 + 0.05}s, transform 0.4s ${index * 0.07 + 0.05}s` }}
      >
        {/* Başlık satırı */}
        <button
          className="w-full flex items-center gap-3 p-4 text-left"
          onClick={onToggle}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className={cn('text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full', color.bg, color.text)}>
                {index + 1}. Aşama
              </span>
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <Clock className="w-3 h-3" /> Gün {dayStart + 1}–{dayStart + stage.durationDays}
              </span>
            </div>
            <h3 className="font-display font-bold text-text-primary text-base leading-tight">{stage.title}</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold bg-gray-50 text-text-secondary border border-gray-100 px-3 py-1 rounded-full hidden sm:block">
              {stage.durationDays} gün
            </span>
            <ChevronDown className={cn('w-4 h-4 text-text-secondary transition-transform duration-200', isOpen && 'rotate-180')} />
          </div>
        </button>

        {/* Genişletilmiş içerik */}
        {isOpen && (
          <div className="overflow-hidden">
            <div className="px-4 pb-5 pt-3 border-t border-gray-50">
              <p className="text-sm text-text-secondary leading-relaxed mb-5">{stage.description}</p>

              <div className="grid sm:grid-cols-3 gap-4">
                {stage.tasks.length > 0 && (
                  <div className="bg-primary-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-primary-600 mb-2.5 uppercase tracking-widest flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Görevler
                    </p>
                    <ul className="space-y-1.5">
                      {stage.tasks.map((t, i) => (
                        <li key={i} className="text-xs text-text-primary flex items-start gap-1.5">
                          <span className="text-primary-400 mt-0.5 shrink-0">•</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {stage.tips.length > 0 && (
                  <div className="bg-amber-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-amber-600 mb-2.5 uppercase tracking-widest flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" /> İpuçları
                    </p>
                    <ul className="space-y-1.5">
                      {stage.tips.map((t, i) => (
                        <li key={i} className="text-xs text-text-primary flex items-start gap-1.5">
                          <span className="text-amber-400 mt-0.5 shrink-0">•</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {stage.warnings.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-red-500 mb-2.5 uppercase tracking-widest flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Dikkat
                    </p>
                    <ul className="space-y-1.5">
                      {stage.warnings.map((w, i) => (
                        <li key={i} className="text-xs text-text-primary flex items-start gap-1.5">
                          <span className="text-red-400 mt-0.5 shrink-0">•</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function GrowthTimeline({ stages, activeStageOrder }: Props) {
  const [expanded, setExpanded] = useState<string | null>(stages[0]?.id ?? null)
  const total = stages.reduce((s, st) => s + st.durationDays, 0)

  function toggle(id: string) {
    setExpanded(prev => prev === id ? null : id)
  }

  return (
    <div>
      {/* İlerleme çubuğu */}
      <div className="mb-8">
        <div className="flex gap-1 h-2.5 rounded-full overflow-hidden mb-2">
          {stages.map((stage, i) => {
            const color = STAGE_COLORS[stage.animationType] ?? fallbackColor
            const isPast = activeStageOrder !== undefined && i < activeStageOrder
            const isCurrent = activeStageOrder !== undefined && i === activeStageOrder
            return (
              <button
                key={stage.id}
                style={{ flex: stage.durationDays }}
                onClick={() => toggle(stage.id)}
                title={stage.title}
                className={cn(
                  'transition-all',
                  isPast ? 'opacity-100' : isCurrent ? 'opacity-100 animate-pulse' : 'opacity-40',
                  color.bg.replace('-100', '-300'),
                  expanded === stage.id && 'opacity-100'
                )}
              />
            )
          })}
        </div>
        <div className="flex justify-between text-[10px] text-text-secondary font-medium">
          <span>Gün 1</span>
          <span className="text-primary-600 font-bold">{total} gün toplam</span>
        </div>
      </div>

      {/* Aşamalar */}
      <div>
        {stages.map((stage, index) => {
          const dayStart = stages.slice(0, index).reduce((s, st) => s + st.durationDays, 0)
          return (
            <StageCard
              key={stage.id}
              stage={stage}
              index={index}
              total={stages.length}
              isOpen={expanded === stage.id}
              onToggle={() => toggle(stage.id)}
              dayStart={dayStart}
            />
          )
        })}
      </div>
    </div>
  )
}

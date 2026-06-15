'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sprout, Leaf, Sun, Scissors, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const STAGE_ICONS: Record<string, React.ReactNode> = {
  germination: <Sprout className="w-5 h-5" />,
  seedling: <Leaf className="w-5 h-5" />,
  vegetative: <Sun className="w-5 h-5" />,
  flowering: <Sun className="w-5 h-5" />,
  fruiting: <Sun className="w-5 h-5" />,
  harvest: <Scissors className="w-5 h-5" />,
}

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
}

export function GrowthTimeline({ stages }: Props) {
  const [expanded, setExpanded] = useState<string | null>(stages[0]?.id ?? null)

  const total = stages.reduce((s, st) => s + st.durationDays, 0)

  return (
    <div className="relative">
      {/* Üst çubuk — ilerleme */}
      <div className="flex gap-1 mb-8 rounded-full overflow-hidden h-3">
        {stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setExpanded(expanded === stage.id ? null : stage.id)}
            title={stage.title}
            className="bg-primary-300 hover:bg-primary-500 transition-colors"
            style={{ flex: stage.durationDays }}
          />
        ))}
      </div>

      {/* Aşama kartları */}
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const isOpen = expanded === stage.id
          const icon = STAGE_ICONS[stage.slug] ?? STAGE_ICONS.seedling
          const progress = stages.slice(0, index).reduce((s, st) => s + st.durationDays, 0)

          return (
            <motion.div
              key={stage.id}
              layout
              className={cn(
                'bg-white rounded-2xl border overflow-hidden transition-all',
                isOpen ? 'border-primary-300 shadow-filiz' : 'border-primary-100'
              )}
            >
              <button
                className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => setExpanded(isOpen ? null : stage.id)}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                  isOpen ? 'bg-primary-500 text-white' : 'bg-primary-100 text-primary-600'
                )}>
                  {icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary-400">{index + 1}. AŞAMA</span>
                    <span className="text-xs text-text-secondary">· Gün {progress + 1}–{progress + stage.durationDays}</span>
                  </div>
                  <h3 className="font-display font-bold text-text-primary">{stage.title}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold bg-primary-50 text-primary-600 px-3 py-1 rounded-full hidden sm:block">
                    {stage.durationDays} gün
                  </span>
                  <ChevronDown className={cn('w-4 h-4 text-text-secondary transition-transform', isOpen && 'rotate-180')} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-primary-50 pt-4">
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">{stage.description}</p>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {stage.tasks.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-primary-500 mb-2 uppercase tracking-wide">Görevler</p>
                            <ul className="space-y-1.5">
                              {stage.tasks.map((t, i) => (
                                <li key={i} className="text-sm text-text-primary flex items-start gap-2">
                                  <span className="text-primary-400 mt-0.5 shrink-0">✓</span>
                                  {t}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {stage.tips.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-amber-500 mb-2 uppercase tracking-wide">İpuçları</p>
                            <ul className="space-y-1.5">
                              {stage.tips.map((t, i) => (
                                <li key={i} className="text-sm text-text-primary flex items-start gap-2">
                                  <span className="text-amber-400 mt-0.5 shrink-0">💡</span>
                                  {t}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {stage.warnings.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-red-500 mb-2 uppercase tracking-wide">Dikkat</p>
                            <ul className="space-y-1.5">
                              {stage.warnings.map((w, i) => (
                                <li key={i} className="text-sm text-text-primary flex items-start gap-2">
                                  <span className="text-red-400 mt-0.5 shrink-0">⚠</span>
                                  {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Toplam süre */}
      <div className="mt-6 text-center">
        <span className="text-sm text-text-secondary">
          Toplam büyüme süresi: <strong className="text-primary-600">{total} gün</strong>
        </span>
      </div>
    </div>
  )
}

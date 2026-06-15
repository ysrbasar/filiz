'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Sprout, Droplets, Scissors, FlaskConical,
  Camera, PenLine, CheckCircle2, Clock, ChevronDown,
  Calendar, BookOpen, Bell, Leaf
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface GrowthStage {
  id: string
  order: number
  title: string
  slug: string
  description: string
  durationDays: number
  tips: string[]
  tasks: string[]
}

interface MonthlyTask {
  id: string
  month: number
  task: string
  type: string
  priority: string
}

interface GardenLog {
  id: string
  date: Date
  type: string
  note: string | null
  photo: string | null
  weather: string | null
}

interface Notification {
  id: string
  title: string
  body: string
  type: string
  scheduledFor: Date
}

interface Plant {
  id: string
  notes: string | null
  plantedDate: Date
  location: string | null
  city: string | null
  currentStageOrder: number
  photos: string[]
  isActive: boolean
  harvestedAt: Date | null
  harvestAmount: number | null
  harvestUnit: string | null
  seed: {
    id: string
    slug: string
    name: string
    scientificName: string | null
    images: string[]
    stages: GrowthStage[]
    monthlyTasks: MonthlyTask[]
  }
  logs: GardenLog[]
  notifications: Notification[]
}

interface Props {
  plant: Plant
  userId: string
}

const TASK_TYPE_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  WATERING:    { label: 'Sulama',     icon: <Droplets className="w-4 h-4" />,     color: 'text-blue-500 bg-blue-50'   },
  FERTILIZING: { label: 'Gübreleme',  icon: <Leaf className="w-4 h-4" />,         color: 'text-green-600 bg-green-50'  },
  HARVESTING:  { label: 'Hasat',      icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-amber-600 bg-amber-50'  },
  PRUNING:     { label: 'Budama',     icon: <Scissors className="w-4 h-4" />,     color: 'text-purple-500 bg-purple-50' },
  TREATING:    { label: 'İlaçlama',   icon: <FlaskConical className="w-4 h-4" />, color: 'text-red-500 bg-red-50'      },
  CHECKING:    { label: 'Kontrol',    icon: <Camera className="w-4 h-4" />,        color: 'text-slate-500 bg-slate-50'  },
  PLANTING:    { label: 'Dikim',      icon: <Sprout className="w-4 h-4" />,        color: 'text-primary-600 bg-primary-50' },
  REPOTTING:   { label: 'Saksı Değ.', icon: <Sprout className="w-4 h-4" />,       color: 'text-orange-500 bg-orange-50' },
}

const MONTHS = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara']

export function PlantDetail({ plant, userId }: Props) {
  const [tab, setTab] = useState<'overview' | 'log' | 'tasks' | 'notifications'>('overview')
  const [logNote, setLogNote] = useState('')
  const [logType, setLogType] = useState('CHECKING')
  const [submitting, startTransition] = useTransition()
  const [logs, setLogs] = useState(plant.logs)

  const totalDays = plant.seed.stages.reduce((s, st) => s + st.durationDays, 0)
  const daysElapsed = Math.floor((Date.now() - new Date(plant.plantedDate).getTime()) / (1000 * 60 * 60 * 24))
  const progressPct = Math.min(100, Math.round((daysElapsed / totalDays) * 100))
  const currentStage = plant.seed.stages[plant.currentStageOrder] ?? plant.seed.stages[0]
  const currentMonth = new Date().getMonth() + 1

  async function submitLog() {
    if (!logNote.trim()) return
    startTransition(async () => {
      const res = await fetch('/api/garden/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantedSeedId: plant.id, type: logType, note: logNote }),
      })
      if (res.ok) {
        const { log } = await res.json()
        setLogs((prev) => [log, ...prev])
        setLogNote('')
      }
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-8">
          <Link href="/bahcem" className="inline-flex items-center gap-1.5 text-primary-200 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Bahçeme dön
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-primary-500 shrink-0 border-2 border-primary-400">
              {plant.seed.images[0] ? (
                <Image src={plant.seed.images[0]} alt={plant.seed.name} fill className="object-cover" sizes="80px" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sprout className="w-10 h-10 text-primary-300" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl font-bold truncate">{plant.notes ?? plant.seed.name}</h1>
              {plant.notes && <p className="text-primary-200 text-sm">{plant.seed.name}</p>}
              {plant.seed.scientificName && (
                <p className="text-primary-300 text-xs italic mt-0.5">{plant.seed.scientificName}</p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-primary-200">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {daysElapsed}. gün</span>
                {plant.city && <span className="flex items-center gap-1">📍 {plant.city}</span>}
                {plant.location && <span>🏡 {plant.location}</span>}
              </div>
            </div>
          </div>

          {/* İlerleme */}
          <div className="mt-4 bg-primary-700/40 rounded-xl p-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium">{currentStage?.title ?? 'Büyüyor'}</span>
              <span className="text-primary-300">%{progressPct}</span>
            </div>
            <div className="h-2 bg-primary-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between text-xs text-primary-300 mt-1">
              <span>Ekim: {new Date(plant.plantedDate).toLocaleDateString('tr-TR')}</span>
              <span>Gün {daysElapsed}/{totalDays}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-2 pb-12">

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-primary-50 rounded-xl p-1">
          {([
            ['overview', 'Genel Bakış', Sprout],
            ['log', 'Günlük', PenLine],
            ['tasks', 'Görevler', CheckCircle2],
            ['notifications', 'Hatırlatıcı', Bell],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all',
                tab === key ? 'bg-white shadow-sm text-primary-700' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Genel Bakış */}
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Büyüme Aşamaları */}
              <div className="bg-white rounded-2xl border border-primary-100 shadow-filiz p-5 mb-4">
                <h2 className="font-display font-bold text-text-primary mb-4">Büyüme Aşamaları</h2>
                <div className="space-y-3">
                  {plant.seed.stages.map((stage, i) => {
                    const isCompleted = i < plant.currentStageOrder
                    const isCurrent = i === plant.currentStageOrder
                    return (
                      <StageAccordion
                        key={stage.id}
                        stage={stage}
                        isCompleted={isCompleted}
                        isCurrent={isCurrent}
                        defaultOpen={isCurrent}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Bu Ay Yapılacaklar */}
              <div className="bg-white rounded-2xl border border-primary-100 shadow-filiz p-5">
                <h2 className="font-display font-bold text-text-primary mb-1">
                  {MONTHS[currentMonth - 1]} Ayı Görevleri
                </h2>
                <p className="text-xs text-text-secondary mb-4">{plant.city ? plant.city + ' için' : 'Genel'}</p>
                {plant.seed.monthlyTasks.filter((t) => t.month === currentMonth).length === 0 ? (
                  <p className="text-sm text-text-secondary">Bu ay için özel görev yok.</p>
                ) : (
                  <div className="space-y-2">
                    {plant.seed.monthlyTasks
                      .filter((t) => t.month === currentMonth)
                      .map((task) => {
                        const meta = TASK_TYPE_LABELS[task.type]
                        return (
                          <div key={task.id} className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
                            <span className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', meta?.color ?? 'text-primary-600 bg-primary-100')}>
                              {meta?.icon ?? <CheckCircle2 className="w-4 h-4" />}
                            </span>
                            <span className="text-sm text-text-primary">{task.task}</span>
                            {task.priority === 'HIGH' && (
                              <span className="ml-auto text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">ÖNEMLİ</span>
                            )}
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Günlük */}
          {tab === 'log' && (
            <motion.div key="log" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Yeni giriş */}
              <div className="bg-white rounded-2xl border border-primary-100 shadow-filiz p-5 mb-4">
                <h2 className="font-display font-bold text-text-primary mb-3">Yeni Kayıt</h2>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {Object.entries(TASK_TYPE_LABELS).slice(0, 6).map(([type, meta]) => (
                    <button
                      key={type}
                      onClick={() => setLogType(type)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                        logType === type ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-200 text-text-secondary hover:border-primary-200'
                      )}
                    >
                      {meta.icon}
                      {meta.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={logNote}
                  onChange={(e) => setLogNote(e.target.value)}
                  placeholder="Bugün ne gözlemlediniz? Sulama miktarı, hava durumu, notlar..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                />
                <button
                  onClick={submitLog}
                  disabled={!logNote.trim() || submitting}
                  className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>

              {/* Günlük geçmişi */}
              <div className="bg-white rounded-2xl border border-primary-100 shadow-filiz p-5">
                <h2 className="font-display font-bold text-text-primary mb-4">Geçmiş Kayıtlar</h2>
                {logs.length === 0 ? (
                  <p className="text-text-secondary text-sm">Henüz kayıt yok.</p>
                ) : (
                  <div className="space-y-3">
                    {logs.map((log) => {
                      const meta = TASK_TYPE_LABELS[log.type]
                      return (
                        <div key={log.id} className="flex gap-3">
                          <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5', meta?.color ?? 'text-primary-600 bg-primary-50')}>
                            {meta?.icon ?? <BookOpen className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-primary-600">{meta?.label ?? log.type}</span>
                              <span className="text-xs text-text-secondary">{new Date(log.date).toLocaleDateString('tr-TR')}</span>
                            </div>
                            {log.note && <p className="text-sm text-text-primary mt-0.5">{log.note}</p>}
                            {log.weather && <p className="text-xs text-text-secondary mt-0.5">🌤️ {log.weather}</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Görevler */}
          {tab === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-2xl border border-primary-100 shadow-filiz p-5">
                <h2 className="font-display font-bold text-text-primary mb-4">Aylık Görev Takvimi</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MONTHS.map((monthName, idx) => {
                    const month = idx + 1
                    const tasks = plant.seed.monthlyTasks.filter((t) => t.month === month)
                    const isCurrent = month === currentMonth
                    return (
                      <div
                        key={month}
                        className={cn(
                          'rounded-xl p-3 border',
                          isCurrent ? 'border-primary-400 bg-primary-50' : 'border-gray-100'
                        )}
                      >
                        <p className={cn('text-xs font-bold mb-2', isCurrent ? 'text-primary-600' : 'text-text-secondary')}>
                          {monthName}
                        </p>
                        {tasks.length === 0 ? (
                          <p className="text-xs text-text-secondary">—</p>
                        ) : (
                          <div className="space-y-1">
                            {tasks.slice(0, 2).map((t) => (
                              <div key={t.id} className="flex items-start gap-1 text-xs text-text-primary">
                                <span className="shrink-0 mt-0.5">{TASK_TYPE_LABELS[t.type]?.icon ?? '•'}</span>
                                <span className="line-clamp-1">{t.task}</span>
                              </div>
                            ))}
                            {tasks.length > 2 && (
                              <p className="text-[10px] text-primary-500">+{tasks.length - 2} daha</p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Hatırlatıcılar */}
          {tab === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-2xl border border-primary-100 shadow-filiz p-5">
                <h2 className="font-display font-bold text-text-primary mb-4">Bekleyen Hatırlatıcılar</h2>
                {plant.notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-10 h-10 text-primary-200 mx-auto mb-3" />
                    <p className="text-sm text-text-secondary">Bekleyen hatırlatıcı yok.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {plant.notifications.map((n) => {
                      const meta = TASK_TYPE_LABELS[n.type]
                      return (
                        <div key={n.id} className="flex items-start gap-3 p-3 bg-primary-50 rounded-xl">
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', meta?.color ?? 'text-primary-600 bg-primary-100')}>
                            {meta?.icon ?? <Bell className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">{n.title}</p>
                            <p className="text-xs text-text-secondary">{n.body}</p>
                            <p className="text-xs text-primary-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(n.scheduledFor).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function StageAccordion({
  stage,
  isCompleted,
  isCurrent,
  defaultOpen,
}: {
  stage: GrowthStage
  isCompleted: boolean
  isCurrent: boolean
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={cn(
      'rounded-xl border transition-all',
      isCurrent ? 'border-primary-300 bg-primary-50' : isCompleted ? 'border-green-200 bg-green-50/50' : 'border-gray-100'
    )}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <div className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold',
          isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-primary-500 text-white' : 'bg-gray-100 text-text-secondary'
        )}>
          {isCompleted ? '✓' : stage.order + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium', isCurrent ? 'text-primary-700' : isCompleted ? 'text-green-700' : 'text-text-secondary')}>
            {stage.title}
          </p>
          <p className="text-xs text-text-secondary">{stage.durationDays} gün</p>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-text-secondary transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              <p className="text-xs text-text-secondary">{stage.description}</p>
              {stage.tips.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-primary-600 mb-1">💡 İpuçları</p>
                  <ul className="space-y-1">
                    {stage.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-text-primary flex gap-1.5">
                        <span className="shrink-0 text-primary-400">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {stage.tasks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-amber-600 mb-1">✅ Yapılacaklar</p>
                  <ul className="space-y-1">
                    {stage.tasks.map((task, i) => (
                      <li key={i} className="text-xs text-text-primary flex gap-1.5">
                        <span className="shrink-0 text-amber-400">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

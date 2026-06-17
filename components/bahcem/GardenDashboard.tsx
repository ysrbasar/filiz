'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sprout, Plus, Bell, Calendar, BookOpen, Star, ChevronRight, Droplets } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PlantedSeed {
  id: string
  notes: string | null
  plantedDate: Date
  currentStageOrder: number
  seed: {
    id: string
    slug: string
    name: string
    images: string[]
    stages: Array<{ id: string; order: number; title: string; durationDays: number }>
  }
  logs: Array<{ id: string; note: string | null; date: Date; type: string }>
}

interface Notification {
  id: string
  title: string
  body: string
  type: string
  scheduledFor: Date
}

interface Props {
  user: { id: string; name: string; xp: number }
  plantedSeeds: PlantedSeed[]
  notifications: Notification[]
}

function xpToLevel(xp: number) {
  const level = Math.floor(xp / 100) + 1
  const progress = xp % 100
  return { level, progress }
}

const TASK_ICONS: Record<string, string> = {
  WATERING: '💧',
  FERTILIZING: '🌿',
  HARVESTING: '🌾',
  PRUNING: '✂️',
  TREATING: '🔬',
  CHECKING: '👁️',
  REPOTTING: '🪴',
  PLANTING: '🌱',
}

export function GardenDashboard({ user, plantedSeeds, notifications }: Props) {
  const [activeTab, setActiveTab] = useState<'plants' | 'calendar' | 'log'>('plants')
  const { level, progress } = xpToLevel(user.xp)

  return (
    <div className="min-h-screen bg-background">
      {/* Başlık & Profil */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-primary-200 text-sm">Hoş geldiniz,</p>
              <h1 className="font-display text-2xl font-bold">{user.name}</h1>
            </div>
            {notifications.length > 0 && (
              <button className="relative p-2.5 bg-primary-500 rounded-xl">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>
            )}
          </div>

          {/* XP çubuğu */}
          <div className="bg-primary-700/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-300" />
                Seviye {level}
              </span>
              <span className="text-xs text-primary-300">{user.xp} XP</span>
            </div>
            <div className="h-2 bg-primary-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-primary-300 mt-1">Sonraki seviyeye {100 - progress} XP</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* Tab navigasyonu */}
        <div className="flex gap-2 mb-6 bg-primary-50 rounded-xl p-1">
          {([['plants', 'Bitkilerim', Sprout], ['calendar', 'Takvim', Calendar], ['log', 'Günlük', BookOpen]] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
                activeTab === key ? 'bg-white shadow-sm text-primary-700' : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Bitkilerim */}
        {activeTab === 'plants' && (
          <div>
            {plantedSeeds.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sprout className="w-10 h-10 text-primary-400" />
                </div>
                <h2 className="font-display text-xl font-bold text-text-primary mb-2">Henüz bitkiniz yok</h2>
                <p className="text-text-secondary text-sm mb-6">İlk tohumunuzu ekleyerek başlayın</p>
                <Link
                  href="/tohum"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Tohum Seç
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {plantedSeeds.map((plant, i) => {
                  const currentStage = plant.seed.stages[plant.currentStageOrder] ?? plant.seed.stages[0]
                  const totalDays = plant.seed.stages.reduce((s, st) => s + st.durationDays, 0)
                  const daysElapsed = Math.floor((Date.now() - new Date(plant.plantedDate).getTime()) / (1000 * 60 * 60 * 24))
                  const progressPct = Math.min(100, Math.round((daysElapsed / totalDays) * 100))

                  return (
                    <div
                      key={plant.id}
                      className="bg-white rounded-2xl border border-primary-100 shadow-filiz overflow-hidden"
                    >
                      <div className="flex items-center gap-4 p-4 border-b border-primary-50">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-primary-50 shrink-0">
                          {plant.seed.images[0] ? (
                            <Image src={plant.seed.images[0]} alt={plant.seed.name} fill className="object-cover" sizes="64px" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Sprout className="w-8 h-8 text-primary-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-text-primary truncate">
                            {plant.notes ?? plant.seed.name}
                          </h3>
                          <p className="text-xs text-text-secondary">{plant.seed.name}</p>
                          <p className="text-xs text-primary-500 mt-1">
                            {daysElapsed}. gün · {currentStage?.title ?? 'Büyüyor'}
                          </p>
                        </div>
                        <Link href={`/bahcem/${plant.id}`} className="text-text-secondary hover:text-primary-600">
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2 text-xs">
                          <span className="font-medium text-primary-600">{currentStage?.title ?? 'Büyüyor'}</span>
                          <span className="text-text-secondary">Gün {daysElapsed}/{totalDays}</span>
                        </div>
                        <div className="h-1.5 bg-primary-50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-400 rounded-full transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <p className="text-xs text-text-secondary mt-1 text-right">%{progressPct} tamamlandı</p>
                      </div>
                    </div>
                  )
                })}

                <Link
                  href="/tohum"
                  className="border-2 border-dashed border-primary-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary-400 hover:bg-primary-50 transition-all group"
                >
                  <Plus className="w-10 h-10 text-primary-300 group-hover:text-primary-500 mb-2" />
                  <p className="text-sm font-medium text-text-secondary group-hover:text-primary-600">Yeni Bitki Ekle</p>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Takvim */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-2xl border border-primary-100 shadow-filiz p-6">
            <h2 className="font-display font-bold text-text-primary mb-4">Yaklaşan Görevler</h2>
            {notifications.length === 0 ? (
              <p className="text-text-secondary text-sm">Bekleyen görev yok. 🎉</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 p-3 bg-primary-50 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0 mt-0.5 text-base">
                      {TASK_ICONS[n.type] ?? <Droplets className="w-4 h-4 text-primary-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{n.title}</p>
                      <p className="text-xs text-text-secondary">{n.body}</p>
                      <p className="text-xs text-primary-500 mt-1">
                        {new Date(n.scheduledFor).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Günlük */}
        {activeTab === 'log' && (
          <div className="bg-white rounded-2xl border border-primary-100 shadow-filiz p-6">
            <h2 className="font-display font-bold text-text-primary mb-4">Son Günlük Kayıtları</h2>
            {plantedSeeds.flatMap((p) => p.logs).length === 0 ? (
              <p className="text-text-secondary text-sm">Henüz günlük kaydı yok.</p>
            ) : (
              <div className="space-y-3">
                {plantedSeeds.flatMap((p) =>
                  p.logs.map((log) => ({
                    ...log,
                    plantName: p.notes ?? p.seed.name,
                    plantImage: p.seed.images[0] ?? '',
                  }))
                ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((log) => (
                    <div key={log.id} className="flex gap-3 p-3 bg-primary-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-primary-100 shrink-0 flex items-center justify-center text-base">
                        {log.plantImage
                          ? <Image src={log.plantImage} alt={log.plantName} width={32} height={32} className="object-cover w-full h-full" />
                          : <span>{TASK_ICONS[log.type] ?? '📋'}</span>
                        }
                      </div>
                      <div>
                        <p className="text-xs font-medium text-primary-600 mb-0.5">{log.plantName}</p>
                        <p className="text-sm text-text-primary">{log.note ?? '—'}</p>
                        <p className="text-xs text-text-secondary mt-1">
                          {new Date(log.date).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

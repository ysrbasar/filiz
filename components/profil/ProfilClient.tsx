'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, ShoppingBag, Award, Activity, Settings,
  MapPin, Calendar, Sprout, Star, Package, Truck,
  CheckCircle, XCircle, Clock, ChevronRight, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const TABS = [
  { id: 'overview', label: 'Genel', icon: User },
  { id: 'orders',   label: 'Siparişler', icon: ShoppingBag },
  { id: 'badges',   label: 'Rozetler', icon: Award },
  { id: 'activity', label: 'Aktivite', icon: Activity },
] as const

type Tab = typeof TABS[number]['id']

const ORDER_STATUS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:    { label: 'Bekliyor',       color: 'bg-amber-100 text-amber-700',   icon: Clock },
  CONFIRMED:  { label: 'Onaylandı',      color: 'bg-sky-100 text-sky-700',       icon: CheckCircle },
  PROCESSING: { label: 'Hazırlanıyor',   color: 'bg-blue-100 text-blue-700',     icon: Package },
  SHIPPED:    { label: 'Kargoda',        color: 'bg-purple-100 text-purple-700', icon: Truck },
  DELIVERED:  { label: 'Teslim Edildi',  color: 'bg-primary-100 text-primary-700', icon: CheckCircle },
  CANCELLED:  { label: 'İptal',          color: 'bg-red-100 text-red-600',       icon: XCircle },
  REFUNDED:   { label: 'İade Edildi',    color: 'bg-gray-100 text-gray-600',     icon: XCircle },
}

const ACTIVITY_LABELS: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  PURCHASE:      { label: 'Satın Alma',      icon: ShoppingBag, color: 'text-sky-500' },
  PLANT:         { label: 'Bitki Eklendi',   icon: Sprout,      color: 'text-primary-500' },
  HARVEST:       { label: 'Hasat Yapıldı',   icon: Star,        color: 'text-amber-500' },
  LOG_ENTRY:     { label: 'Günlük Kaydı',    icon: Activity,    color: 'text-purple-500' },
  BADGE_EARN:    { label: 'Rozet Kazanıldı', icon: Award,       color: 'text-orange-500' },
  COMMENT:       { label: 'Yorum Yapıldı',   icon: Activity,    color: 'text-text-secondary' },
  PROJECT_SHARE: { label: 'Proje Paylaşıldı', icon: Star,       color: 'text-pink-500' },
}

function xpToLevel(xp: number) {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1
  const currentLevelXp = Math.pow(level - 1, 2) * 100
  const nextLevelXp = Math.pow(level, 2) * 100
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
  return { level, progress: Math.min(100, progress), nextLevelXp, currentXp: xp - currentLevelXp }
}

interface Props {
  user: any
  orders: any[]
  badges: any[]
  activity: any[]
}

export function ProfilClient({ user, orders, badges, activity }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const { level, progress, nextLevelXp, currentXp } = xpToLevel(user.xp)

  return (
    <div className="min-h-screen bg-background">
      {/* Profil başlığı */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-400 text-white">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/20 ring-4 ring-white/30">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.name ?? ''} width={80} height={80} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-9 h-9 text-white/70" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-accent-gold text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">
                Lv.{level}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl font-bold text-white truncate">
                {user.name ?? user.email}
              </h1>
              {user.city && (
                <p className="text-primary-200 text-sm flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" /> {user.city}
                </p>
              )}
              <p className="text-primary-200 text-xs mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(user.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })} tarihinden beri üye
              </p>

              {/* XP çubuğu */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-primary-200 mb-1">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {user.xp} XP</span>
                  <span>Seviye {level + 1} için {nextLevelXp - user.xp} XP</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-accent-gold rounded-full"
                  />
                </div>
              </div>
            </div>

            <Link
              href="/profil/ayarlar"
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors shrink-0"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>

          {/* Sayaçlar */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'Bitki',    value: user._count.garden,   icon: Sprout },
              { label: 'Sipariş', value: user._count.orders,   icon: ShoppingBag },
              { label: 'Rozet',   value: badges.length,        icon: Award },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/10 rounded-2xl p-3 text-center">
                <Icon className="w-5 h-5 mx-auto mb-1 text-white/70" />
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-primary-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors',
                tab === id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab içeriği */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {tab === 'overview' && <OverviewTab user={user} badges={badges} activity={activity.slice(0, 5)} />}
            {tab === 'orders'   && <OrdersTab orders={orders} />}
            {tab === 'badges'   && <BadgesTab badges={badges} />}
            {tab === 'activity' && <ActivityTab activity={activity} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function OverviewTab({ user, badges, activity }: { user: any; badges: any[]; activity: any[] }) {
  return (
    <div className="space-y-6">
      {/* Hızlı linkler */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/bahcem" className="bg-primary-50 border border-primary-100 rounded-2xl p-4 flex items-center justify-between group hover:shadow-filiz transition-all">
          <div>
            <Sprout className="w-6 h-6 text-primary-500 mb-1" />
            <p className="font-semibold text-text-primary text-sm">Bahçem</p>
            <p className="text-xs text-text-secondary">{user._count.garden} aktif bitki</p>
          </div>
          <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary-500 transition-colors" />
        </Link>
        <Link href="/profil/ayarlar" className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between group hover:shadow-filiz transition-all">
          <div>
            <Settings className="w-6 h-6 text-text-secondary mb-1" />
            <p className="font-semibold text-text-primary text-sm">Ayarlar</p>
            <p className="text-xs text-text-secondary">Profil & bildirimler</p>
          </div>
          <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary-500 transition-colors" />
        </Link>
      </div>

      {/* Son rozetler */}
      {badges.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-text-primary mb-3">Son Kazanılan Rozetler</h2>
          <div className="flex gap-3 flex-wrap">
            {badges.slice(0, 6).map(({ badge, earnedAt }: any) => (
              <div key={badge.id} className="flex flex-col items-center gap-1 bg-white border border-gray-100 rounded-2xl p-3 w-20 text-center shadow-sm">
                <span className="text-2xl">{badge.icon}</span>
                <p className="text-xs font-medium text-text-primary leading-tight">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Son aktivite */}
      {activity.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-text-primary mb-3">Son Aktiviteler</h2>
          <div className="space-y-2">
            {activity.map((a: any) => {
              const info = ACTIVITY_LABELS[a.type] ?? { label: a.type, icon: Activity, color: 'text-text-secondary' }
              const Icon = info.icon
              return (
                <div key={a.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
                  <Icon className={cn('w-4 h-4 shrink-0', info.color)} />
                  <span className="text-sm text-text-primary flex-1">{info.label}</span>
                  {a.xpEarned > 0 && (
                    <span className="text-xs font-bold text-accent-gold flex items-center gap-0.5">
                      <Zap className="w-3 h-3" />+{a.xpEarned}
                    </span>
                  )}
                  <span className="text-xs text-text-secondary">
                    {new Date(a.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function OrdersTab({ orders }: { orders: any[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-12 h-12 text-primary-200 mx-auto mb-3" />
        <p className="text-text-secondary">Henüz sipariş vermediniz.</p>
        <Link href="/magaza" className="text-primary-600 text-sm font-medium mt-2 inline-block hover:underline">
          Mağazaya Git →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order: any) => {
        const status = ORDER_STATUS[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-600', icon: Clock }
        const StatusIcon = status.icon
        return (
          <div key={order.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
              <div>
                <p className="text-xs text-text-secondary mb-0.5">#{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-sm font-semibold text-text-primary">
                  {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn('text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5', status.color)}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
                <span className="font-bold text-text-primary">{order.total.toFixed(2)} ₺</span>
              </div>
            </div>
            <div className="px-5 py-3 space-y-2">
              {order.items.map((item: any, i: number) => {
                const name = item.seed?.name ?? item.product?.name ?? 'Ürün'
                const img = item.seed?.images?.[0] ?? item.product?.images?.[0]
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 overflow-hidden shrink-0">
                      {img && <Image src={img} alt={name} width={32} height={32} className="object-cover w-full h-full" />}
                    </div>
                    <span className="text-sm text-text-primary flex-1 truncate">{name}</span>
                    <span className="text-xs text-text-secondary">x{item.quantity}</span>
                    <span className="text-xs font-medium text-text-primary">{item.price.toFixed(2)} ₺</span>
                  </div>
                )
              })}
              {order.trackingNumber && (
                <p className="text-xs text-primary-600 font-medium pt-1">
                  Kargo: {order.trackingNumber}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function BadgesTab({ badges }: { badges: any[] }) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-16">
        <Award className="w-12 h-12 text-primary-200 mx-auto mb-3" />
        <p className="text-text-secondary">Henüz rozet kazanmadınız.</p>
        <p className="text-xs text-text-secondary mt-1">Bahçenize bitki ekleyerek başlayın!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {badges.map(({ badge, earnedAt }: any) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm"
        >
          <span className="text-4xl block mb-3">{badge.icon}</span>
          <p className="font-display font-bold text-text-primary text-sm mb-1">{badge.name}</p>
          <p className="text-xs text-text-secondary leading-tight mb-3">{badge.description}</p>
          {badge.xpReward > 0 && (
            <span className="text-xs font-bold text-accent-gold flex items-center justify-center gap-1">
              <Zap className="w-3 h-3" /> +{badge.xpReward} XP
            </span>
          )}
          <p className="text-[10px] text-text-secondary mt-2">
            {new Date(earnedAt).toLocaleDateString('tr-TR')}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

function ActivityTab({ activity }: { activity: any[] }) {
  if (activity.length === 0) {
    return (
      <div className="text-center py-16">
        <Activity className="w-12 h-12 text-primary-200 mx-auto mb-3" />
        <p className="text-text-secondary">Henüz aktivite yok.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {activity.map((a: any) => {
        const info = ACTIVITY_LABELS[a.type] ?? { label: a.type, icon: Activity, color: 'text-text-secondary' }
        const Icon = info.icon
        return (
          <div key={a.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
            <div className={cn('w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0', info.color)}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">{info.label}</p>
              <p className="text-xs text-text-secondary">
                {new Date(a.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {a.xpEarned > 0 && (
              <span className="text-xs font-bold text-accent-gold flex items-center gap-0.5 shrink-0">
                <Zap className="w-3 h-3" />+{a.xpEarned}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

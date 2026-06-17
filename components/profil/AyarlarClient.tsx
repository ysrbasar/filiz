'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, MapPin, Bell, Lock, CheckCircle, AlertCircle, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { CITIES } from '@/lib/cities'
import { cn } from '@/lib/utils/cn'

interface Props {
  user: {
    id: string
    name: string | null
    email: string
    city: string | null
    region: string | null
    notifications: boolean
    hasPassword: boolean
  }
}

type Section = 'profile' | 'city' | 'notifications' | 'password'

export function AyarlarClient({ user }: Props) {
  const router = useRouter()

  const [name, setName] = useState(user.name ?? '')
  const [city, setCity] = useState(user.city ?? '')
  const [region, setRegion] = useState(user.region ?? '')
  const [notifications, setNotifications] = useState(user.notifications)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const [citySearch, setCitySearch] = useState('')
  const [cityOpen, setCityOpen] = useState(false)

  const [saving, setSaving] = useState<Section | null>(null)
  const [success, setSuccess] = useState<Section | null>(null)
  const [error, setError] = useState<{ section: Section; msg: string } | null>(null)

  const filteredCities = CITIES.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  )

  async function save(section: Section, payload: Record<string, unknown>) {
    setSaving(section)
    setSuccess(null)
    setError(null)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError({ section, msg: data.error ?? 'Bir hata oluştu' })
      } else {
        setSuccess(section)
        router.refresh()
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch {
      setError({ section, msg: 'Bağlantı hatası' })
    } finally {
      setSaving(null)
    }
  }

  function saveProfile() {
    save('profile', { name })
  }

  function saveCity() {
    save('city', { city, region })
  }

  function saveNotifications() {
    save('notifications', { notifications })
  }

  function savePassword() {
    if (newPassword !== confirmPassword) {
      setError({ section: 'password', msg: 'Yeni şifreler eşleşmiyor' })
      return
    }
    if (newPassword.length < 8) {
      setError({ section: 'password', msg: 'Şifre en az 8 karakter olmalı' })
      return
    }
    save('password', { currentPassword, newPassword })
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  function Feedback({ section }: { section: Section }) {
    if (success === section) {
      return (
        <p className="flex items-center gap-1.5 text-sm text-green-600 mt-2">
          <CheckCircle className="w-4 h-4" /> Kaydedildi
        </p>
      )
    }
    if (error?.section === section) {
      return (
        <p className="flex items-center gap-1.5 text-sm text-red-500 mt-2">
          <AlertCircle className="w-4 h-4" /> {error.msg}
        </p>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-8">
          <Link href="/profil" className="inline-flex items-center gap-1.5 text-primary-200 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Profile dön
          </Link>
          <h1 className="font-display text-2xl font-bold">Profil Ayarları</h1>
          <p className="text-primary-200 text-sm mt-1">{user.email}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-2 pb-12 space-y-4">

        {/* Profil Bilgileri */}
        <div className="bg-white rounded-2xl border border-primary-100 shadow-filiz p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary-500" />
            <h2 className="font-display font-bold text-text-primary">Profil Bilgileri</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Ad Soyad</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">E-posta</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-text-secondary cursor-not-allowed"
              />
              <p className="text-xs text-text-secondary mt-1">E-posta adresi değiştirilemez</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={saveProfile}
              disabled={saving === 'profile'}
              className="px-5 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {saving === 'profile' ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <Feedback section="profile" />
          </div>
        </div>

        {/* Şehir & Bölge */}
        <div className="bg-white rounded-2xl border border-primary-100 shadow-filiz p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary-500" />
            <h2 className="font-display font-bold text-text-primary">Konum</h2>
          </div>
          <p className="text-xs text-text-secondary mb-4">Şehrinize göre özel ekim takvimleri ve öneriler alırsınız.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Şehir</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCityOpen((v) => !v)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  <span className={city ? 'text-text-primary' : 'text-text-secondary'}>{city || 'Şehir seçin'}</span>
                  <ChevronDown className={cn('w-4 h-4 text-text-secondary transition-transform', cityOpen && 'rotate-180')} />
                </button>
                {cityOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                      <input
                        type="text"
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        placeholder="Şehir ara..."
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-300"
                        autoFocus
                      />
                    </div>
                    <ul className="max-h-48 overflow-y-auto">
                      {filteredCities.map((c) => (
                        <li key={c.name}>
                          <button
                            type="button"
                            onClick={() => {
                              setCity(c.name)
                              setCitySearch('')
                              setCityOpen(false)
                            }}
                            className={cn(
                              'w-full text-left px-4 py-2 text-sm hover:bg-primary-50 transition-colors',
                              city === c.name ? 'text-primary-600 font-medium bg-primary-50' : 'text-text-primary'
                            )}
                          >
                            {c.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Bölge / Semt (isteğe bağlı)</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Ör: Kadıköy, Merkez..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={saveCity}
              disabled={saving === 'city'}
              className="px-5 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {saving === 'city' ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <Feedback section="city" />
          </div>
        </div>

        {/* Bildirimler */}
        <div className="bg-white rounded-2xl border border-primary-100 shadow-filiz p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary-500" />
            <h2 className="font-display font-bold text-text-primary">Bildirimler</h2>
          </div>

          <div className="flex items-center justify-between py-3 border border-gray-100 rounded-xl px-4">
            <div>
              <p className="text-sm font-medium text-text-primary">E-posta bildirimleri</p>
              <p className="text-xs text-text-secondary mt-0.5">Sulama hatırlatıcıları ve kampanya bildirimleri</p>
            </div>
            <button
              onClick={() => setNotifications((v) => !v)}
              className={cn(
                'relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0',
                notifications ? 'bg-primary-500' : 'bg-gray-200'
              )}
            >
              <span className={cn(
                'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                notifications ? 'translate-x-7' : 'translate-x-1'
              )} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={saveNotifications}
              disabled={saving === 'notifications'}
              className="px-5 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {saving === 'notifications' ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <Feedback section="notifications" />
          </div>
        </div>

        {/* Şifre Değiştir */}
        {user.hasPassword && (
          <div className="bg-white rounded-2xl border border-primary-100 shadow-filiz p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-primary-500" />
              <h2 className="font-display font-bold text-text-primary">Şifre Değiştir</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Mevcut Şifre</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Mevcut şifreniz"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Yeni Şifre</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="En az 8 karakter"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Yeni şifrenizi tekrar girin"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={savePassword}
                disabled={saving === 'password' || !currentPassword || !newPassword || !confirmPassword}
                className="px-5 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 disabled:opacity-50 transition-colors"
              >
                {saving === 'password' ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
              </button>
              <Feedback section="password" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

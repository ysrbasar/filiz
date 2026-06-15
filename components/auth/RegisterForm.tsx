'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ALL_CITIES } from '@/lib/utils/region'

export function RegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Kayıt başarısız.')
        return
      }
      await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      router.push('/bahcem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-filiz-hover p-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-text-primary mb-1">Hesap Oluştur</h1>
          <p className="text-text-secondary text-sm">Dijital bahçenize başlayın</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1.5">Ad Soyad</label>
            <input
              id="name" type="text" required autoComplete="name"
              value={form.name} onChange={update('name')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 text-sm"
              placeholder="Adınız Soyadınız"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">E-posta</label>
            <input
              id="email" type="email" required autoComplete="email"
              value={form.email} onChange={update('email')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 text-sm"
              placeholder="ornek@mail.com"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-text-primary mb-1.5">Şehriniz</label>
            <select
              id="city"
              value={form.city} onChange={update('city')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 text-sm bg-white"
            >
              <option value="">Şehir seçin (isteğe bağlı)</option>
              {ALL_CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5">Şifre</label>
            <div className="relative">
              <input
                id="password" type={showPass ? 'text' : 'password'} required autoComplete="new-password"
                value={form.password} onChange={update('password')} minLength={8}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 text-sm"
                placeholder="En az 8 karakter"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full bg-primary-500 hover:bg-primary-600 rounded-xl" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Kayıt Ol
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Zaten hesabınız var mı?{' '}
          <Link href="/giris" className="text-primary-600 font-medium hover:underline">Giriş Yapın</Link>
        </p>
      </div>
    </div>
  )
}

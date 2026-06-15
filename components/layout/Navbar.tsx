'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Leaf, Menu, X, Search, User, MapPin, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useLocationStore } from '@/store/locationStore'
import { ALL_CITIES } from '@/lib/utils/region'
import { cn } from '@/lib/utils/cn'
import { buttonVariants } from '@/components/ui/button'

const NAV_LINKS = [
  { href: '/magaza', label: 'Mağaza' },
  { href: '/tohum', label: 'Tohumlar' },
  { href: '/bahcem', label: 'Bahçem' },
  { href: '/akademi', label: 'Akademi' },
  { href: '/projeler', label: 'Topluluk' },
]

function CityPicker() {
  const city = useLocationStore((s) => s.city)
  const setCity = useLocationStore((s) => s.setCity)
  const clearCity = useLocationStore((s) => s.clearCity)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const filtered = ALL_CITIES.filter((c) => c.toLowerCase().includes(search.toLowerCase())).slice(0, 30)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
          city
            ? 'bg-primary-100 text-primary-700 border-primary-300'
            : 'bg-white text-text-secondary border-gray-200 hover:border-primary-300 hover:text-primary-600'
        )}
      >
        <MapPin className="w-3.5 h-3.5" />
        <span>{city ?? 'Şehir Seç'}</span>
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-primary-100 rounded-xl shadow-filiz-hover z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-50">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Şehir ara..."
              className="w-full px-3 py-1.5 text-xs bg-primary-50 rounded-lg outline-none focus:ring-1 focus:ring-primary-300"
            />
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {city && (
              <button
                onClick={() => { clearCity(); setOpen(false); setSearch('') }}
                className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                ✕ Konumu Temizle
              </button>
            )}
            {filtered.map((c) => (
              <button
                key={c}
                onClick={() => { setCity(c); setOpen(false); setSearch('') }}
                className={cn(
                  'w-full text-left px-3 py-2 text-xs rounded-lg transition-colors',
                  city === c ? 'bg-primary-100 text-primary-700 font-medium' : 'hover:bg-primary-50 text-text-primary'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const totalItems = useCartStore((s) => s.totalItems())
  const openCart = useCartStore((s) => s.openCart)
  const city = useLocationStore((s) => s.city)
  const setCity = useLocationStore((s) => s.setCity)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Hydration guard — sunucu/istemci farkını önle
  const displayCity = mounted ? city : null
  const displayItems = mounted ? totalItems : 0

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-primary-100 shadow-filiz">
      {/* Lokasyon bandı — sadece şehir seçilmemişse göster */}
      {!displayCity && (
        <div className="bg-primary-600 text-white text-xs py-1.5 px-4 flex items-center justify-center gap-2">
          <MapPin className="w-3 h-3" />
          <span>Bölgenize özel ekim takvimi için şehrinizi seçin</span>
          <CityPicker />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <Leaf className="w-6 h-6 text-primary-400" strokeWidth={2.5} />
            <span className="font-display tracking-tight">Filiz</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith(link.href)
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-text-secondary hover:text-primary-600 hover:bg-primary-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {/* Şehir seçili ise compact göster */}
            {displayCity && <CityPicker />}

            <button
              aria-label="Ara"
              className="p-2 rounded-lg text-text-secondary hover:text-primary-600 hover:bg-primary-50 transition-colors touch-target hidden sm:flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/profil"
              aria-label="Profil"
              className="p-2 rounded-lg text-text-secondary hover:text-primary-600 hover:bg-primary-50 transition-colors touch-target hidden sm:flex items-center justify-center"
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              onClick={openCart}
              aria-label="Sepet"
              suppressHydrationWarning
              className="relative p-2 rounded-lg text-text-secondary hover:text-primary-600 hover:bg-primary-50 transition-colors touch-target flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            <button
              aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-primary-50 transition-colors touch-target flex items-center justify-center"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-primary-100 bg-white px-4 pb-4 pt-2">
          {/* Mobile şehir seçici */}
          <div className="mb-3 pb-3 border-b border-primary-50">
            <p className="text-xs text-text-secondary mb-2 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Konumunuz
            </p>
            <select
              value={city ?? ''}
              onChange={(e) => {
                if (e.target.value) setCity(e.target.value)
              }}
              className="w-full px-3 py-2 text-sm border border-primary-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              <option value="">Şehir seçin</option>
              {ALL_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith(link.href)
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-text-secondary hover:text-primary-600 hover:bg-primary-50'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-primary-100 flex gap-2">
              <Link href="/giris" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex-1 justify-center')}>
                Giriş Yap
              </Link>
              <Link href="/kayit" className={cn(buttonVariants({ size: 'sm' }), 'flex-1 justify-center bg-primary-400 hover:bg-primary-500')}>
                Üye Ol
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

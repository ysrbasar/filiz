import Link from 'next/link'
import { Leaf } from 'lucide-react'

const CATEGORIES = [
  { href: '/tohum', label: 'Tohumlar' },
  { href: '/magaza/fideler', label: 'Fideler' },
  { href: '/magaza/gubreler', label: 'Gübreler' },
  { href: '/magaza/ekipmanlar', label: 'Ekipmanlar' },
  { href: '/magaza/hobi-setleri', label: 'Hobi Setleri' },
]

const PLATFORM = [
  { href: '/bahcem', label: 'Bahçem' },
  { href: '/akademi', label: 'Akademi' },
  { href: '/projeler', label: 'Topluluk' },
  { href: '/rozetler', label: 'Rozetler' },
]

const SUPPORT = [
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/gizlilik', label: 'Gizlilik' },
  { href: '/kullanim-kosullari', label: 'Kullanım Koşulları' },
]

export function Footer() {
  return (
    <footer className="bg-primary-600 text-primary-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <Leaf className="w-6 h-6 text-primary-300" />
              <span>Filiz</span>
            </Link>
            <p className="text-sm text-primary-200 leading-relaxed mb-4">
              Tohumdan hasada kişiselleştirilmiş dijital tarım rehberi. Türkiye&apos;nin en kapsamlı tarım platformu.
            </p>
            <div className="flex items-center gap-3">
              {['Instagram', 'YouTube', 'Twitter'].map((platform) => (
                <a key={platform} href={`https://${platform.toLowerCase()}.com`} aria-label={platform} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-primary-500 hover:bg-primary-400 transition-colors text-xs font-bold">
                  {platform[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Kategoriler */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Kategoriler</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-sm text-primary-200 hover:text-white transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Platform</h3>
            <ul className="space-y-2">
              {PLATFORM.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="text-sm text-primary-200 hover:text-white transition-colors">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destek */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Destek</h3>
            <ul className="space-y-2">
              {SUPPORT.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm text-primary-200 hover:text-white transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-300">
            © {new Date().getFullYear()} Filiz Tarım Teknolojileri A.Ş. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-primary-400">
            Türkiye&apos;nin dijital tarım platformu 🌱
          </p>
        </div>
      </div>
    </footer>
  )
}

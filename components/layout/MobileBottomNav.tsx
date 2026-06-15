'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Sprout, ShoppingBag, Leaf, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV = [
  { href: '/',        label: 'Ana Sayfa', icon: Home },
  { href: '/tohum',   label: 'Tohumlar',  icon: Sprout },
  { href: '/magaza',  label: 'Mağaza',    icon: ShoppingBag },
  { href: '/bahcem',  label: 'Bahçem',    icon: Leaf },
  { href: '/profil',  label: 'Profil',    icon: User },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-primary-100 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors touch-target',
                active ? 'text-primary-500' : 'text-text-secondary'
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

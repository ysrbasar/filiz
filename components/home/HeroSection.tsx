'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, QrCode, Brain } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

const BADGES = [
  { icon: QrCode, label: 'QR Rehber' },
  { icon: Leaf,   label: 'Organik' },
  { icon: Brain,  label: 'AI Danışman' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-surface to-earth-100 min-h-[92vh] flex items-center">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-earth-200/40 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary-100 text-primary-600 text-sm font-semibold px-4 py-2 rounded-full mb-6"
          >
            <Leaf className="w-4 h-4" />
            Türkiye&apos;nin Dijital Tarım Platformu
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6"
          >
            Tohumdan Hasada{' '}
            <span className="text-primary-500">Dijital Tarım</span>{' '}
            Rehberi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-text-secondary leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
          >
            Tohum al, QR kodunu oku, yapay zeka destekli kişiselleştirilmiş rehberinle büyüt.
            Bölgesel iklim takvimleri, interaktif büyüme çizelgesi ve anlık bitki danışmanı
            bir arada.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
          >
            <Link
              href="/magaza"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-primary-400 hover:bg-primary-500 text-white h-14 px-8 text-base font-semibold rounded-xl shadow-filiz hover:shadow-filiz-hover transition-all hover:-translate-y-0.5 inline-flex items-center gap-2'
              )}
            >
              Alışverişe Başla
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/bahcem"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'h-14 px-8 text-base font-semibold rounded-xl border-2 border-primary-300 text-primary-600 hover:bg-primary-50 inline-flex items-center gap-2'
              )}
            >
              <Leaf className="w-5 h-5" />
              Bahçeni Oluştur
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-4 mt-8 justify-center lg:justify-start"
          >
            {BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-sm text-text-secondary">
                <Icon className="w-4 h-4 text-primary-400" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="grid grid-cols-2 gap-4">
            {[
              { src: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', alt: 'Cherry domates', tall: true, mt: '' },
              { src: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400', alt: 'Salatalık', tall: false, mt: 'mt-8' },
              { src: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400', alt: 'Fesleğen', tall: false, mt: '-mt-8' },
              { src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400', alt: 'Lavanta', tall: true, mt: '' },
            ].map(({ src, alt, tall, mt }) => (
              <div key={alt} className={`rounded-2xl overflow-hidden shadow-filiz ${tall ? 'h-64' : 'h-44'} ${mt}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-filiz-hover p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Aktif Bahçe</p>
              <p className="font-bold text-text-primary">12.400+ kullanıcı</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

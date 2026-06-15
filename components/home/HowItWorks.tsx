'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, QrCode, Sprout, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    icon: ShoppingBag,
    title: 'Tohumunu Seç',
    description: '200+ çeşit tohum, fide ve meyve fidanı arasından bölgene ve mevsime uygun olanı seç.',
    color: 'bg-primary-100 text-primary-500',
    number: '01',
  },
  {
    icon: QrCode,
    title: 'QR Kodunu Oku',
    description: 'Ürünle birlikte gelen QR kodu tara. Anında kişiselleştirilmiş yetiştirme rehberin açılsın.',
    color: 'bg-earth-200 text-earth-400',
    number: '02',
  },
  {
    icon: Sprout,
    title: 'Rehberle Büyüt',
    description: 'Bölgesel takvim, günlük görevler ve yapay zeka danışmanıyla tohumdan hasada yönlendir.',
    color: 'bg-accent-gold/20 text-yellow-600',
    number: '03',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <span className="inline-block text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">
            Nasıl Çalışır?
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            3 Adımda Dijital Bahçe
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Filiz platformu, tarım deneyimini baştan sonra dijital ve kişiselleştirilmiş hale getirir.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Bağlantı çizgisi */}
          <div aria-hidden="true" className="hidden md:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-primary-200 via-earth-200 to-accent-gold/40" />

          {STEPS.map(({ icon: Icon, title, description, color, number }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`relative w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-5 shadow-filiz`}>
                <Icon className="w-7 h-7" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
                  {number}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary mb-3">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
              {i < STEPS.length - 1 && (
                <ArrowRight className="md:hidden mt-6 w-5 h-5 text-primary-300 rotate-90" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

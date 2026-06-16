import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { BookOpen, Clock, Eye } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tarım Akademisi | Filiz',
  description: 'Organik tarım, bahçecilik ve tohum yetiştirme rehberleri.',
}

const CATEGORY_LABELS: Record<string, string> = {
  VEGETABLE: 'Sebze', FRUIT: 'Meyve', ORGANIC: 'Organik', FERTILIZING: 'Gübreleme',
  IRRIGATION: 'Sulama', COMPOST: 'Kompost', GREENHOUSE: 'Sera', BEGINNER: 'Başlangıç',
}

const CATEGORY_COLORS: Record<string, string> = {
  VEGETABLE: 'bg-primary-100 text-primary-700',
  FRUIT: 'bg-orange-100 text-orange-700',
  ORGANIC: 'bg-emerald-100 text-emerald-700',
  FERTILIZING: 'bg-amber-100 text-amber-700',
  IRRIGATION: 'bg-sky-100 text-sky-700',
  COMPOST: 'bg-earth-200 text-earth-400',
  GREENHOUSE: 'bg-teal-100 text-teal-700',
  BEGINNER: 'bg-purple-100 text-purple-700',
}

export default async function AkademiPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  })

  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <BookOpen className="w-4 h-4" /> Tarım Akademisi
          </span>
          <h1 className="text-4xl font-bold mb-3">Bilgi Bahçenizi Büyütün</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Uzman rehberleri, pratik ipuçları ve organik tarımın sırları bir arada.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Öne Çıkan Makale */}
        {featured && (
          <Link href={`/akademi/${featured.slug}`} className="group block mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-filiz border border-primary-100 hover:shadow-filiz-hover transition-shadow">
              <div className="relative aspect-video lg:aspect-auto min-h-64 bg-primary-50">
                {featured.coverImage ? (
                  <Image src={featured.coverImage} alt={featured.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-primary-200" />
                  </div>
                )}
              </div>
              <div className="bg-white p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">Öne Çıkan</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLORS[featured.category] ?? 'bg-gray-100 text-gray-700'}`}>
                    {CATEGORY_LABELS[featured.category] ?? featured.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary-600 transition-colors">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="text-text-secondary leading-relaxed mb-4">{featured.excerpt}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  {featured.readingTime && (
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featured.readingTime} dk okuma</span>
                  )}
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {featured.viewCount.toLocaleString('tr-TR')}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Makale Grid */}
        {rest.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Tüm Yazılar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((article) => (
                <Link key={article.id} href={`/akademi/${article.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-filiz border border-primary-50 hover:shadow-filiz-hover transition-all hover:-translate-y-0.5">
                  <div className="relative aspect-video bg-primary-50">
                    {article.coverImage ? (
                      <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="400px" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-primary-200" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[article.category] ?? 'bg-gray-100 text-gray-700'}`}>
                      {CATEGORY_LABELS[article.category] ?? article.category}
                    </span>
                    <h3 className="font-bold text-text-primary mt-2 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-text-secondary line-clamp-2 mb-3">{article.excerpt}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      {article.readingTime && (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readingTime} dk</span>
                      )}
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.viewCount.toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {articles.length === 0 && (
          <div className="text-center py-20 text-text-secondary">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-primary-200" />
            <p>Henüz makale yok.</p>
          </div>
        )}
      </div>
    </div>
  )
}

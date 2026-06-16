import { cache } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Eye, ArrowLeft, BookOpen } from 'lucide-react'

interface Props { params: Promise<{ slug: string }> }

const CATEGORY_LABELS: Record<string, string> = {
  VEGETABLE: 'Sebze', FRUIT: 'Meyve', ORGANIC: 'Organik', FERTILIZING: 'Gübreleme',
  IRRIGATION: 'Sulama', COMPOST: 'Kompost', GREENHOUSE: 'Sera', BEGINNER: 'Başlangıç',
}

const getArticle = cache(async (slug: string) => {
  return prisma.article.findUnique({ where: { slug, published: true } })
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Makale Bulunamadı' }
  return {
    title: article.seoTitle ?? `${article.title} | Filiz Akademi`,
    description: article.seoDescription ?? article.excerpt ?? article.content.slice(0, 160),
  }
}

function renderMarkdown(content: string) {
  return content
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-text-primary mt-8 mb-4 first:mt-0">{line.slice(2)}</h1>
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-text-primary mt-6 mb-3">{line.slice(3)}</h2>
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold text-text-primary mt-5 mb-2">{line.slice(4)}</h3>
      if (line.startsWith('- ')) return <li key={i} className="text-text-secondary ml-4 mb-1 list-disc">{line.slice(2)}</li>
      if (line.trim() === '') return <div key={i} className="h-3" />
      return <p key={i} className="text-text-secondary leading-relaxed mb-2">{line}</p>
    })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  await prisma.article.update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      {article.coverImage && (
        <div className="relative h-72 md:h-96 w-full bg-primary-50">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <Link href="/akademi" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Akademiye Dön
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
            {CATEGORY_LABELS[article.category] ?? article.category}
          </span>
          {article.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">#{tag}</span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">{article.title}</h1>

        {article.excerpt && (
          <p className="text-lg text-text-secondary leading-relaxed mb-6 border-l-4 border-primary-300 pl-4 italic">{article.excerpt}</p>
        )}

        <div className="flex items-center gap-5 text-sm text-text-secondary mb-8 pb-8 border-b border-primary-100">
          {article.readingTime && (
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary-400" /> {article.readingTime} dakika okuma</span>
          )}
          <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-primary-400" /> {article.viewCount.toLocaleString('tr-TR')} görüntüleme</span>
          {article.publishedAt && (
            <span>{new Date(article.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          )}
        </div>

        {/* Content */}
        <div className="prose-like">
          {renderMarkdown(article.content)}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-primary-100 text-center">
          <Link href="/akademi" className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors">
            <BookOpen className="w-4 h-4" /> Daha Fazla Makale
          </Link>
        </div>
      </div>
    </div>
  )
}

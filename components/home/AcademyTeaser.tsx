import Link from 'next/link'
import { ArrowRight, Clock, BookOpen } from 'lucide-react'

type Article = {
  id: string; slug: string; title: string; excerpt: string | null;
  coverImage: string | null; readingTime: number | null; category: string; publishedAt: Date | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  VEGETABLE: 'Sebze', FRUIT: 'Meyve', ORGANIC: 'Organik',
  FERTILIZING: 'Gübreleme', IRRIGATION: 'Sulama',
  COMPOST: 'Kompost', GREENHOUSE: 'Sera', BEGINNER: 'Başlangıç',
}

export function AcademyTeaser({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider block mb-2">
              Tarım Akademisi
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
              Bilgi ile Büyü
            </h2>
          </div>
          <Link href="/akademi" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors">
            Tüm Makaleler <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/akademi/${article.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-filiz hover:shadow-filiz-hover transition-all border border-primary-100 hover:-translate-y-1">
              <div className="relative h-44 bg-primary-100">
                {article.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 text-primary-600 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {CATEGORY_LABELS[article.category] ?? article.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-text-primary leading-snug mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-text-secondary line-clamp-2 mb-3">{article.excerpt}</p>
                )}
                {article.readingTime && (
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <Clock className="w-3 h-3" />
                    {article.readingTime} dk okuma
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

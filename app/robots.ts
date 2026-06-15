import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://filiz.com.tr'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/bahcem/', '/profil/', '/odeme/'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/tohum/', '/akademi/', '/magaza/'],
        disallow: ['/api/', '/admin/', '/bahcem/', '/profil/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import { sanitizeInput } from '@/lib/utils/sanitize'

const schema = z.object({
  message: z.string().min(1).max(500),
  seedSlug: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
})

const SYSTEM_PROMPT = `Sen Filiz'in yapay zeka bitki danışmanısın. Türkiye'deki ev bahçeciliği, organik tarım ve tohum yetiştirme konusunda uzman bir rehbersin.

Kısa, pratik ve samimi cevaplar ver. Teknik terimleri Türkçe açıkla. Yanıtların maksimum 200 kelime olsun.

Uzmanlık alanların:
- Tohum ekimi ve çimlendirme teknikleri
- Türkiye'nin 7 iklim bölgesi ve bölgesel ekim takvimleri
- Bitki hastalıkları ve organik çözümleri
- Balkon, teras ve iç mekan bahçeciliği
- Kompost ve organik gübre hazırlama
- Mevsimlik ekimler ve hasat zamanları

Sadece bahçecilik ve bitki konularında yardım et. Diğer konularda kibarca "Bu konuda yardımcı olamam, bahçecilik ve bitkiler konusunda sorularını bekliyorum." de.`

export async function POST(req: NextRequest) {
  const limitRes = rateLimit(req, 'ai')
  if (limitRes) return limitRes

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 })

  const { message, seedSlug, city } = parsed.data
  const cleanMessage = sanitizeInput(message, 500)

  const context = [
    seedSlug ? `Kullanıcı şu tohum hakkında soru soruyor: ${seedSlug}` : null,
    city ? `Kullanıcının bulunduğu şehir: ${city}` : null,
  ].filter(Boolean).join('. ')

  const userMessage = context ? `[Bağlam: ${context}]\n\n${cleanMessage}` : cleanMessage

  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY
  const provider = process.env.AI_PROVIDER ?? 'openai'

  if (!apiKey) {
    return NextResponse.json({
      reply: getDemoReply(cleanMessage),
    })
  }

  try {
    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      })
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content ?? 'Yanıt alınamadı.'
      return NextResponse.json({ reply })
    }

    return NextResponse.json({ reply: getDemoReply(cleanMessage) })
  } catch {
    return NextResponse.json({ reply: getDemoReply(cleanMessage) }, { status: 200 })
  }
}

function getDemoReply(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('domates') || lower.includes('tomato')) {
    return 'Domates yetiştiriciliği için en kritik nokta güneş ışığı! Günde en az 6-8 saat doğrudan güneş almalı. Tohumları Mart ayında iç mekanda başlatıp Mayıs\'ta dışarıya aktarabilirsiniz. Düzenli sulama ve çiçeklenme döneminde potasyumlu gübre kullanmayı unutmayın. 🍅'
  }
  if (lower.includes('su') || lower.includes('sulama')) {
    return 'Sulama zamanı ve miktarı bitki türüne göre değişir. Genel kural: toprağın üst 2-3 cm\'i kuruyunca sulayın. Sabah erkenden sulama yapın, bu yaprak hastalıklarını önler. Saksı bitkilerinde drenaj deliklerini kontrol edin — su birikimine izin vermeyin. 💧'
  }
  if (lower.includes('gübre') || lower.includes('toprak')) {
    return 'Organik bahçecilik için kompost en iyi gübredir. Mutfak atıklarından (kahve, yumurta kabuğu, sebze artıkları) kolayca yapabilirsiniz. Hazır kullanmak istiyorsanız solucan gübresi (vermikompost) harika sonuçlar verir. Bitki türüne göre N-P-K oranlarına dikkat edin. 🌱'
  }
  return 'Harika bir soru! Türkiye\'nin 7 farklı iklim bölgesi bahçecilik koşullarını etkiler. Bulunduğunuz bölgeye özel tavsiyeler için şehrinizi belirtin. Filiz platformunda her tohum için bölgesel ekim takvimleri ve kişisel büyüme rehberlerine erişebilirsiniz. 🌿'
}

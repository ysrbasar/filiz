import { NextRequest, NextResponse } from 'next/server'

const PROMPT = `Sen bir bitki hastalıkları ve bahçecilik uzmanısın. Kullanıcı sana bir bitki fotoğrafı gönderdi.

Görseli analiz et ve şu JSON formatında yanıt ver (başka hiçbir şey yazma, sadece JSON):
{
  "status": "healthy" | "warning" | "sick" | "unknown",
  "plant": "bitki adı (eğer tanımlayabilirsen)",
  "summary": "kısa genel değerlendirme (1-2 cümle, Türkçe)",
  "problems": [
    {
      "name": "sorun adı",
      "severity": "low" | "medium" | "high",
      "description": "sorunun açıklaması",
      "solution": "çözüm önerisi"
    }
  ],
  "tips": ["bakım önerisi 1", "bakım önerisi 2"],
  "confidence": 85
}

Sorun yoksa problems dizisi boş olsun. En fazla 3 sorun ve 4 öneri yaz. Tüm metinler Türkçe olsun.`

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const imageFile = formData.get('image') as File | null
  if (!imageFile) return NextResponse.json({ error: 'Görsel gerekli.' }, { status: 400 })

  const bytes = await imageFile.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')
  const mimeType = imageFile.type || 'image/jpeg'

  // Gemini dene
  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: PROMPT },
                { inline_data: { mime_type: mimeType, data: base64 } },
              ],
            }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
          }),
        }
      )
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      const json = extractJSON(text)
      if (json) return NextResponse.json(json)
    } catch {}
  }

  // OpenAI fallback
  const openaiKey = process.env.OPENAI_API_KEY
  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: PROMPT },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } },
            ],
          }],
          max_tokens: 1024,
        }),
      })
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content ?? ''
      const json = extractJSON(text)
      if (json) return NextResponse.json(json)
    } catch {}
  }

  return NextResponse.json(
    { error: 'AI API anahtarı bulunamadı. .env dosyanıza GEMINI_API_KEY veya OPENAI_API_KEY ekleyin.' },
    { status: 503 }
  )
}

function extractJSON(text: string): object | null {
  try {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
  } catch {}
  return null
}

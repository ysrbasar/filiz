'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Camera, Upload, Leaf, AlertTriangle, CheckCircle, Loader2, RotateCcw, Sparkles } from 'lucide-react'

interface AnalysisResult {
  status: 'healthy' | 'warning' | 'sick' | 'unknown'
  plant?: string
  summary: string
  problems: { name: string; severity: 'low' | 'medium' | 'high'; description: string; solution: string }[]
  tips: string[]
  confidence: number
}

export function AIAnalyzer() {
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleFile = (f: File) => {
    setFile(f)
    setResult(null)
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => setImage(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('/api/ai/analyze', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Analiz başarısız')
      setResult(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setImage(null); setFile(null); setResult(null); setError('') }

  const STATUS_CONFIG = {
    healthy: { icon: <CheckCircle className="w-6 h-6 text-primary-500" />, label: 'Sağlıklı', bg: 'bg-primary-50 border-primary-200' },
    warning: { icon: <AlertTriangle className="w-6 h-6 text-amber-500" />, label: 'Dikkat Gerekiyor', bg: 'bg-amber-50 border-amber-200' },
    sick: { icon: <AlertTriangle className="w-6 h-6 text-red-500" />, label: 'Hasta / Sorunlu', bg: 'bg-red-50 border-red-200' },
    unknown: { icon: <Leaf className="w-6 h-6 text-gray-400" />, label: 'Tanımlanamadı', bg: 'bg-gray-50 border-gray-200' },
  }

  const SEVERITY_COLORS = {
    low: 'bg-amber-100 text-amber-700',
    medium: 'bg-orange-100 text-orange-700',
    high: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-emerald-600 text-white py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" /> AI Bitki Analizi
          </div>
          <h1 className="text-3xl font-bold mb-2">Bitkini Analiz Et</h1>
          <p className="text-primary-100">
            Fotoğraf çek veya yükle — yapay zeka saniyeler içinde hastalık, eksiklik ve önerilerini söylesin.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Upload area */}
        {!image ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => cameraRef.current?.click()}
              className="flex flex-col items-center gap-3 bg-white border-2 border-dashed border-primary-200 rounded-2xl p-8 hover:border-primary-400 hover:bg-primary-50 transition-all group"
            >
              <Camera className="w-10 h-10 text-primary-300 group-hover:text-primary-500 transition-colors" />
              <span className="font-semibold text-text-primary">Fotoğraf Çek</span>
              <span className="text-xs text-text-secondary">Kameranı kullan</span>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </button>

            <button
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center gap-3 bg-white border-2 border-dashed border-primary-200 rounded-2xl p-8 hover:border-primary-400 hover:bg-primary-50 transition-all group"
            >
              <Upload className="w-10 h-10 text-primary-300 group-hover:text-primary-500 transition-colors" />
              <span className="font-semibold text-text-primary">Galeriden Yükle</span>
              <span className="text-xs text-text-secondary">JPG, PNG desteklenir</span>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image preview */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-filiz">
              <Image src={image} alt="Analiz görseli" fill className="object-cover" />
            </div>

            {!result && (
              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-text-secondary rounded-xl py-3 font-medium hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Değiştir
                </button>
                <button
                  onClick={analyze}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white rounded-xl py-3 font-semibold transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loading ? 'Analiz ediliyor...' : 'Analiz Et'}
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700 text-sm">Analiz Hatası</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              {error.includes('API') && (
                <p className="text-red-500 text-xs mt-1">Lütfen .env dosyanıza GEMINI_API_KEY veya OPENAI_API_KEY ekleyin.</p>
              )}
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {/* Status card */}
            <div className={`border rounded-2xl p-5 ${STATUS_CONFIG[result.status].bg}`}>
              <div className="flex items-center gap-3 mb-3">
                {STATUS_CONFIG[result.status].icon}
                <div>
                  <p className="font-bold text-text-primary">{STATUS_CONFIG[result.status].label}</p>
                  {result.plant && <p className="text-sm text-text-secondary">{result.plant}</p>}
                </div>
                <span className="ml-auto text-xs bg-white/60 rounded-full px-2 py-1 text-text-secondary">
                  %{result.confidence} güven
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{result.summary}</p>
            </div>

            {/* Problems */}
            {result.problems.length > 0 && (
              <div className="bg-white border border-primary-100 rounded-2xl p-5 shadow-filiz">
                <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Tespit Edilen Sorunlar
                </h3>
                <div className="space-y-3">
                  {result.problems.map((p, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SEVERITY_COLORS[p.severity]}`}>
                          {p.severity === 'low' ? 'Düşük' : p.severity === 'medium' ? 'Orta' : 'Yüksek'}
                        </span>
                        <span className="font-semibold text-text-primary text-sm">{p.name}</span>
                      </div>
                      <p className="text-xs text-text-secondary mb-2">{p.description}</p>
                      <div className="bg-primary-50 rounded-lg p-2">
                        <p className="text-xs font-medium text-primary-700">💡 Çözüm: {p.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {result.tips.length > 0 && (
              <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
                <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-primary-500" /> Bakım Önerileri
                </h3>
                <ul className="space-y-2">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-primary-400 mt-0.5 shrink-0">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 rounded-xl py-3 font-medium hover:bg-primary-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Yeni Analiz
            </button>
          </div>
        )}

        {/* Info */}
        {!image && (
          <div className="bg-white border border-primary-100 rounded-2xl p-5 shadow-filiz">
            <h3 className="font-semibold text-text-primary mb-3">Neler Tespit Edilebilir?</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-text-secondary">
              {['Yaprak sararmışı', 'Mantar hastalıkları', 'Böcek zararı', 'Su stresi', 'Besin eksikliği', 'Kök çürüklüğü'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

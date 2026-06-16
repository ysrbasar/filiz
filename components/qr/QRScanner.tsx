'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, QrCode, Flashlight, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react'

type ScanState = 'idle' | 'scanning' | 'success' | 'error'

export function QRScanner() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [state, setState] = useState<ScanState>('idle')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [torchOn, setTorchOn] = useState(false)
  const [hasCamera, setHasCamera] = useState(true)

  const stopCamera = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  const startCamera = async () => {
    setState('scanning')
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      startDecoding()
    } catch (e) {
      setHasCamera(false)
      setError('Kamera erişimi reddedildi. Lütfen tarayıcı ayarlarından kamera iznini verin.')
      setState('error')
    }
  }

  const startDecoding = () => {
    intervalRef.current = setInterval(async () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState < 2) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)

      try {
        // BarcodeDetector API (Chrome 83+, Android Chrome)
        if ('BarcodeDetector' in window) {
          const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] })
          const codes = await detector.detect(canvas)
          if (codes.length > 0) {
            handleResult(codes[0].rawValue)
          }
        }
      } catch {}
    }, 300)
  }

  const handleResult = (value: string) => {
    stopCamera()
    setResult(value)
    setState('success')

    // filiz.com.tr/tohum/xxx → /tohum/xxx ye yönlendir
    try {
      const url = new URL(value)
      const path = url.pathname
      if (path.startsWith('/tohum/') || path.startsWith('/magaza/')) {
        setTimeout(() => router.push(path), 1200)
        return
      }
    } catch {}

    // Doğrudan slug ise
    if (/^[a-z0-9-]+$/.test(value)) {
      setTimeout(() => router.push(`/tohum/${value}`), 1200)
    }
  }

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0]
    if (!track) return
    try {
      await (track as any).applyConstraints({ advanced: [{ torch: !torchOn }] })
      setTorchOn(!torchOn)
    } catch {}
  }

  useEffect(() => () => stopCamera(), [])

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-4 flex items-center gap-3">
        <QrCode className="w-6 h-6 text-primary-400" />
        <div>
          <h1 className="font-bold text-lg">QR Kod Tara</h1>
          <p className="text-xs text-gray-400">Tohum paketindeki kodu okut</p>
        </div>
      </div>

      {/* Camera / State area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-6">

        {state === 'idle' && (
          <div className="text-center space-y-6">
            <div className="w-40 h-40 mx-auto rounded-3xl bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-600">
              <QrCode className="w-16 h-16 text-gray-500" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg mb-2">Tohum QR Kodunu Tara</p>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Filiz tohumlarının paketindeki QR kodu okutarak anında yetiştirme rehberini aç.
              </p>
            </div>
            <button
              onClick={startCamera}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 rounded-2xl font-semibold transition-colors"
            >
              <Camera className="w-5 h-5" />
              Kamerayı Aç
            </button>
          </div>
        )}

        {state === 'scanning' && (
          <div className="w-full max-w-sm space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-black aspect-square">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scan frame overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-52 h-52 relative">
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary-400 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary-400 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary-400 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary-400 rounded-br-lg" />
                  {/* Scanning line animation */}
                  <div className="absolute left-2 right-2 h-0.5 bg-primary-400/70 animate-scan-line" />
                </div>
              </div>
            </div>

            <p className="text-center text-gray-300 text-sm">QR kodu çerçeve içine al</p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={toggleTorch}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${torchOn ? 'bg-amber-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                <Flashlight className="w-4 h-4" /> Fener
              </button>
              <button
                onClick={() => { stopCamera(); setState('idle') }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> İptal
              </button>
            </div>
          </div>
        )}

        {state === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle className="w-20 h-20 text-primary-400 mx-auto" />
            <p className="text-white font-bold text-xl">QR Kod Okundu!</p>
            <p className="text-gray-400 text-sm break-all max-w-xs">{result}</p>
            <p className="text-primary-400 text-sm">Sayfaya yönlendiriliyorsunuz...</p>
            <button
              onClick={() => { setState('idle'); setResult('') }}
              className="text-gray-400 hover:text-white text-sm underline"
            >
              Tekrar tara
            </button>
          </div>
        )}

        {state === 'error' && (
          <div className="text-center space-y-4">
            <AlertCircle className="w-20 h-20 text-red-400 mx-auto" />
            <p className="text-white font-bold text-lg">Hata</p>
            <p className="text-gray-400 text-sm max-w-xs">{error}</p>
            <button
              onClick={() => setState('idle')}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Tekrar Dene
            </button>
          </div>
        )}
      </div>

      {/* Manuel giriş */}
      {(state === 'idle' || state === 'error') && (
        <div className="px-4 pb-8">
          <div className="bg-gray-800 rounded-2xl p-4">
            <p className="text-gray-400 text-xs mb-2">Veya tohum adını manuel gir:</p>
            <form onSubmit={(e) => {
              e.preventDefault()
              const val = (e.currentTarget.elements.namedItem('slug') as HTMLInputElement).value.trim()
              if (val) router.push(`/tohum/${val.toLowerCase().replace(/\s+/g, '-')}`)
            }} className="flex gap-2">
              <input
                name="slug"
                placeholder="örn: cherry-domates"
                className="flex-1 bg-gray-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-gray-500"
              />
              <button type="submit" className="bg-primary-500 text-white px-4 rounded-xl text-sm font-medium">Git</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

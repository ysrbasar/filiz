import type { Metadata } from 'next'
import { QRScanner } from '@/components/qr/QRScanner'

export const metadata: Metadata = {
  title: 'QR Kod Tara | Filiz',
  description: 'Tohum paketinizdeki QR kodu tarayarak anında rehberinize ulaşın.',
}

export default function QRTaraPage() {
  return <QRScanner />
}

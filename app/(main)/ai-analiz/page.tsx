import type { Metadata } from 'next'
import { AIAnalyzer } from '@/components/ai/AIAnalyzer'

export const metadata: Metadata = {
  title: 'AI Bitki Analizi | Filiz',
  description: 'Bitkinin fotoğrafını çek, yapay zeka hastalık ve sorunları tespit etsin.',
}

export default function AIAnalizPage() {
  return <AIAnalyzer />
}

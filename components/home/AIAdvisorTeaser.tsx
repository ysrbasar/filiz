'use client'

import { useState, useRef } from 'react'
import { Brain, ArrowRight, Leaf, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

const QUICK_QUESTIONS = [
  'Domatesi ne zaman ekmeliyim?',
  'Yapraklar sarardı, ne yapmalıyım?',
  'Balkon için en kolay sebze?',
]

export function AIAdvisorTeaser() {
  const [input, setInput] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function ask(question: string) {
    if (!question.trim()) return
    setLoading(true)
    setReply('')
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      })
      const data = await res.json()
      setReply(data.reply ?? 'Yanıt alınamadı.')
    } catch {
      setReply('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  function handleQuick(q: string) {
    setInput(q)
    ask(q)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary-50 to-earth-100 rounded-3xl p-8 md:p-12 border border-primary-100 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-6 shadow-filiz">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-text-primary mb-3">
            Yapay Zeka Bitki Danışmanı
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto mb-8">
            Bitkinin hastalığını analiz et, ekim takvimi al veya bahçecilik sorularını sor.
            GPT-4 destekli, Türkçe.
          </p>

          {/* Hızlı sorular */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleQuick(q)}
                className="text-sm px-4 py-2 rounded-full bg-white border border-primary-200 text-primary-700 hover:border-primary-400 hover:bg-primary-50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-3 max-w-xl mx-auto">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask(input)}
              placeholder="Bitkini sor... (örn: domatesim neden çatlıyor?)"
              className="flex-1 px-4 py-3 rounded-xl border border-primary-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            />
            <Button
              onClick={() => ask(input)}
              disabled={loading || !input.trim()}
              className="bg-primary-400 hover:bg-primary-500 rounded-xl px-5 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>

          {/* Yanıt */}
          <AnimatePresence>
            {reply && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 max-w-xl mx-auto bg-white rounded-2xl p-5 text-left border border-primary-100 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed">{reply}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-text-secondary mt-4 flex items-center justify-center gap-1">
            <Leaf className="w-3 h-3 text-primary-400" />
            Üyelere saatte 10 ücretsiz analiz
          </p>
        </motion.div>
      </div>
    </section>
  )
}

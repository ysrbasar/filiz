import Link from 'next/link'
import { Leaf } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-earth-100 flex flex-col">
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-primary-600">
          <Leaf className="w-6 h-6" />
          Filiz
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>
      <footer className="p-6 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} Filiz Tarım Teknolojileri
      </footer>
    </div>
  )
}

import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = { title: 'Giriş Yap | Filiz' }

export default function GirisPage() {
  return <LoginForm />
}

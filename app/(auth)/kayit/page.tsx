import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = { title: 'Kayıt Ol | Filiz' }

export default function KayitPage() {
  return <RegisterForm />
}

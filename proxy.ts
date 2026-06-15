import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/bahcem', '/profil', '/odeme']
const ADMIN_ROUTES = ['/admin']

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Session cookie varlığını kontrol et (hafif, edge-safe)
  const sessionCookie =
    req.cookies.get('authjs.session-token') ??
    req.cookies.get('__Secure-authjs.session-token')

  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/giris', req.url))
    }
  }

  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!sessionCookie) {
      return NextResponse.redirect(
        new URL(`/giris?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|public).*)'],
}

import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'

const PROTECTED = ['/recipes/new', '/import']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected =
    PROTECTED.some((p) => pathname.startsWith(p)) ||
    /^\/recipes\/\d+\/edit/.test(pathname)

  if (!isProtected) return NextResponse.next()

  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(req, res, sessionOptions)

  if (!session.isAdmin) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return res
}

export const config = {
  matcher: ['/recipes/:path*', '/import'],
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Navigation({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <header className="no-print bg-white border-b border-cream-300 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-serif text-xl text-stone-800 tracking-wide hover:text-gold transition-colors flex items-baseline gap-2">
            Martinův receptář
            <span className="text-xs text-stone-300 font-sans font-normal">
              v{process.env.NEXT_PUBLIC_APP_VERSION}
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className={`btn-ghost text-sm ${pathname === '/' ? 'bg-cream-200 text-stone-800' : ''}`}
            >
              Recepty
            </Link>
            {isAdmin && (
              <>
                <Link
                  href="/recipes/new"
                  className={`btn-ghost text-sm ${pathname === '/recipes/new' ? 'bg-cream-200 text-stone-800' : ''}`}
                >
                  + Nový recept
                </Link>
                <Link
                  href="/import"
                  className={`btn-ghost text-sm ${pathname === '/import' ? 'bg-cream-200 text-stone-800' : ''}`}
                >
                  Import
                </Link>
                <button onClick={logout} className="btn-ghost text-sm text-stone-400">
                  Odhlásit
                </button>
              </>
            )}
            {!isAdmin && (
              <Link
                href="/login"
                className="btn-ghost text-sm text-stone-400"
              >
                Přihlásit
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

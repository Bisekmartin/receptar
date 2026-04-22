'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'

export default function Navigation({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const { dark, toggle } = useTheme()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <header className="no-print bg-white dark:bg-stone-900 border-b border-cream-300 dark:border-stone-700 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-serif text-xl text-stone-800 dark:text-stone-100 tracking-wide hover:text-gold transition-colors">
            Martinův receptář
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className={`btn-ghost text-sm ${pathname === '/' ? 'bg-cream-200 dark:bg-stone-700 text-stone-800 dark:text-stone-100' : ''}`}
            >
              Recepty
            </Link>
            {isAdmin && (
              <>
                <Link
                  href="/recipes/new"
                  className={`btn-ghost text-sm ${pathname === '/recipes/new' ? 'bg-cream-200 dark:bg-stone-700 text-stone-800 dark:text-stone-100' : ''}`}
                >
                  + Nový recept
                </Link>
                <Link
                  href="/import"
                  className={`btn-ghost text-sm ${pathname === '/import' ? 'bg-cream-200 dark:bg-stone-700 text-stone-800 dark:text-stone-100' : ''}`}
                >
                  Import
                </Link>
                <button onClick={logout} className="btn-ghost text-sm text-stone-400 dark:text-stone-500">
                  Odhlásit
                </button>
              </>
            )}
            {!isAdmin && (
              <Link
                href="/login"
                className="btn-ghost text-sm text-stone-400 dark:text-stone-500"
              >
                Přihlásit
              </Link>
            )}
            <button
              onClick={toggle}
              className="btn-ghost"
              title={dark ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
              aria-label={dark ? 'Světlý režim' : 'Tmavý režim'}
            >
              {dark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { isAdmin } from '@/lib/auth'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Martinův receptář',
  description: 'Osobní receptář oblíbených receptů',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin()

  return (
    <html lang="cs" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-cream-100">
        <Navigation isAdmin={admin} />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ThemeProvider from '@/components/ThemeProvider'
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
    <html lang="cs" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `try{const s=localStorage.getItem('theme');const p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(s===null&&p))document.documentElement.classList.add('dark')}catch(e){}`
        }} />
      </head>
      <body className="min-h-screen bg-cream-100 dark:bg-stone-900 flex flex-col">
        <ThemeProvider>
          <Navigation isAdmin={admin} />
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

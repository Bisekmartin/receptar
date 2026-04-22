export default function Footer() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION

  return (
    <footer className="no-print bg-white dark:bg-stone-900 border-t border-cream-300 dark:border-stone-700 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-stone-400 dark:text-stone-500">
          <span className="font-serif text-stone-600 dark:text-stone-400">Martinův receptář</span>
          <span>Vytvořeno s láskou v Praze</span>
          <div className="flex items-center gap-3">
            {version && <span>v{version}</span>}
            <span>© {new Date().getFullYear()} Martin</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import RecipeForm from '@/components/RecipeForm'
import Link from 'next/link'

type Step = 'choose' | 'form'
type Method = 'url' | 'file'

interface ImportedData {
  title: string
  ingredients: string
  instructions: string
}

export default function ImportPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('choose')
  const [method, setMethod] = useState<Method>('url')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imported, setImported] = useState<ImportedData | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleImport() {
    setError('')
    setLoading(true)
    try {
      let data: ImportedData

      if (method === 'url') {
        if (!url.trim()) { setError('Zadejte URL adresu.'); setLoading(false); return }
        const res = await fetch('/api/import/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        })
        if (!res.ok) throw new Error((await res.json()).error)
        data = await res.json()
      } else {
        if (!file) { setError('Vyberte soubor.'); setLoading(false); return }
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/import/file', { method: 'POST', body: fd })
        if (!res.ok) throw new Error((await res.json()).error)
        data = await res.json()
      }

      setImported(data)
      setStep('form')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import se nezdařil.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'form' && imported) {
    return (
      <div className="max-w-2xl">
        <div className="mb-8">
          <button onClick={() => setStep('choose')} className="text-sm text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 mb-4 inline-block">
            ← Zpět na import
          </button>
          <h1 className="font-serif text-3xl text-stone-800 dark:text-stone-100 mb-2">Zkontrolujte recept</h1>
          <p className="text-stone-400 dark:text-stone-500 text-sm">
            Aplikace se pokusila rozpoznat recept automaticky. Zkontrolujte a případně upravte před uložením.
          </p>
        </div>

        {(!imported.title && !imported.ingredients && !imported.instructions) && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300 text-sm">
            Automatické rozpoznání se nepodařilo. Vyplňte recept ručně.
          </div>
        )}

        <div className="card p-6 sm:p-8">
          <RecipeForm initial={imported} />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 mb-4 inline-block">
          ← Zpět na recepty
        </Link>
        <h1 className="font-serif text-3xl text-stone-800 dark:text-stone-100 mb-2">Import receptu</h1>
        <p className="text-stone-400 dark:text-stone-500 text-sm">
          Importujte recept z webové stránky, fotky nebo PDF souboru.
        </p>
      </div>

      <div className="card p-6 sm:p-8 space-y-6">
        {/* Method selector */}
        <div className="flex gap-2 p-1 bg-cream-200 dark:bg-stone-700 rounded-lg">
          {([
            { key: 'url', label: '🌐 Z URL adresy' },
            { key: 'file', label: '📄 Z fotky / PDF' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setMethod(key); setError('') }}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                method === key ? 'bg-white dark:bg-stone-600 shadow-sm text-stone-800 dark:text-stone-100' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* URL input */}
        {method === 'url' && (
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              URL adresa receptu
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.example.cz/recept/svickova"
              className="input-field"
              onKeyDown={(e) => e.key === 'Enter' && handleImport()}
            />
            <p className="mt-2 text-xs text-stone-400 dark:text-stone-500">
              Funguje nejlépe na stránkách s označením receptu dle standardu schema.org (např. Recepty.cz, Toprecepty.cz, Kupi.cz a další).
            </p>
          </div>
        )}

        {/* File input */}
        {method === 'file' && (
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              Soubor
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-cream-300 dark:border-stone-600 rounded-lg p-8 text-center cursor-pointer hover:border-gold hover:bg-cream-50 dark:hover:bg-stone-700/50 transition-all"
            >
              {file ? (
                <p className="text-stone-700 dark:text-stone-200 font-medium">{file.name}</p>
              ) : (
                <>
                  <p className="text-stone-400 dark:text-stone-500 mb-1">Klikněte pro výběr souboru</p>
                  <p className="text-xs text-stone-300 dark:text-stone-600">PDF, JPG, PNG</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <p className="mt-2 text-xs text-stone-400 dark:text-stone-500">
              <strong>PDF:</strong> extrahuje text. <strong>Fotka:</strong> rozpoznání textu pomocí OCR (lokální, bez internetu).
              Přesnost závisí na kvalitě předlohy.
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? 'Zpracovávám…' : 'Importovat recept'}
        </button>
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-cream-200 dark:bg-stone-800 rounded-xl text-sm text-stone-500 dark:text-stone-400 space-y-1">
        <p className="font-medium text-stone-600 dark:text-stone-300">Jak import funguje?</p>
        <p>Aplikace se pokusí automaticky rozpoznat název, suroviny a postup. Výsledek si pak zkontrolujete a upravíte před uložením.</p>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RecipeFormData {
  title: string
  ingredients: string
  instructions: string
  category: string
  favorite: boolean
}

interface Props {
  initial?: Partial<RecipeFormData>
  recipeId?: number
  onCancel?: () => void
}

const EMPTY: RecipeFormData = {
  title: '',
  ingredients: '',
  instructions: '',
  category: 'vareni',
  favorite: false,
}

export default function RecipeForm({ initial = {}, recipeId, onCancel }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<RecipeFormData>({ ...EMPTY, ...initial })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isEdit = !!recipeId

  function set(field: keyof RecipeFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Zadejte prosím název receptu.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const url = isEdit ? `/api/recipes/${recipeId}` : '/api/recipes'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      router.push(`/recipes/${data.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se uložit recept.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Název receptu</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Např. Svíčková na smetaně"
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Kategorie</label>
        <div className="flex gap-3">
          {[
            { value: 'vareni', label: 'Vaření' },
            { value: 'peceni', label: 'Pečení' },
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={value}
                checked={form.category === value}
                onChange={() => set('category', value)}
                className="accent-gold"
              />
              <span className="text-sm text-stone-700 dark:text-stone-300">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
          Suroviny
          <span className="text-stone-400 dark:text-stone-500 font-normal ml-1">(každá surovina na nový řádek)</span>
        </label>
        <textarea
          value={form.ingredients}
          onChange={(e) => set('ingredients', e.target.value)}
          placeholder={'200 g mouky\n3 vejce\n100 ml mléka'}
          className="input-field min-h-[140px] resize-y font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Postup</label>
        <textarea
          value={form.instructions}
          onChange={(e) => set('instructions', e.target.value)}
          placeholder="Popište jednotlivé kroky přípravy…"
          className="input-field min-h-[220px] resize-y"
        />
      </div>

      <div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.favorite}
            onChange={(e) => set('favorite', e.target.checked)}
            className="w-4 h-4 accent-gold"
          />
          <span className="text-sm text-stone-700 dark:text-stone-300">Označit jako oblíbený</span>
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Ukládám…' : isEdit ? 'Uložit změny' : 'Vytvořit recept'}
        </button>
        <button
          type="button"
          onClick={onCancel ?? (() => router.back())}
          className="btn-secondary"
        >
          Zrušit
        </button>
      </div>
    </form>
  )
}

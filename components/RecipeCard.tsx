'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Recipe {
  id: number
  title: string
  category: string
  favorite: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  vareni: 'Vaření',
  peceni: 'Pečení',
}

export default function RecipeCard({ recipe, isAdmin, onFavoriteToggle }: {
  recipe: Recipe
  isAdmin: boolean
  onFavoriteToggle: (id: number, value: boolean) => void
}) {
  const [loading, setLoading] = useState(false)

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch(`/api/recipes/${recipe.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: !recipe.favorite }),
      })
      onFavoriteToggle(recipe.id, !recipe.favorite)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Link href={`/recipes/${recipe.id}`} className="block card hover:shadow-card-hover group">
      <div className="p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-block shrink-0 text-xs px-2.5 py-1 rounded-full bg-cream-200 text-stone-600 font-medium">
            {CATEGORY_LABELS[recipe.category] ?? recipe.category}
          </span>
          <h2 className="font-serif text-base text-stone-800 leading-snug group-hover:text-gold transition-colors truncate">
            {recipe.title}
          </h2>
        </div>

        {isAdmin ? (
          <button
            onClick={toggleFavorite}
            disabled={loading}
            className="shrink-0 text-xl transition-all hover:scale-110 active:scale-95"
            title={recipe.favorite ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
            aria-label={recipe.favorite ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
          >
            {recipe.favorite ? '★' : '☆'}
          </button>
        ) : recipe.favorite ? (
          <span className="shrink-0 text-xl text-gold">★</span>
        ) : null}
      </div>
    </Link>
  )
}

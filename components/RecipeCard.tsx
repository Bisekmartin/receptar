'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Recipe {
  id: number
  title: string
  category: string
  favorite: boolean
}

const CATEGORY_ICONS: Record<string, { icon: string; label: string }> = {
  vareni: { icon: '🍽️', label: 'Vaření' },
  peceni: { icon: '🥐', label: 'Pečení' },
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
          <span
            className="shrink-0 text-lg leading-none"
            title={CATEGORY_ICONS[recipe.category]?.label ?? recipe.category}
          >
            {CATEGORY_ICONS[recipe.category]?.icon ?? '🍽'}
          </span>
          <h2 className="font-serif text-base text-stone-800 dark:text-stone-200 leading-snug group-hover:text-gold transition-colors truncate">
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

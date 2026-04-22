'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RecipeActions({ recipeId, favorite }: { recipeId: number; favorite: boolean }) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(favorite)
  const [deleting, setDeleting] = useState(false)

  async function toggleFavorite() {
    const newVal = !isFavorite
    setIsFavorite(newVal)
    await fetch(`/api/recipes/${recipeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorite: newVal }),
    })
    router.refresh()
  }

  async function deleteRecipe() {
    if (!confirm('Opravdu chcete tento recept smazat?')) return
    setDeleting(true)
    await fetch(`/api/recipes/${recipeId}`, { method: 'DELETE' })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleFavorite}
        className="btn-ghost"
        title={isFavorite ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
      >
        {isFavorite ? '★' : '☆'} {isFavorite ? 'Oblíbený' : 'Oblíbit'}
      </button>
      <Link href={`/recipes/${recipeId}/edit`} className="btn-secondary">
        Upravit
      </Link>
      <button
        onClick={deleteRecipe}
        disabled={deleting}
        className="btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
      >
        {deleting ? 'Mažu…' : 'Smazat'}
      </button>
    </div>
  )
}

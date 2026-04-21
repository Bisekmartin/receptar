'use client'

import { useState, useMemo } from 'react'
import RecipeCard from './RecipeCard'

interface Recipe {
  id: number
  title: string
  category: string
  favorite: boolean
  ingredients: string
  instructions: string
}

export default function RecipeList({ initialRecipes, isAdmin }: { initialRecipes: Recipe[]; isAdmin: boolean }) {
  const [recipes, setRecipes] = useState(initialRecipes)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('vse')
  const [onlyFavorites, setOnlyFavorites] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return recipes.filter((r) => {
      if (category !== 'vse' && r.category !== category) return false
      if (onlyFavorites && !r.favorite) return false
      if (q) {
        const hay = `${r.title} ${r.ingredients} ${r.instructions}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [recipes, search, category, onlyFavorites])

  function handleFavoriteToggle(id: number, value: boolean) {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, favorite: value } : r)))
  }

  return (
    <div>
      {/* Filters */}
      <div className="no-print flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="search"
          placeholder="Hledat v receptech…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field flex-1"
        />
        <div className="flex gap-2">
          {(['vse', 'vareni', 'peceni'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2.5 text-sm rounded-lg border font-medium transition-all duration-200 ${
                category === cat
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-white text-stone-600 border-cream-300 hover:bg-cream-100'
              }`}
            >
              {cat === 'vse' ? 'Vše' : cat === 'vareni' ? 'Vaření' : 'Pečení'}
            </button>
          ))}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-4 py-2.5 text-sm rounded-lg border font-medium transition-all duration-200 ${
              onlyFavorites
                ? 'bg-gold text-white border-gold'
                : 'bg-white text-stone-600 border-cream-300 hover:bg-cream-100'
            }`}
          >
            ★ Oblíbené
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="no-print text-sm text-stone-400 mb-4">
        {filtered.length === 0
          ? 'Žádné recepty nenalezeny'
          : `${filtered.length} ${filtered.length === 1 ? 'recept' : filtered.length < 5 ? 'recepty' : 'receptů'}`}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isAdmin={isAdmin}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-stone-400">
          <p className="font-serif text-2xl mb-2">Nic tu není</p>
          <p className="text-sm">Zkuste změnit filtr nebo přidejte nový recept.</p>
        </div>
      )}
    </div>
  )
}

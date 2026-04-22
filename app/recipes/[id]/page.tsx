import { prisma } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RecipeActions from './RecipeActions'
import PrintButton from '@/components/PrintButton'

export const dynamic = 'force-dynamic'

const CATEGORY_LABELS: Record<string, string> = {
  vareni: 'Vaření',
  peceni: 'Pečení',
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = parseInt(idStr)
  if (isNaN(id)) notFound()

  const [recipe, admin] = await Promise.all([
    prisma.recipe.findUnique({ where: { id } }),
    isAdmin(),
  ])
  if (!recipe) notFound()

  const ingredients = recipe.ingredients.split('\n').filter(Boolean)
  const instructionParagraphs = recipe.instructions.split(/\n\n+/).filter(Boolean)

  return (
    <div className="max-w-2xl">
      {/* Back + actions */}
      <div className="no-print flex items-center justify-between mb-6">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 transition-colors">
          ← Zpět na recepty
        </Link>
        {admin && <RecipeActions recipeId={recipe.id} favorite={recipe.favorite} />}
      </div>

      {/* Header */}
      <div className="mb-8 print-content">
        <div className="flex items-start gap-3 mb-3">
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-800 dark:text-stone-100 leading-tight flex-1">
            {recipe.title}
          </h1>
          {recipe.favorite && (
            <span className="text-2xl mt-1" title="Oblíbený recept">★</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-cream-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-medium">
            {CATEGORY_LABELS[recipe.category] ?? recipe.category}
          </span>
          {recipe.favorite && (
            <span className="text-xs text-gold font-medium">Oblíbený recept</span>
          )}
        </div>
      </div>

      <div className="space-y-8 print-content">
        {/* Ingredients */}
        <section className="card p-6">
          <h2 className="font-serif text-xl text-stone-700 dark:text-stone-300 mb-4">Suroviny</h2>
          {ingredients.length > 0 ? (
            <ul className="space-y-2">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex items-baseline gap-2 text-stone-700 dark:text-stone-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-2" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-stone-400 dark:text-stone-500 text-sm italic">Suroviny nejsou uvedeny.</p>
          )}
        </section>

        {/* Instructions */}
        <section className="card p-6">
          <h2 className="font-serif text-xl text-stone-700 dark:text-stone-300 mb-4">Postup</h2>
          {instructionParagraphs.length > 0 ? (
            <div className="space-y-4">
              {instructionParagraphs.map((para, i) => (
                <p key={i} className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-stone-400 dark:text-stone-500 text-sm italic">Postup není uveden.</p>
          )}
        </section>
      </div>

      {/* Print button */}
      <div className="no-print mt-8">
        <PrintButton />
      </div>
    </div>
  )
}

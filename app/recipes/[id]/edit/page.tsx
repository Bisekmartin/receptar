import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import RecipeForm from '@/components/RecipeForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params
  const id = parseInt(idStr)
  if (isNaN(id)) notFound()

  const recipe = await prisma.recipe.findUnique({ where: { id } })
  if (!recipe) notFound()

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link
          href={`/recipes/${id}`}
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-4 inline-block"
        >
          ← Zpět na recept
        </Link>
        <h1 className="font-serif text-3xl text-stone-800">Upravit recept</h1>
      </div>

      <div className="card p-6 sm:p-8">
        <RecipeForm
          recipeId={recipe.id}
          initial={{
            title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            category: recipe.category,
            favorite: recipe.favorite,
          }}
        />
      </div>
    </div>
  )
}

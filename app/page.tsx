import { prisma } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import RecipeList from '@/components/RecipeList'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [recipes, admin] = await Promise.all([
    prisma.recipe.findMany({
      orderBy: [{ favorite: 'desc' }, { updatedAt: 'desc' }],
      select: { id: true, title: true, category: true, favorite: true, instructions: true },
    }),
    isAdmin(),
  ])

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-800 dark:text-stone-100 mb-1">Recepty</h1>
          <p className="text-stone-400 dark:text-stone-500 text-sm">
            {recipes.length === 0
              ? 'Zatím žádné recepty'
              : `${recipes.length} ${recipes.length === 1 ? 'recept' : recipes.length < 5 ? 'recepty' : 'receptů'} celkem`}
          </p>
        </div>
        {admin && (
          <Link href="/recipes/new" className="btn-primary no-print">
            + Nový recept
          </Link>
        )}
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-serif text-3xl text-stone-300 dark:text-stone-600 mb-4">Receptář je prázdný</p>
          {admin ? (
            <>
              <p className="text-stone-400 dark:text-stone-500 mb-8">Začněte přidáním prvního receptu nebo importem.</p>
              <div className="flex justify-center gap-3">
                <Link href="/recipes/new" className="btn-primary">Přidat recept</Link>
                <Link href="/import" className="btn-secondary">Import receptu</Link>
              </div>
            </>
          ) : (
            <p className="text-stone-400 dark:text-stone-500">Zatím tu nejsou žádné recepty.</p>
          )}
        </div>
      ) : (
        <RecipeList initialRecipes={recipes} isAdmin={admin} />
      )}
    </div>
  )
}

import RecipeForm from '@/components/RecipeForm'
import Link from 'next/link'

export default function NewRecipePage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-4 inline-block">
          ← Zpět na recepty
        </Link>
        <h1 className="font-serif text-3xl text-stone-800">Nový recept</h1>
      </div>

      <div className="card p-6 sm:p-8">
        <RecipeForm />
      </div>
    </div>
  )
}

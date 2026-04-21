import { prisma } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const favOnly = searchParams.get('favorite') === '1'

  const where: Record<string, unknown> = {}
  if (category) where.category = category
  if (favOnly) where.favorite = true
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { ingredients: { contains: q } },
      { instructions: { contains: q } },
    ]
  }

  const recipes = await prisma.recipe.findMany({
    where,
    orderBy: [{ favorite: 'desc' }, { updatedAt: 'desc' }],
  })
  return NextResponse.json(recipes)
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 })
  const body = await req.json()
  const { title, ingredients, instructions, category, favorite } = body

  if (!title?.trim()) {
    return NextResponse.json({ error: 'Název je povinný' }, { status: 400 })
  }

  const recipe = await prisma.recipe.create({
    data: {
      title: title.trim(),
      ingredients: (ingredients ?? '').trim(),
      instructions: (instructions ?? '').trim(),
      category: category ?? 'vareni',
      favorite: favorite ?? false,
    },
  })
  return NextResponse.json(recipe, { status: 201 })
}

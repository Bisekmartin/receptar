import { prisma } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

async function parseId(params: Promise<{ id: string }>) {
  const { id } = await params
  const n = parseInt(id)
  return isNaN(n) ? null : n
}

export async function GET(_req: NextRequest, { params }: Params) {
  const id = await parseId(params)
  if (!id) return NextResponse.json({ error: 'Neplatné ID' }, { status: 400 })

  const recipe = await prisma.recipe.findUnique({ where: { id } })
  if (!recipe) return NextResponse.json({ error: 'Nenalezeno' }, { status: 404 })
  return NextResponse.json(recipe)
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 })

  const id = await parseId(params)
  if (!id) return NextResponse.json({ error: 'Neplatné ID' }, { status: 400 })

  const body = await req.json()
  const { title, ingredients, instructions, category, favorite } = body

  if (!title?.trim()) {
    return NextResponse.json({ error: 'Název je povinný' }, { status: 400 })
  }

  const recipe = await prisma.recipe.update({
    where: { id },
    data: {
      title: title.trim(),
      ingredients: (ingredients ?? '').trim(),
      instructions: (instructions ?? '').trim(),
      category: category ?? 'vareni',
      favorite: favorite ?? false,
    },
  })
  return NextResponse.json(recipe)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 })

  const id = await parseId(params)
  if (!id) return NextResponse.json({ error: 'Neplatné ID' }, { status: 400 })

  const body = await req.json()
  const recipe = await prisma.recipe.update({
    where: { id },
    data: body,
  })
  return NextResponse.json(recipe)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 })

  const id = await parseId(params)
  if (!id) return NextResponse.json({ error: 'Neplatné ID' }, { status: 400 })

  await prisma.recipe.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

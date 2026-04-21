import { importFromUrl } from '@/lib/import/url'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'URL je povinná' }, { status: 400 })

  try {
    const result = await importFromUrl(url)
    return NextResponse.json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Nepodařilo se načíst stránku'
    return NextResponse.json({ error: msg }, { status: 422 })
  }
}

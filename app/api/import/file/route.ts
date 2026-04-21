import { importFromPdf } from '@/lib/import/pdf'
import { importFromImage } from '@/lib/import/image'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) return NextResponse.json({ error: 'Soubor nebyl nahrán' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const mimeType = file.type

  try {
    if (mimeType === 'application/pdf') {
      const result = await importFromPdf(buffer)
      return NextResponse.json(result)
    }

    if (mimeType.startsWith('image/')) {
      const result = await importFromImage(buffer, mimeType)
      return NextResponse.json(result)
    }

    return NextResponse.json(
      { error: 'Nepodporovaný typ souboru. Nahrajte PDF nebo obrázek (JPG, PNG).' },
      { status: 400 }
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Nepodařilo se zpracovat soubor'
    return NextResponse.json({ error: msg }, { status: 422 })
  }
}

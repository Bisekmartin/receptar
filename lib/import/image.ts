import { ImportedRecipe } from './url'
import { parseRecipeText } from './pdf'

export async function importFromImage(buffer: Buffer, mimeType: string): Promise<ImportedRecipe> {
  const Tesseract = await import('tesseract.js')

  const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`

  const result = await Tesseract.recognize(base64, 'ces+eng', {
    logger: () => {},
  })

  const text = result.data.text
  return parseRecipeText(text)
}

import { ImportedRecipe } from './url'

export async function importFromPdf(buffer: Buffer): Promise<ImportedRecipe> {
  const pdfParse = (await import('pdf-parse')).default
  const data = await pdfParse(buffer)
  return parseRecipeText(data.text)
}

export function parseRecipeText(text: string): ImportedRecipe {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return { title: '', ingredients: '', instructions: '' }

  const title = lines[0]

  // Hledáme sekci surovin
  const ingredientKeywords = /surovin|ingredien|potřebuj|ingredient/i
  const instructionKeywords = /postup|příprav|návod|instrukc|způsob|direction|instruction/i

  let ingredientsStart = -1
  let instructionsStart = -1

  for (let i = 1; i < lines.length; i++) {
    if (ingredientsStart === -1 && ingredientKeywords.test(lines[i])) {
      ingredientsStart = i + 1
    }
    if (instructionKeywords.test(lines[i])) {
      instructionsStart = i + 1
      break
    }
  }

  let ingredients = ''
  let instructions = ''

  if (ingredientsStart > 0 && instructionsStart > ingredientsStart) {
    ingredients = lines.slice(ingredientsStart, instructionsStart - 1).join('\n')
    instructions = lines.slice(instructionsStart).join('\n\n')
  } else if (instructionsStart > 0) {
    instructions = lines.slice(instructionsStart).join('\n\n')
  } else {
    // Bez jasné struktury — dáme vše do postupu
    instructions = lines.slice(1).join('\n\n')
  }

  return { title, ingredients, instructions }
}

import * as cheerio from 'cheerio'

export interface ImportedRecipe {
  title: string
  ingredients: string
  instructions: string
}

export async function importFromUrl(url: string): Promise<ImportedRecipe> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RecipeCatalog/1.0)' },
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  return parseRecipeHtml(html)
}

function parseRecipeHtml(html: string): ImportedRecipe {
  const $ = cheerio.load(html)

  // Try schema.org JSON-LD first (most modern recipe sites)
  const jsonLdResult = tryJsonLd($)
  if (jsonLdResult) return jsonLdResult

  // Fallback: heuristic HTML parsing
  return tryHeuristic($)
}

function tryJsonLd($: cheerio.CheerioAPI): ImportedRecipe | null {
  let result: ImportedRecipe | null = null

  $('script[type="application/ld+json"]').each((_, el) => {
    if (result) return
    try {
      const raw = $(el).html() || ''
      const data = JSON.parse(raw)
      const recipe = findRecipeSchema(data)
      if (!recipe) return

      const title = recipe.name || ''
      const ingredients = extractIngredients(recipe)
      const instructions = extractInstructions(recipe)

      if (title || ingredients || instructions) {
        result = { title, ingredients, instructions }
      }
    } catch {}
  })

  return result
}

function findRecipeSchema(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== 'object') return null
  const obj = data as Record<string, unknown>
  if (obj['@type'] === 'Recipe') return obj
  if (Array.isArray(obj['@graph'])) {
    for (const item of obj['@graph'] as unknown[]) {
      const found = findRecipeSchema(item)
      if (found) return found
    }
  }
  return null
}

function extractIngredients(recipe: Record<string, unknown>): string {
  const raw = recipe.recipeIngredient
  if (Array.isArray(raw)) return (raw as string[]).join('\n')
  if (typeof raw === 'string') return raw
  return ''
}

function extractInstructions(recipe: Record<string, unknown>): string {
  const raw = recipe.recipeInstructions
  if (!raw) return ''
  if (typeof raw === 'string') return raw
  if (Array.isArray(raw)) {
    return (raw as Array<string | Record<string, unknown>>)
      .map((step) => {
        if (typeof step === 'string') return step
        if (typeof step === 'object' && step !== null) {
          return (step as Record<string, unknown>).text as string || ''
        }
        return ''
      })
      .filter(Boolean)
      .join('\n\n')
  }
  return ''
}

function tryHeuristic($: cheerio.CheerioAPI): ImportedRecipe {
  const title =
    $('h1.recipe-title, h1.entry-title, [class*="recipe-title"], [class*="recipe-name"]').first().text().trim() ||
    $('h1').first().text().trim()

  const ingredientSelectors = [
    '[class*="ingredient"]',
    '[class*="ingredients"] li',
    '.recipe-ingredients li',
  ]
  let ingredients = ''
  for (const sel of ingredientSelectors) {
    const els = $(sel)
    if (els.length > 0) {
      ingredients = els.map((_, el) => $(el).text().trim()).get().filter(Boolean).join('\n')
      break
    }
  }

  const instructionSelectors = [
    '[class*="instruction"] li',
    '[class*="direction"] li',
    '[class*="step"]',
    '.recipe-instructions p',
  ]
  let instructions = ''
  for (const sel of instructionSelectors) {
    const els = $(sel)
    if (els.length > 0) {
      instructions = els.map((_, el) => $(el).text().trim()).get().filter(Boolean).join('\n\n')
      break
    }
  }

  return { title, ingredients, instructions }
}

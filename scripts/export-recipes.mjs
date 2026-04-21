// Skript pro export receptů z lokální SQLite do PostgreSQL (Railway)
// Spuštění: node scripts/export-recipes.mjs

import { DatabaseSync } from 'node:sqlite'
import { existsSync } from 'node:fs'

const dbPath = './prisma/dev.db'

if (!existsSync(dbPath)) {
  console.error('Databáze nenalezena:', dbPath)
  process.exit(1)
}

const db = new DatabaseSync(dbPath)
const recipes = db.prepare('SELECT * FROM Recipe').all()

if (recipes.length === 0) {
  console.log('Žádné recepty k exportu.')
  process.exit(0)
}

console.log(`-- Export ${recipes.length} receptů`)
console.log()

for (const r of recipes) {
  const escape = (s) => (s ?? '').replace(/'/g, "''").replace(/\\/g, '\\\\')
  const createdAt = new Date(r.createdAt).toISOString()
  const updatedAt = new Date(r.updatedAt).toISOString()

  console.log(
    `INSERT INTO "Recipe" ("title","ingredients","instructions","category","favorite","createdAt","updatedAt") VALUES ` +
    `('${escape(r.title)}','${escape(r.ingredients)}','${escape(r.instructions)}','${r.category}',${r.favorite ? 'true' : 'false'},'${createdAt}','${updatedAt}');`
  )
}

db.close()

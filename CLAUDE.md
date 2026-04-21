# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server at http://localhost:3000
npm run build        # Production build
npm run db:push      # Create/sync SQLite database from Prisma schema
npm run db:studio    # Open Prisma Studio (visual DB browser)
```

First-time setup: `npm install && npm run db:push && npm run dev`

## Architecture

**Stack:** Next.js 14 App Router + Prisma + SQLite + Tailwind CSS

### Data layer
- Single model: `Recipe` (id, title, ingredients, instructions, category, favorite, timestamps)
- `category` is a plain string: `"vareni"` or `"peceni"` (not a DB enum — SQLite limitation)
- DB file: `prisma/dev.db` — single file, copy to backup
- Prisma client singleton in `lib/db.ts` (global cache prevents hot-reload connection leaks)

### API routes (`app/api/`)
- `GET/POST /api/recipes` — list with optional `?q=`, `?category=`, `?favorite=1` filters; create
- `GET/PUT/PATCH/DELETE /api/recipes/[id]` — PATCH is for partial updates (e.g. toggling favorite)
- `POST /api/import/url` — fetches URL, parses schema.org JSON-LD first, falls back to HTML heuristics
- `POST /api/import/file` — accepts multipart form with `file` field; routes to PDF or image handler by MIME type

### Import pipeline (`lib/import/`)
- `url.ts` → `importFromUrl()`: tries `<script type="application/ld+json">` with schema.org Recipe first; heuristic CSS selectors as fallback
- `pdf.ts` → `importFromPdf()`: uses `pdf-parse`; `parseRecipeText()` splits text by keyword headers (surovin/postup)
- `image.ts` → `importFromImage()`: uses `tesseract.js` with `ces+eng` languages; result passed to `parseRecipeText()`
- All importers return `{ title, ingredients, instructions }` — the UI always shows an editable form before saving

### Pages
- `/` — server component, fetches all recipes, passes to `RecipeList` client component (handles search/filter in-memory)
- `/recipes/[id]` — server component; `RecipeActions.tsx` is a co-located client component for favorite toggle + delete
- `/recipes/new` and `/recipes/[id]/edit` — both use `RecipeForm` component; edit mode detected via `recipeId` prop
- `/import` — fully client-side; two-step flow: method selection → prefilled RecipeForm

### Styling
- Custom design tokens in `tailwind.config.ts`: `cream-*` palette, `gold` accent (#9B7E46), `card` shadow utilities
- CSS classes: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.input-field`, `.card` defined in `globals.css`
- Fonts: Playfair Display (headings) + Inter (body) via `next/font/google`, injected as CSS variables
- Print: `.no-print` hides UI chrome; `.print-content` is the visible area — no separate print route needed

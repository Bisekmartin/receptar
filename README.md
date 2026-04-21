# Martinův receptář

Osobní webová aplikace pro správu oblíbených receptů. Běží lokálně, data jsou uložena v SQLite databázi.

## Spuštění

### Požadavky
- Node.js 18+
- npm nebo yarn

### Instalace a první spuštění

```bash
# Instalace závislostí
npm install

# Vytvoření databáze
npm run db:push

# Spuštění vývojového serveru
npm run dev
```

Aplikace bude dostupná na **http://localhost:3000**

### Správa databáze (volitelné)

```bash
# Vizuální prohlížeč databáze v prohlížeči
npm run db:studio
```

## Funkce

- **Přehled receptů** — seznam s filtrováním (vaření / pečení) a fulltext vyhledáváním
- **Detail receptu** — suroviny, postup, kategorie, oblíbené
- **Přidání a úprava** — formulář, mazání
- **Oblíbené** — označení hvězdičkou, filtr
- **Tisk** — čistá tisková verze bez navigace (tlačítko na stránce receptu)
- **Import z URL** — automatické načtení receptu z webové stránky
- **Import z PDF** — extrakce textu z PDF souboru
- **Import z fotky** — OCR rozpoznávání textu (lokálně, bez internetu)

## Import receptu

### Z URL adresy
1. Přejděte na **Import** v navigaci
2. Vložte URL adresu receptu
3. Aplikace načte stránku a pokusí se rozpoznat název, suroviny a postup
4. Zkontrolujte a upravte předvyplněný formulář
5. Uložte recept

Nejlépe funguje na stránkách, které používají schema.org markup (většina moderních kuchařských webů: Recepty.cz, Toprecepty.cz, Apetit.cz aj.).

### Z PDF souboru
1. Zvolte záložku **Z fotky / PDF**
2. Nahrajte PDF soubor
3. Aplikace extrahuje text a pokusí se ho rozdělit na sekce
4. Upravte a uložte

Nejlépe funguje na PDF s jasně označenými sekcemi „Suroviny" a „Postup".

### Z fotky (OCR)
1. Zvolte záložku **Z fotky / PDF**
2. Nahrajte fotku (JPG, PNG)
3. OCR rozpozná text, výsledek zkontrolujte a uložte

OCR běží lokálně pomocí knihovny Tesseract.js — nepřenáší žádná data na internet. Přesnost závisí na kvalitě fotky.

> **Poznámka:** Import není stoprocentně přesný. Vždy zkontrolujte výsledek před uložením.

## Kde jsou data?

Databáze SQLite se nachází v souboru:
```
prisma/dev.db
```

Soubor obsahuje všechny vaše recepty. Lze ho zálohovat prostým kopírováním.

## Další rozvoj

Možná rozšíření do budoucna:

- **Štítky a tagy** — přidání volných tagů k receptům (rychlé, vegetariánské, …)
- **Fotky receptů** — nahrávání vlastní fotografie k receptu
- **Plánování jídel** — týdenní jídelníček
- **Nákupní seznam** — generování z ingrediencí receptů
- **Sdílení** — export do PDF nebo sdílení přes odkaz
- **Lepší OCR / AI import** — napojení na Claude API pro přesnější rozpoznávání receptů z fotek a PDF
- **Nasazení na server** — přechod na PostgreSQL + deploy (Railway, Fly.io, VPS)

## Tech stack

| Vrstva | Technologie |
|--------|-------------|
| Framework | Next.js 14 (App Router) |
| Databáze | SQLite přes Prisma ORM |
| Styling | Tailwind CSS |
| Import PDF | pdf-parse |
| Import fotky | Tesseract.js (lokální OCR) |
| Import URL | Cheerio (HTML parser) |

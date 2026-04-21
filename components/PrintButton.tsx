'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-ghost text-stone-500"
    >
      🖨 Vytisknout recept
    </button>
  )
}

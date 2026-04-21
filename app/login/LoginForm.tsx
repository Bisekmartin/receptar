'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      const from = searchParams.get('from') || '/'
      router.push(from)
      router.refresh()
    } else {
      setError('Nesprávné heslo.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Heslo</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          autoFocus
          required
        />
      </div>
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        {loading ? 'Přihlašuji…' : 'Přihlásit se'}
      </button>
    </form>
  )
}

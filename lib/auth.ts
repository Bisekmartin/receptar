import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from './session'

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions)
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession()
  return session.isAdmin === true
}

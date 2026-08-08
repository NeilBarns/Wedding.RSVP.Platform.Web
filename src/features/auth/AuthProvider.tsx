import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { getCurrentUser } from './api'
import type { AuthStatus, AuthenticatedUser } from './types'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<AuthenticatedUser | null>(null)

  const refresh = useCallback(async () => {
    setStatus('loading')

    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setStatus('authenticated')
    } catch {
      setUser(null)
      setStatus('unauthenticated')
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadUser() {
      try {
        const currentUser = await getCurrentUser({ signal: controller.signal })
        setUser(currentUser)
        setStatus('authenticated')
      } catch {
        if (controller.signal.aborted) {
          return
        }

        setUser(null)
        setStatus('unauthenticated')
      }
    }

    void loadUser()
    return () => controller.abort()
  }, [])

  return (
    <AuthContext.Provider value={{ status, user, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ApiError } from '../../lib/api'
import { AuthContext } from './AuthContext'
import { getCurrentUser, logoutSession } from './api'
import type { AuthStatus, AuthenticatedUser } from './types'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('initializing')
  const [user, setUser] = useState<AuthenticatedUser | null>(null)

  const refreshAuth = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setStatus('initializing')
    }

    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setStatus('authenticated')
      return currentUser
    } catch (error) {
      setUser(null)
      if (error instanceof ApiError && error.status === 401) {
        setStatus('unauthenticated')
        return null
      }

      setStatus('error')
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutSession()
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        throw error
      }
    }

    setUser(null)
    setStatus('unauthenticated')
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadUser() {
      try {
        const currentUser = await getCurrentUser({ signal: controller.signal })
        setUser(currentUser)
        setStatus('authenticated')
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setUser(null)
        setStatus(
          error instanceof ApiError && error.status === 401
            ? 'unauthenticated'
            : 'error',
        )
      }
    }

    void loadUser()
    return () => controller.abort()
  }, [])

  const value = useMemo(
    () => ({ status, user, refreshAuth, logout }),
    [status, user, refreshAuth, logout],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export type AuthenticatedUser = {
  id: number
  name: string
  email: string
  role: 'owner' | 'administrator'
}

export type AuthStatus =
  | 'initializing'
  | 'authenticated'
  | 'unauthenticated'
  | 'error'

export type AuthState = {
  status: AuthStatus
  user: AuthenticatedUser | null
  refreshAuth: (showLoading?: boolean) => Promise<AuthenticatedUser | null>
  logout: () => Promise<void>
}

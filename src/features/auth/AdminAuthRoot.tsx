import { Outlet } from 'react-router-dom'
import { AuthProvider } from './AuthProvider'

export function AdminAuthRoot() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

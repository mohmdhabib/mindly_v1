import { useAuth } from './AuthWrapper'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
  const { session } = useAuth()

  if (!session) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}

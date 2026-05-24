import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

type ProtectedRouteProps = {
  role?: 'seller' | 'admin'
}

export function ProtectedRoute({ role }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/seller/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
export default ProtectedRoute

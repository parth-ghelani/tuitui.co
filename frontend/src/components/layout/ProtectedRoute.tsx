import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

type ProtectedRouteProps = {
  role?: 'seller' | 'admin'
}

export function ProtectedRoute({ role }: ProtectedRouteProps) {
  const user = useAuthStore((s) => s.user)
  const initializing = useAuthStore((s) => s.initializing)

  // ── Still checking Supabase session — hold, don't bounce ─────────────────
  if (initializing) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-6 w-6 text-charcoal/30"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-[10px] uppercase tracking-[0.25em] text-charcoal/30 font-medium">
            Verifying session…
          </span>
        </div>
      </div>
    )
  }

  // ── Not authenticated ─────────────────────────────────────────────────────
  if (!user) {
    return <Navigate to="/seller/login" replace />
  }

  // ── Wrong role ────────────────────────────────────────────────────────────
  if (role && user.role !== role) {
    // Send admin → /admin, seller → /seller instead of bare /
    return <Navigate to={user.role === 'admin' ? '/admin' : '/seller'} replace />
  }

  return <Outlet />
}

export default ProtectedRoute

import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export interface UserSession {
  id: string
  email: string
  role: 'seller' | 'admin'
}

interface AuthState {
  user: UserSession | null
  // true while the initial session check is in-flight (prevents ProtectedRoute
  // from bouncing to /login before Supabase has had a chance to restore)
  initializing: boolean
  logout: () => Promise<void>
  /** Call once in App — subscribes to Supabase auth state changes forever */
  init: () => () => void
}

// ---------------------------------------------------------------------------
// Role resolver — maps email → app role
// ---------------------------------------------------------------------------
function resolveRole(email: string): UserSession['role'] {
  if (email.trim().toLowerCase() === 'admin@tuitui.co') return 'admin'
  return 'seller'
}

function sessionFromSupabaseUser(
  user: { id: string; email?: string | null } | null
): UserSession | null {
  if (!user?.email) return null
  return { id: user.id, email: user.email, role: resolveRole(user.email) }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true, // start true — flips to false after first auth event

  // ── INIT ─────────────────────────────────────────────────────────────────
  // Subscribes to onAuthStateChange — handles:
  //   • Initial session restore (INITIAL_SESSION event)
  //   • Login  (SIGNED_IN)
  //   • Logout (SIGNED_OUT)
  //   • Token refresh (TOKEN_REFRESHED)
  init: () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        set({
          user: sessionFromSupabaseUser(session?.user ?? null),
          initializing: false,
        })
      }
    )
    // Return the unsubscribe function so App can clean up on unmount
    return () => subscription.unsubscribe()
  },

  // ── LOGOUT ───────────────────────────────────────────────────────────────
  logout: async () => {
    await supabase.auth.signOut()
    // user will be set to null automatically via onAuthStateChange
  },
}))

export default useAuthStore

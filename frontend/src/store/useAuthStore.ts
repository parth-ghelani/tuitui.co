import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export interface UserSession {
  id: string
  email: string
  role: 'seller' | 'admin'
}

interface AuthState {
  user: UserSession | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  restoreSession: () => Promise<void>
}

// ---------------------------------------------------------------------------
// Role resolver — maps email to app role
// ---------------------------------------------------------------------------
function resolveRole(email: string): UserSession['role'] {
  if (email.trim().toLowerCase() === 'admin@tuitui.co') return 'admin'
  return 'seller'
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  // ── RESTORE SESSION ON APP BOOT ──────────────────────────────────────────
  restoreSession: async () => {
    set({ isLoading: true })
    try {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      if (session?.user?.email) {
        const restoredUser: UserSession = {
          id: session.user.id,
          email: session.user.email,
          role: resolveRole(session.user.email),
        }
        set({ user: restoredUser })
      }
    } catch (err) {
      console.warn('[useAuthStore] Failed to restore session:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  // ── LOGIN ────────────────────────────────────────────────────────────────
  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      })

      if (error || !data.user) {
        console.warn('[useAuthStore] Supabase login error:', error?.message)
        set({ isLoading: false })
        return false
      }

      const session: UserSession = {
        id: data.user.id,
        email: data.user.email!,
        role: resolveRole(data.user.email!),
      }

      set({ user: session })
      return true
    } catch (err) {
      console.error('[useAuthStore] Unexpected login error:', err)
      return false
    } finally {
      set({ isLoading: false })
    }
  },

  // ── LOGOUT ───────────────────────────────────────────────────────────────
  logout: async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('[useAuthStore] Logout error:', err)
    } finally {
      set({ user: null })
    }
  },
}))

export default useAuthStore

import { create } from 'zustand'

export interface UserSession {
  id: string
  email: string
  role: 'seller' | 'admin'
}

interface AuthState {
  user: UserSession | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  // Try to load initial session from localStorage
  const savedSession = typeof window !== 'undefined' ? localStorage.getItem('tuitui_session') : null
  const initialUser = savedSession ? JSON.parse(savedSession) : null

  return {
    user: initialUser,
    login: (email, password) => {
      const cleanEmail = email.trim().toLowerCase()
      const cleanPassword = password.trim()

      if (cleanEmail === 'vendor@tuitui.co' && cleanPassword === 'atelier') {
        const session: UserSession = {
          id: 'seller-1',
          email: 'vendor@tuitui.co',
          role: 'seller',
        }
        localStorage.setItem('tuitui_session', JSON.stringify(session))
        set({ user: session })
        return true
      }
      
      if (cleanEmail === 'admin@tuitui.co' && cleanPassword === 'atelier') {
        const session: UserSession = {
          id: 'admin-1',
          email: 'admin@tuitui.co',
          role: 'admin',
        }
        localStorage.setItem('tuitui_session', JSON.stringify(session))
        set({ user: session })
        return true
      }

      return false
    },
    logout: () => {
      localStorage.removeItem('tuitui_session')
      set({ user: null })
    },
  }
})
export default useAuthStore

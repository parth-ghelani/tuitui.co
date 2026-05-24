import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRoutes } from './routes/AppRoutes'
import { useLenis } from './hooks/useLenis'
import { useAuthStore } from './store/useAuthStore'
import { useProductStore } from './store/useProductStore'

const queryClient = new QueryClient()

function AppInner() {
  useLenis()
  const restoreSession = useAuthStore((s) => s.restoreSession)
  const fetchProducts = useProductStore((s) => s.fetchProducts)

  useEffect(() => {
    restoreSession()
    fetchProducts()
  }, [restoreSession, fetchProducts])

  return (
    <>
      <div className="grain" />
      <AppRoutes />
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

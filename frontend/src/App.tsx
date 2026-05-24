import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRoutes } from './routes/AppRoutes'
import { useLenis } from './hooks/useLenis'

const queryClient = new QueryClient()

function App() {
  useLenis()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="grain" />
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

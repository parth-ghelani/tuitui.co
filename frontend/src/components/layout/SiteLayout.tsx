import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { CartDrawer } from './CartDrawer'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { ScrollToHash } from './ScrollToHash'

export function SiteLayout() {
  const { pathname } = useLocation()
  const [cartOpen, setCartOpen] = useState(false)
  const [homePastHero, setHomePastHero] = useState(false)

  useEffect(() => {
    const handleOpenCart = () => setCartOpen(true)
    window.addEventListener('open-cart', handleOpenCart)
    return () => window.removeEventListener('open-cart', handleOpenCart)
  }, [])

  useEffect(() => {
    if (pathname !== '/') return

    const updatePastHero = () => {
      const hasPassed = window.scrollY > window.innerHeight * 0.2
      setHomePastHero((prev) => (prev === hasPassed ? prev : hasPassed))
    }

    updatePastHero()
    window.addEventListener('scroll', updatePastHero, { passive: true })

    return () => {
      window.removeEventListener('scroll', updatePastHero)
    }
  }, [pathname])

  const hideForHeroEntry = pathname === '/' && !homePastHero
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <ScrollToHash />
      <Navbar onCartOpen={() => setCartOpen(true)} hidden={hideForHeroEntry} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className={isHome ? 'pt-0' : 'pt-28'}>
        <Outlet />
      </main>
      <div
        className={`transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          hideForHeroEntry
            ? 'pointer-events-none translate-y-10 opacity-0'
            : 'translate-y-0 opacity-100'
        }`}
      >
        <Footer />
      </div>
    </div>
  )
}

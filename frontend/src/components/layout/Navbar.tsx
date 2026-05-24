import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ShoppingBag, User } from '@phosphor-icons/react'
import logoWordmarkDark from '../../assets/brand/logo-wordmark-dark.png'
import { useAuthStore } from '../../store/useAuthStore'

type NavbarProps = {
  onCartOpen: () => void
  hidden?: boolean
}

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Lookbook', to: '/#lookbook' },
  { label: 'About', to: '/about' },
]

export function Navbar({ onCartOpen, hidden = false }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const user = useAuthStore((state) => state.user)

  return (
    <>
      <nav
        className={`fixed left-1/2 top-6 z-50 w-[min(1200px,92vw)] -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          hidden
            ? 'pointer-events-none -translate-y-3 opacity-0'
            : 'translate-y-0 opacity-100'
        }`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="rounded-full border border-charcoal/10 bg-cream/90 px-6 py-3 shadow-soft backdrop-blur-xl">
          <div className="flex items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logoWordmarkDark}
                alt="The Tuitui Co"
                className="h-8 w-auto"
              />
            </Link>

            <div className="hidden items-center gap-8 text-sm uppercase tracking-[0.3em] text-charcoal/70 md:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    `transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      isActive ? 'text-charcoal' : 'hover:text-charcoal'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={!user ? '/seller/login' : user.role === 'admin' ? '/admin' : '/seller'}
                aria-label={user ? 'Go to dashboard' : 'Sign in'}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/10 bg-white text-charcoal transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-charcoal/30"
              >
                <User size={18} weight="light" />
              </Link>
              <button
                type="button"
                aria-label="Open cart"
                onClick={onCartOpen}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/10 bg-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-charcoal/30"
              >
                <ShoppingBag size={18} weight="light" />
              </button>
              <button
                type="button"
                aria-label="Toggle menu"
                onClick={() => setMenuOpen((open) => !open)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/10 bg-white transition-all duration-500 hover:border-charcoal/30 md:hidden z-50"
              >
                <div className="flex flex-col gap-1 w-4 items-center justify-center">
                  <span className={`h-[1px] w-4 bg-charcoal transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
                  <span className={`h-[1px] w-4 bg-charcoal transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                  <span className={`h-[1px] w-4 bg-charcoal transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-40 bg-[#F8F5F1]/98 flex flex-col justify-between p-8 pt-32 pb-12 font-sans select-none"
          >
            {/* Ambient watermark showcase background crop */}
            <div className="absolute right-4 bottom-24 opacity-[0.04] max-w-[280px] pointer-events-none select-none">
              <img
                src="/images/showcase/Ultra_realistic_faceless_luxury_fashion_202605221051.jpeg"
                alt=""
                className="w-full h-auto object-contain object-right-bottom"
              />
            </div>

            {/* Staggered Navigation links */}
            <div className="flex flex-col gap-6 text-left">
              <span className="text-[10px] uppercase tracking-[0.4em] text-umber font-semibold border-b border-charcoal/10 pb-4 mb-4">
                SS / 2026 Editorial Menu
              </span>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: index * 0.08 }}
                  className="overflow-hidden"
                >
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="font-display font-light text-5xl tracking-wide text-charcoal hover:italic transition-all duration-300 block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom editorial branding data */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="border-t border-charcoal/10 pt-8 flex flex-col gap-4 text-xs font-light text-charcoal/60"
            >
              <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-umber font-semibold">
                <span>The Tuitui Co.</span>
                <span>SS / 26 Udaipur Edition</span>
              </div>
              <p className="leading-relaxed">
                Celebrating raw textures, structured drapes, and a quiet kind of confidence. Hand-woven for everyday ceremony.
              </p>
              <div className="flex gap-6 mt-2 text-[10px] uppercase tracking-wider font-medium text-charcoal">
                <a href="/shop?category=indian" onClick={() => setMenuOpen(false)}>Indian</a>
                <a href="/shop?category=western" onClick={() => setMenuOpen(false)}>Western</a>
                <a href="/#lookbook" onClick={() => setMenuOpen(false)}>Campaigns</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag } from '@phosphor-icons/react'
import logoWordmarkDark from '../../assets/brand/logo-wordmark-dark.png'
import { animate, createTimeline, stagger } from 'animejs'

export function Hero() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // 1. Text reveal timeline on page mount
    createTimeline({ defaults: { ease: 'easeOutExpo' } })
      .add('.hero-fade-in', {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1400,
        delay: stagger(120, { start: 200 })
      })
      .add('.hero-title-char', {
        translateY: [80, 0],
        opacity: [0, 1],
        duration: 1800,
        delay: stagger(80, { start: 300 })
      }, '-=1000')
      .add('.hero-cta', {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1200,
      }, '-=1200')

    // 2. Continuous breathing animation for the background image
    animate('.hero-image-bg', {
      scale: [1.02, 1.05],
      duration: 16000,
      direction: 'alternate',
      loop: true,
      ease: 'easeInOutQuad'
    })

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 3. Smooth mouse-movement parallax (disabled on mobile)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return
    const x = (e.clientX / window.innerWidth - 0.5) * 24
    const y = (e.clientY / window.innerHeight - 0.5) * 24

    animate('.hero-image-bg', {
      translateX: x,
      translateY: y,
      duration: 800,
      ease: 'easeOutQuad'
    })
  }

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-cream text-charcoal select-none flex items-center"
    >
      {/* 1. Header / Editorial Navigation */}
      <header className="absolute top-0 inset-x-0 z-30 pt-8 px-6 sm:px-12 md:px-20 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img
            src={logoWordmarkDark}
            alt="The Tuitui Co"
            className="h-8 w-auto opacity-95 transition-opacity hover:opacity-100"
          />
        </a>

        <nav className="hidden md:flex items-center gap-12 font-sans text-[10px] uppercase tracking-[0.35em] text-charcoal/60">
          <a href="/shop" className="hover:text-charcoal transition-colors duration-300">
            01 / The Atelier
          </a>
          <a href="/#lookbook" className="hover:text-charcoal transition-colors duration-300">
            02 / Campaigns
          </a>
          <a href="/about" className="hover:text-charcoal transition-colors duration-300">
            03 / Editorial
          </a>
        </nav>

        <div className="flex items-center gap-6">
          <span className="hidden sm:inline-block font-sans text-[8px] uppercase tracking-[0.3em] text-umber/80 border border-umber/25 px-3 py-1">
            SS / 2026 EDITION
          </span>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-cart'))}
            className="relative flex items-center justify-center text-charcoal/70 hover:text-charcoal transition-colors duration-300 focus:outline-none"
            aria-label="Open cart"
          >
            <ShoppingBag size={18} weight="light" />
          </button>
        </div>
      </header>

      {/* 2. Fullscreen Background image with mounting frame overlay */}
      <div className="absolute inset-0 z-0 bg-cream overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src="/images/showcase/hero_202605231903.jpeg"
            alt="Cinematic Fashion Hero"
            className="hero-image-bg h-full w-full object-cover filter grayscale-[10%] sepia-[10%] brightness-[92%] contrast-[95%]"
            style={{ objectPosition: isMobile ? '50% center' : '65% center' }}
          />
        </div>

        {/* Ivory gradient overlays: vertical on mobile, horizontal on desktop */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream/20 via-transparent to-cream md:bg-gradient-to-r md:from-cream md:via-cream/80 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-cream/20 md:hidden" />
        <div 
          className="absolute inset-0 mix-blend-multiply opacity-30 pointer-events-none" 
          style={{
            background: 'radial-gradient(circle, transparent 35%, rgba(248, 245, 241, 0.7) 100%)'
          }}
        />
      </div>

      {/* 3. Main Editorial Text Content - Align to bottom on mobile, center on desktop */}
      <div className="w-full mx-auto px-6 sm:px-12 md:px-20 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 items-end md:items-center z-10 pt-28 pb-16 md:pb-0 h-full">
        <div className="flex flex-col justify-end md:justify-center max-w-xl pb-6 md:pb-0">
          <div className="overflow-hidden">
            <span className="hero-fade-in inline-block text-[10px] tracking-[0.35em] uppercase text-umber font-semibold">
              Campaign VI / Udaipur
            </span>
          </div>

          <div className="overflow-hidden mt-3 sm:mt-4">
            <h1 className="hero-title-char font-display font-light text-[clamp(2.2rem,6.5vw,4.5rem)] leading-[1.1] text-charcoal tracking-tight">
              Mewar Monologue
            </h1>
          </div>

          <div className="overflow-hidden mt-1 sm:mt-2">
            <p className="hero-fade-in text-[10px] sm:text-xs tracking-[0.25em] text-charcoal/70 uppercase font-semibold">
              Whispering Silk, Silent Stone.
            </p>
          </div>

          <div className="overflow-hidden mt-4 sm:mt-6">
            <p className="hero-fade-in text-[11px] sm:text-sm leading-relaxed text-charcoal/60 font-light font-sans max-w-md">
              An aesthetic dialogue between Udaipur's historic fortress walls and the fluid grace of modern hand-loomed drapes. Woven in raw tussar silk and structured heritage looms.
            </p>
          </div>

          {/* CTA Link */}
          <div className="mt-8 sm:mt-10 overflow-hidden">
            <button
              onClick={() => navigate('/shop')}
              className="hero-cta inline-block rounded-full bg-charcoal text-cream text-[10px] uppercase tracking-[0.25em] font-medium px-8 py-4 hover:bg-black hover:shadow-lg transition-all duration-500"
            >
              Enter The Atelier
            </button>
          </div>
        </div>
      </div>
      
    </section>
  )
}
export default Hero

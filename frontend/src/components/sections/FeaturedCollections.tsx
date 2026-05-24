import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { animate, createTimeline, stagger } from 'animejs'

export function FeaturedCollections() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null)

  // Reset hover side if we scroll away from Section 4
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setHoverSide(null)
        }
      },
      { threshold: 0 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Cinematic text staggered reveals on scroll entry
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            createTimeline({ defaults: { ease: 'easeOutExpo' } })
              .add('.split-text-reveal-left', {
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 1200,
                delay: stagger(100)
              })
              .add('.split-text-reveal-right', {
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 1200,
                delay: stagger(100)
              }, '-=1000')

            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Smooth flex-grow layouts expansion on hover side transitions
  useEffect(() => {
    if (window.innerWidth < 768) return

    if (hoverSide === 'left') {
      animate('.split-panel-left', {
        flexGrow: 1.35,
        duration: 700,
        ease: 'easeOutCubic'
      })
      animate('.split-panel-right', {
        flexGrow: 0.65,
        duration: 700,
        ease: 'easeOutCubic'
      })
      animate('.split-text-reveal-left', {
        translateY: -12,
        duration: 600,
        ease: 'easeOutQuad'
      })
    } else if (hoverSide === 'right') {
      animate('.split-panel-left', {
        flexGrow: 0.65,
        duration: 700,
        ease: 'easeOutCubic'
      })
      animate('.split-panel-right', {
        flexGrow: 1.35,
        duration: 700,
        ease: 'easeOutCubic'
      })
      animate('.split-text-reveal-right', {
        translateY: -12,
        duration: 600,
        ease: 'easeOutQuad'
      })
    } else {
      // Default baseline
      animate('.split-panel-left, .split-panel-right', {
        flexGrow: 1.0,
        duration: 700,
        ease: 'easeOutCubic'
      })
      animate('.split-text-reveal-left, .split-text-reveal-right', {
        translateY: 0,
        duration: 600,
        ease: 'easeOutQuad'
      })
    }
  }, [hoverSide])

  // Mouse move handler for side selection detection
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    const relativeX = e.clientX - rect.left
    const side = relativeX < rect.width / 2 ? 'left' : 'right'
    
    if (side !== hoverSide) {
      setHoverSide(side)
    }
  }

  return (
    <section 
      ref={sectionRef}
      onMouseLeave={() => setHoverSide(null)}
      onMouseMove={handleMouseMove}
      className="group relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-charcoal select-none flex flex-col md:flex-row cursor-pointer"
      aria-label="Collection Split Banner"
    >
      {/* 1. LEFT SIDE: Indian Collection */}
      <div
        onClick={() => navigate('/shop?category=indian')}
        className="split-panel-left relative flex-[1_1_0%] h-[50svh] md:h-full overflow-hidden border-b md:border-b-0 md:border-r border-gold/20 bg-charcoal"
        style={{ willChange: 'flex-grow' }}
      >
        {/* Background Image: Navratri / Gujarati Editorial Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/showcase/Ultra_realistic_faceless_luxury_fashion_202605221056.jpeg"
            alt="Indian Heritage Collection"
            className="split-image-left h-full w-full object-cover object-center scale-[1.03] filter grayscale-[5%] brightness-[95%] contrast-[96%] transition-transform duration-[2000ms] ease-out group-hover:scale-[1.06]"
            draggable={false}
          />
        </div>
        
        {/* Overlays - Light warm shadow for editorial readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />

        {/* Typography Content */}
        <div className="absolute inset-x-8 bottom-8 sm:inset-x-20 sm:bottom-20 z-20 flex flex-col justify-end text-cream max-w-md pointer-events-none">
          <span className="split-text-reveal-left opacity-0 font-sans text-[10px] tracking-[0.35em] uppercase text-gold font-semibold mb-2">
            04 / The Heritage
          </span>
          <h3 className="split-text-reveal-left opacity-0 font-display font-light text-4xl sm:text-5xl md:text-6xl tracking-wide leading-none">
            The Indian Collection
          </h3>
          <p className="split-text-reveal-left opacity-0 font-sans text-[11px] sm:text-xs leading-relaxed text-cream/70 mt-2 sm:mt-4 font-light tracking-wide">
            Intricate Gujarati embroidery & Navratri styling meets drapes. Structured for everyday ceremonies.
          </p>
          <div className="split-text-reveal-left opacity-0 mt-4 sm:mt-8 flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold border-b border-cream/35 pb-1 group-hover:border-cream transition-colors duration-300">
              Explore Wardrobe
            </span>
            <span className="text-[12px] transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </div>
        </div>
      </div>

      {/* Center Split Divider Glow Line (Desktop only) */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-gold/50 shadow-[0_0_20px_rgba(212,165,116,0.9)] pointer-events-none z-30 transition-all duration-[700ms] ease-out hidden md:block"
        style={{
          left: hoverSide === 'left' ? '67.5%' : hoverSide === 'right' ? '32.5%' : '50%'
        }}
      />

      {/* 2. RIGHT SIDE: Western Collection */}
      <div
        onClick={() => navigate('/shop?category=western')}
        className="split-panel-right relative flex-[1_1_0%] h-[50svh] md:h-full overflow-hidden bg-charcoal"
        style={{ willChange: 'flex-grow' }}
      >
        {/* Background Image: Western Showcase JPEG */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/showcase/western_showcase.jpeg"
            alt="Western Modern Collection"
            className="split-image-right h-full w-full object-cover object-center scale-[1.03] filter grayscale-[5%] brightness-[95%] contrast-[96%] transition-transform duration-[2000ms] ease-out group-hover:scale-[1.06]"
            draggable={false}
          />
        </div>
        
        {/* Overlays - Light warm shadow for editorial readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />

        {/* Typography Content */}
        <div className="absolute right-8 bottom-8 sm:right-20 sm:bottom-20 z-20 flex flex-col justify-end text-cream text-right max-w-md items-end pointer-events-none">
          <span className="split-text-reveal-right opacity-0 font-sans text-[10px] tracking-[0.35em] uppercase text-gold font-semibold mb-2">
            04 / The Modern
          </span>
          <h3 className="split-text-reveal-right opacity-0 font-display font-light text-4xl sm:text-5xl md:text-6xl tracking-wide leading-none">
            The Western Collection
          </h3>
          <p className="split-text-reveal-right opacity-0 font-sans text-[11px] sm:text-xs leading-relaxed text-cream/70 mt-2 sm:mt-4 font-light tracking-wide max-w-sm">
            Architectural silhouettes, premium linen structures, and refined neutral palettes cut for modern styling.
          </p>
          <div className="split-text-reveal-right opacity-0 mt-4 sm:mt-8 flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold border-b border-cream/35 pb-1 group-hover:border-cream transition-colors duration-300">
              Explore Edit
            </span>
            <span className="text-[12px] transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </div>
        </div>
      </div>

      {/* 3. Ambient grain noise layer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay z-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
        }}
      />
    </section>
  )
}
export default FeaturedCollections

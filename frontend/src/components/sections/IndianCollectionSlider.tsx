import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

type Slide = {
  title: string
  subtitle: string
  image: string
  desktopPosition: string
}

const slides: Slide[] = [
  {
    title: 'Maheshwari Silk Campaign',
    subtitle: 'Modern Traditionalism',
    image: '/images/showcase/add_some_natural_light_on_202605211810.jpeg',
    desktopPosition: '60% center',
  },
  {
    title: 'Royal Udaipur Heritage',
    subtitle: 'Luxury Bridal Wear',
    image: '/images/showcase/change_the_clothing_to_the_202605211736.jpeg',
    desktopPosition: '50% center',
  },
  {
    title: 'Mewar Monologue Edition',
    subtitle: 'Handcrafted Atelier Elegance',
    image: '/images/showcase/now_increase_the_quality_of_202605211723.jpeg',
    desktopPosition: '55% center',
  }
]

const slideVariants = {
  enter: {
    opacity: 0,
    y: 20,
    scale: 1.02,
  },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
}

const slideTransition = {
  duration: 1.0,
  ease: [0.76, 0, 0.24, 1] as const
}

export function IndianCollectionSlider() {
  const [index, setIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [cursorSide, setCursorSide] = useState<'PREV' | 'NEXT'>('NEXT')
  const [isHovering, setIsHovering] = useState(false)

  // Hover device detection
  const [isHoverDevice, setIsHoverDevice] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(hover: hover) and (pointer: fine)').matches : false
  )

  const [isMobile, setIsMobile] = useState(false)

  const cursorRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Real mouse positions for custom cursor lerping
  const mouseCoordinates = useRef({ x: 0, y: 0 })
  const cursorCoordinates = useRef({ x: 0, y: 0 })

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const handler = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches)
    mediaQuery.addEventListener('change', handler)

    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      mediaQuery.removeEventListener('change', handler)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Smooth custom cursor follow motion using RequestAnimationFrame and LERP
  useEffect(() => {
    if (!isHoverDevice) return

    let rafId: number

    const updatePosition = () => {
      const lerp = 0.08 // Soft motion delay interpolation
      const curX = cursorCoordinates.current.x
      const curY = cursorCoordinates.current.y
      const targetX = mouseCoordinates.current.x
      const targetY = mouseCoordinates.current.y

      const newX = curX + (targetX - curX) * lerp
      const newY = curY + (targetY - curY) * lerp

      cursorCoordinates.current = { x: newX, y: newY }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`
      }

      rafId = requestAnimationFrame(updatePosition)
    }

    rafId = requestAnimationFrame(updatePosition)

    const handleMouseMoveGlobal = (e: MouseEvent) => {
      mouseCoordinates.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMoveGlobal, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', handleMouseMoveGlobal)
    }
  }, [isHoverDevice])

  // Reset custom cursor hover if we scroll away from Section 3
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsHovering(false)
        }
      },
      { threshold: 0 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const transitionTo = (target: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setIndex(target)
    
    // Auto-reset animating lock after animation completes (1s max duration)
    setTimeout(() => {
      setIsAnimating(false)
    }, 1000)
  }

  const next = () => {
    const target = (index + 1) % slides.length
    transitionTo(target)
  }

  const prev = () => {
    const target = (index - 1 + slides.length) % slides.length
    transitionTo(target)
  }

  // Swipe detection for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) {
      touchStartX.current = touch.clientX
      touchStartY.current = touch.clientY
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    if (touch) {
      const diffX = touchStartX.current - touch.clientX
      const diffY = touchStartY.current - touch.clientY

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          next()
        } else {
          prev()
        }
      }
    }
  }

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`group relative h-[100svh] min-h-[100svh] overflow-hidden bg-charcoal select-none ${
        isHoverDevice ? 'cursor-none' : ''
      }`}
      aria-label="Indian Collection Slider"
    >
      {/* Background slide images */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-charcoal">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={index}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ willChange: 'transform, opacity' }}
          >
            <img
              src={slides[index].image}
              alt={slides[index].title}
              className="h-full w-full object-cover brightness-[95%] contrast-[96%]"
              style={{
                objectPosition: isMobile ? 'center center' : (slides[index].desktopPosition || 'center center'),
                transform: isMobile ? 'scale(1.02)' : 'none',
              }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Soft dark gradient for type legibility */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent z-10 ${
        isMobile ? 'to-black/60' : 'to-black/30'
      }`} />
      
      {/* Extra grain layer for editorial texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay z-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Interactive Desktop click zones */}
      <div className="absolute inset-0 z-30 hidden md:grid grid-cols-2">
        <button
          type="button"
          aria-label="Previous slide"
          className="bg-transparent focus:outline-none cursor-none w-full h-full"
          onMouseEnter={() => setCursorSide('PREV')}
          onClick={prev}
        />
        <button
          type="button"
          aria-label="Next slide"
          className="bg-transparent focus:outline-none cursor-none w-full h-full"
          onMouseEnter={() => setCursorSide('NEXT')}
          onClick={next}
        />
      </div>

      {/* Floating custom cursor */}
      {isHoverDevice && (
        <div
          ref={cursorRef}
          className={`pointer-events-none fixed left-0 top-0 z-[60] -translate-x-1/2 -translate-y-1/2 select-none transition-opacity duration-300 ease-out hidden md:block ${
            isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
          style={{ willChange: 'transform' }}
        >
          <div className="relative border border-cream/20 bg-charcoal/40 backdrop-blur-md px-6 py-3 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.35)] min-w-[130px] h-[46px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            <div className="relative w-full h-full flex items-center justify-center font-sans text-[10px] tracking-[0.25em] uppercase text-cream font-light">
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out ${
                  cursorSide === 'PREV' 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-4'
                }`}
              >
                ← PREV
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out ${
                  cursorSide === 'NEXT' 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-4'
                }`}
              >
                NEXT →
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Editorial Content Layout */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-12 md:p-20 pointer-events-none">
        
        {/* Top bar: Title & Indicators */}
        <div className="flex items-center justify-between w-full">
          <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-gold font-semibold">
            03 / Showcase Collection
          </span>
          
          <div className="flex items-center gap-4 text-cream/70 font-sans">
            <span className="text-[9px] sm:text-[10px] tracking-widest font-medium">
              {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Middle part: Main Titles & Description */}
        <div className="relative max-w-[32rem] text-cream min-h-[140px] sm:min-h-[160px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] as const }}
              className="absolute inset-x-0 bottom-0 flex flex-col justify-center pointer-events-none"
              style={{ willChange: 'transform, opacity' }}
            >
              <p className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-gold font-medium">
                Atelier Campaign
              </p>
              <h2 className="mt-2 sm:mt-3 font-display font-light text-4xl sm:text-6xl md:text-7xl leading-[1.1] tracking-tight">
                {slides[index].title}
              </h2>
              <p className="mt-2 sm:mt-4 font-sans text-[10px] sm:text-xs tracking-[0.25em] text-cream/70 uppercase">
                {slides[index].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom bar: Action controls */}
        <div className="flex items-center justify-between gap-6 border-t border-cream/15 pt-6 w-full">
          <div>
            <span className="hidden sm:inline-block text-[9px] uppercase tracking-[0.3em] text-cream/40 font-sans">
              Drag / Swipe or Click to browse
            </span>
          </div>

          <div className="flex items-center gap-4 pointer-events-auto">
            <button
              onClick={prev}
              disabled={isAnimating}
              className="md:hidden flex items-center justify-center border border-cream/20 bg-charcoal/20 backdrop-blur-md text-cream hover:bg-cream hover:text-charcoal hover:border-cream rounded-full px-5 py-2 text-[9px] uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={next}
              disabled={isAnimating}
              className="md:hidden flex items-center justify-center border border-cream/20 bg-charcoal/20 backdrop-blur-md text-cream hover:bg-cream hover:text-charcoal hover:border-cream rounded-full px-5 py-2 text-[9px] uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
export default IndianCollectionSlider

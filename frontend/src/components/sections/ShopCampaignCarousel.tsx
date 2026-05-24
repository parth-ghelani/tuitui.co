import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

type CarouselItem = {
  title: string
  subtitle: string
  tagline: string
  image: string
  objectPosition: string
  mobilePosition: string
}

// ── All 14 showcase images ────────────────────────────────────────────────────
const carouselItems: CarouselItem[] = [
  {
    tagline: 'SS / 2026 Campaign',
    title: 'Luxury Editorial Edit',
    subtitle: 'Woven in raw tussar silk and structured on heritage looms.',
    image: '/images/showcase/Ultra_realistic_luxury_fashion_editorial_202605241208.jpeg',
    objectPosition: '70% center',
    mobilePosition: 'center center',
  },
  {
    tagline: 'Heritage Couture',
    title: 'Cinematic Heritage Edit',
    subtitle: 'Intricate textile embroidery meeting timeless structured silhouettes.',
    image: '/images/showcase/change_the_background_2K_202605241216.jpeg',
    objectPosition: 'center center',
    mobilePosition: 'center center',
  },
  {
    tagline: 'Modern Campaign',
    title: 'Contemporary Campaign Edit',
    subtitle: 'Tailored neutral cuts designed for contemporary styling.',
    image: '/images/showcase/the_model_looks_ai_the_202605241232.jpeg',
    objectPosition: '55% center',
    mobilePosition: 'center center',
  },
  {
    tagline: 'Indian Collection',
    title: 'Mridula Silk Lehenga',
    subtitle: 'Gold thread embroidery on Varanasi handloomed silk.',
    image: '/images/showcase/change_the_clothing_to_the_202605211736.jpeg',
    objectPosition: '60% center',
    mobilePosition: 'center center',
  },
  {
    tagline: 'Chanderi Edit',
    title: 'Zoya Chanderi Kurta',
    subtitle: 'Natural light and breathable weaves for an effortless silhouette.',
    image: '/images/showcase/add_some_natural_light_on_202605211810.jpeg',
    objectPosition: 'center center',
    mobilePosition: 'center center',
  },
  {
    tagline: 'Sharara Series',
    title: 'Ishwari Silk Sharara',
    subtitle: 'Silk georgette, gota borders and celebratory flare.',
    image: '/images/showcase/now_increase_the_quality_of_202605211723.jpeg',
    objectPosition: '50% 20%',
    mobilePosition: 'center 20%',
  },
  {
    tagline: 'Navratri Couture',
    title: 'Navratri Couture Blouse',
    subtitle: 'Hand-crafted mirrors and ceremonial threadwork for festive occasions.',
    image: '/images/showcase/navratri_top.jpeg',
    objectPosition: 'center center',
    mobilePosition: 'center center',
  },
  {
    tagline: 'Kutch Heritage',
    title: 'Rabari Heritage Jacket',
    subtitle: 'Mirror-work from Kutch, woven into a timeless vest silhouette.',
    image: '/images/showcase/1000000419.jpg_202605231803.jpeg',
    objectPosition: 'center center',
    mobilePosition: 'center center',
  },
  {
    tagline: 'Western Edit',
    title: 'Architectural Linen Blazer',
    subtitle: 'Premium water-resistant linen twill with structured shoulders.',
    image: '/images/showcase/western_showcase.jpeg',
    objectPosition: 'center center',
    mobilePosition: 'center center',
  },
  {
    tagline: 'Satin Luxe',
    title: 'Luxe Satin Wrap Dress',
    subtitle: 'Structured satin with architectural pleating and fluid drape.',
    image: '/images/showcase/Ultra_realistic_faceless_luxury_fashion_202605221051.jpeg',
    objectPosition: 'center center',
    mobilePosition: 'center center',
  },
  {
    tagline: 'Gown Collection',
    title: 'Asymmetric Editorial Gown',
    subtitle: 'A floor-length couture piece with clean asymmetric lines.',
    image: '/images/showcase/Ultra_realistic_faceless_luxury_fashion_202605221056.jpeg',
    objectPosition: 'center center',
    mobilePosition: 'center center',
  },
  {
    tagline: 'Campaign Outerwear',
    title: 'Campaign Silk Trench',
    subtitle: 'Oversized silk wrap trench for dynamic seasonal layering.',
    image: '/images/showcase/hero_202605231903.jpeg',
    objectPosition: 'center center',
    mobilePosition: 'center center',
  },
  {
    tagline: 'Couture Drape',
    title: 'Keep The Drape',
    subtitle: 'Editorial draping that redefines structured elegance.',
    image: '/images/showcase/keep_the_dress_as_in_202605241226.jpeg',
    objectPosition: 'center center',
    mobilePosition: 'center center',
  },
  {
    tagline: 'Western Campaign',
    title: 'Western Campaign Edit',
    subtitle: 'Modern utility silhouettes in premium natural textiles.',
    image: '/images/showcase/western_showcase.png',
    objectPosition: 'center center',
    mobilePosition: 'center center',
  },
]

// ── Animation variants — clean crossfade with subtle zoom ────────────────────
const variants = {
  enter: { opacity: 0, scale: 1.04 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
}

const INTERVAL_MS = 2000

export function ShopCampaignCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Responsive check ──────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ── Auto-advance every 2 s ────────────────────────────────────────────────
  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % carouselItems.length)
  }, [])

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(advance, INTERVAL_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused, advance])

  // ── Manual nav ────────────────────────────────────────────────────────────
  const goNext = () => {
    setIndex((i) => (i + 1) % carouselItems.length)
    if (timerRef.current) clearInterval(timerRef.current)
    if (!paused) timerRef.current = setInterval(advance, INTERVAL_MS)
  }

  const goPrev = () => {
    setIndex((i) => (i - 1 + carouselItems.length) % carouselItems.length)
    if (timerRef.current) clearInterval(timerRef.current)
    if (!paused) timerRef.current = setInterval(advance, INTERVAL_MS)
  }

  const goTo = (i: number) => {
    if (i === index) return
    setIndex(i)
    if (timerRef.current) clearInterval(timerRef.current)
    if (!paused) timerRef.current = setInterval(advance, INTERVAL_MS)
  }

  const current = carouselItems[index]

  return (
    <div
      className="group relative w-full h-[100svh] min-h-[100svh] overflow-hidden bg-charcoal border-b border-charcoal/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* ── Slides ─────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={index}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0"
            style={{ willChange: 'opacity, transform' }}
          >
            <img
              src={current.image}
              alt={current.title}
              className="h-full w-full object-cover brightness-[90%]"
              style={{
                objectPosition: isMobile
                  ? current.mobilePosition
                  : current.objectPosition,
              }}
              draggable={false}
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Gradient overlays ───────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent z-10" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-[35vh] bg-gradient-to-t from-cream via-cream/60 to-transparent z-10" />

      {/* ── Progress bar ────────────────────────────────────────────────────── */}
      <div className="absolute top-0 inset-x-0 h-[2px] z-30 bg-white/10">
        <motion.div
          key={index}
          className="h-full bg-umber/80"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: INTERVAL_MS / 1000, ease: 'linear' }}
        />
      </div>

      {/* ── Slide counter ───────────────────────────────────────────────────── */}
      <div className="absolute top-8 right-8 z-30 text-cream/60 text-[9px] uppercase tracking-[0.3em] font-sans tabular-nums">
        {String(index + 1).padStart(2, '0')} / {String(carouselItems.length).padStart(2, '0')}
      </div>

      {/* ── Text content ────────────────────────────────────────────────────── */}
      <div className="absolute inset-x-6 bottom-[14vh] md:inset-x-16 md:bottom-[18vh] z-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pointer-events-none">
        <div className="max-w-xl">
          <AnimatePresence mode="wait">
            <motion.span
              key={`tag-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="inline-block text-[9px] uppercase tracking-[0.35em] text-umber font-semibold mb-3"
            >
              {current.tagline}
            </motion.span>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.h2
              key={`title-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
              className="font-display font-light text-3xl sm:text-5xl md:text-6xl tracking-wide leading-none text-cream drop-shadow-sm"
            >
              {current.title}
            </motion.h2>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="mt-3 font-sans text-xs md:text-sm font-light text-cream/70 tracking-wide max-w-sm leading-relaxed"
            >
              {current.subtitle}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5 pointer-events-auto flex-wrap max-w-[200px]">
          {carouselItems.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative h-5 w-5 flex items-center justify-center focus:outline-none"
            >
              <div
                className={`rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-4 h-1 bg-umber'
                    : 'w-1 h-1 bg-cream/30 hover:bg-cream/60'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Arrow controls ──────────────────────────────────────────────────── */}
      <div className="absolute inset-y-0 inset-x-3 md:inset-x-6 flex items-center justify-between z-20 pointer-events-none">
        <button
          onClick={goPrev}
          className="flex items-center justify-center h-11 w-11 rounded-full border border-white/20 bg-black/20 text-cream backdrop-blur-sm pointer-events-auto hover:bg-charcoal hover:border-charcoal transition-all duration-300 focus:outline-none opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <CaretLeft size={18} weight="light" />
        </button>

        <button
          onClick={goNext}
          className="flex items-center justify-center h-11 w-11 rounded-full border border-white/20 bg-black/20 text-cream backdrop-blur-sm pointer-events-auto hover:bg-charcoal hover:border-charcoal transition-all duration-300 focus:outline-none opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <CaretRight size={18} weight="light" />
        </button>
      </div>
    </div>
  )
}

export default ShopCampaignCarousel

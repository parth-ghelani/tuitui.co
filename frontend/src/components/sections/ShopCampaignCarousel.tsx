import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

type Slide = {
  tagline: string
  title: string
  subtitle: string
  /** Path served from /public */
  image: string
  /**
   * object-position tuned per image so full garment + model stays visible.
   * Desktop (landscape viewport):  wide images need horizontal nudging.
   * Mobile  (portrait viewport):   keep model centered vertically.
   */
  desktop: string
  mobile: string
}

// ── 5 curated shop-showcase images — each reviewed visually ─────────────────
const SLIDES: Slide[] = [
  {
    // Portrait tall image — floral gown, full length, model back-facing
    tagline: 'SS / 2026 Campaign',
    title: 'Editorial Floral Gown',
    subtitle: 'Pleated maxi in hand-printed floral silk. Shot at Lake Pichola, Udaipur.',
    image: '/images/shop-showcase/Ultra_realistic_luxury_fashion_editorial_202605241208.jpeg',
    desktop: '62% top',    // show more of gown hem, model centered
    mobile: '60% top',
  },
  {
    // Landscape wide — full-length red lehenga, temple courtyard, diya decor
    tagline: 'Heritage Couture',
    title: 'Scarlet Lehenga',
    subtitle: 'Maroon & ivory hand-embroidered lehenga with gota dupatta.',
    image: '/images/shop-showcase/change_the_ratio_2K_202605241737 (2).jpeg',
    desktop: '52% 18%',    // pull up to show full skirt hem without cutting face
    mobile: '50% 15%',
  },
  {
    // Landscape wide — seated maroon kurta, Udaipur palace backdrop
    tagline: 'The Anarkali Edit',
    title: 'Mewar Maroon Kurta',
    subtitle: 'Structured anarkali in silk chiffon with star embroidery. Golden hour editorial.',
    image: '/images/shop-showcase/change_the_ratio_2K_202605241737.jpeg',
    desktop: '42% 35%',    // nudge left to show model; 35% keeps face + full garment
    mobile: '42% 32%',
  },
  {
    // Landscape — black textured co-ord, garden setting, model centered
    tagline: 'Contemporary Edit',
    title: 'Obsidian Co-ord Set',
    subtitle: 'Boucle textured top and wide-leg pant in carbon black. Garden campaign.',
    image: '/images/shop-showcase/change_the_ratio_2K_202605241737 (1).jpeg',
    desktop: '60% 12%',    // pull up to show neck detail; legs are wide pant so full visible
    mobile: '58% 10%',
  },
  {
    // Landscape — Navratri blouse close-up, candle-lit temple, dramatic
    tagline: 'Navratri Couture',
    title: 'Embroidered Bustier',
    subtitle: 'Multi-colour embroidered bustier with Kutch mirrorwork and silver choker.',
    image: '/images/shop-showcase/Ultra_realistic_faceless_luxury_fashion_202605221056.jpeg',
    desktop: '52% 28%',    // center the garment detail; this is a deliberate editorial crop
    mobile: '50% 25%',
  },
]

const INTERVAL_MS = 3000

// ── Cinematic crossfade ──
// • Enter: imperceptible scale-in (1.008 → 1) so there's no visible "pop"
// • Exit:  slow opacity fade — image stays full-size so it dissolves cleanly
// • Both transitions are longer than the swap feels, creating an overlap window
const IMG_ENTER: import('motion/react').Transition = {
  duration: 1.4,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
}

const slideVariants = {
  enter:  { opacity: 0, scale: 1.008 },
  center: { opacity: 1, scale: 1     },
  exit:   { opacity: 0, scale: 1.0   },
}

export function ShopCampaignCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Responsive ────────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ── Auto-advance every 3 s ────────────────────────────────────────────────
  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % SLIDES.length)
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(advance, INTERVAL_MS)
  }, [advance])

  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(advance, INTERVAL_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused, advance])

  // ── Manual nav ────────────────────────────────────────────────────────────
  const goNext = () => { setIndex((i) => (i + 1) % SLIDES.length); resetTimer() }
  const goPrev = () => { setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length); resetTimer() }
  const goTo   = (i: number) => { if (i !== index) { setIndex(i); resetTimer() } }

  const slide = SLIDES[index]

  return (
    <div
      className="group relative w-full overflow-hidden bg-charcoal"
      style={{ height: '100svh', minHeight: '100svh' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >

      {/* ── SLIDES — cinematic crossfade, no direction, no pop ──────────────── */}
      <div className="absolute inset-0 z-0">
        {/*
          mode="popLayout" lets the entering slide layer on top immediately
          while the exiting slide dissolves underneath — true crossfade.
          mode="sync" causes them to fight (enter waits for exit = abrupt gap).
        */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={index}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={IMG_ENTER}
            className="absolute inset-0"
            style={{ willChange: 'opacity, transform' }}
          >
            {/*
              Ken Burns: very slow continuous drift on the ACTIVE image.
              Only translateY — no scale — so framing is never disturbed.
              CSS animation is cheaper than JS and avoids jank during JS tasks.
            */}
            <img
              src={slide.image}
              alt={slide.title}
              draggable={false}
              loading="eager"
              className="h-full w-full object-cover"
              style={{
                objectPosition: isMobile ? slide.mobile : slide.desktop,
                filter: 'brightness(0.87) contrast(1.03) saturate(1.05)',
                animation: 'kenburns 12s ease-in-out infinite alternate',
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Ken Burns keyframes — injected once, no FOUC */}
      <style>{`
        @keyframes kenburns {
          from { transform: translateY(0px) scale(1);    }
          to   { transform: translateY(-6px) scale(1.01); }
        }
      `}</style>

      {/* ── OVERLAYS — minimal: only bottom gradient to seat text ──────────── */}
      {/* No fog/cream overlay — garments must be fully visible */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: '55%',
          background: 'linear-gradient(to top, rgba(17,17,17,0.72) 0%, rgba(17,17,17,0.30) 45%, transparent 100%)',
        }}
      />
      {/* Cream fade at very bottom — blends into shop grid below */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: '18%',
          background: 'linear-gradient(to top, #FAF8F5 0%, transparent 100%)',
        }}
      />

      {/* ── PROGRESS BAR — fills over exactly INTERVAL_MS, resets per slide ──── */}
      <div className="absolute top-0 inset-x-0 h-[2px] z-30 bg-white/10">
        <motion.div
          key={`prog-${index}`}
          className="h-full bg-[#D4A574]/80"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: INTERVAL_MS / 1000, ease: 'linear' }}
          style={{ transformOrigin: 'left center' }}
        />
      </div>

      {/* ── SLIDE COUNTER ─────────────────────────────────────────────────────── */}
      <div className="absolute top-6 right-6 z-30 text-white/50 text-[9px] uppercase tracking-[0.3em] font-sans tabular-nums select-none">
        {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>

      {/* ── TEXT CONTENT — staggered line-by-line entry per slide ──────────────── */}
      <div className="absolute inset-x-6 bottom-[15svh] md:inset-x-14 md:bottom-[17svh] z-20 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${index}`}
            initial="hidden"
            animate="visible"
            exit="out"
            variants={{
              hidden:  {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
              out:     { transition: { staggerChildren: 0.04 } },
            }}
            className="max-w-xl"
          >
            {/* Tagline */}
            <motion.span
              variants={{
                hidden:  { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16,1,0.3,1] as [number,number,number,number] } },
                out:     { opacity: 0, y: -6,  transition: { duration: 0.35 } },
              }}
              className="inline-block text-[9px] uppercase tracking-[0.4em] text-[#D4A574] font-semibold mb-2 font-sans"
            >
              {slide.tagline}
            </motion.span>

            {/* Title */}
            <motion.h2
              variants={{
                hidden:  { opacity: 0, y: 22 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16,1,0.3,1] as [number,number,number,number] } },
                out:     { opacity: 0, y: -10, transition: { duration: 0.35 } },
              }}
              className="font-display font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide leading-[1.05] text-white"
            >
              {slide.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              variants={{
                hidden:  { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16,1,0.3,1] as [number,number,number,number] } },
                out:     { opacity: 0, y: -6,  transition: { duration: 0.3 } },
              }}
              className="mt-3 font-sans text-[11px] md:text-sm font-light text-white/60 tracking-wide max-w-sm leading-relaxed"
            >
              {slide.subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── DOT INDICATORS ────────────────────────────────────────────────────── */}
      <div className="absolute bottom-[10svh] inset-x-6 md:inset-x-14 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-6 flex items-center justify-center focus:outline-none"
          >
            <div
              className={`rounded-full transition-all duration-400 ${
                i === index
                  ? 'w-6 h-[3px] bg-[#D4A574]'
                  : 'w-[5px] h-[5px] bg-white/25 hover:bg-white/50'
              }`}
            />
          </button>
        ))}
      </div>

      {/* ── ARROW CONTROLS — fade in on hover, smooth 400ms ──────────────────── */}
      <div className="absolute inset-y-0 left-4 right-4 md:left-6 md:right-6 flex items-center justify-between z-20 pointer-events-none">
        <motion.button
          onClick={goPrev}
          aria-label="Previous slide"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-auto flex items-center justify-center h-11 w-11 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-white hover:text-charcoal hover:border-transparent transition-colors duration-300 focus:outline-none opacity-0 group-hover:opacity-100 shadow-lg"
          style={{ transition: 'opacity 0.4s ease, background 0.3s ease, color 0.3s ease' }}
        >
          <CaretLeft size={15} weight="light" />
        </motion.button>
        <motion.button
          onClick={goNext}
          aria-label="Next slide"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-auto flex items-center justify-center h-11 w-11 rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md hover:bg-white hover:text-charcoal hover:border-transparent transition-colors duration-300 focus:outline-none opacity-0 group-hover:opacity-100 shadow-lg"
          style={{ transition: 'opacity 0.4s ease, background 0.3s ease, color 0.3s ease' }}
        >
          <CaretRight size={15} weight="light" />
        </motion.button>
      </div>

    </div>
  )
}

export default ShopCampaignCarousel

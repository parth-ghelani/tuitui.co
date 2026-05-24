import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

type CarouselItem = {
  title: string
  subtitle: string
  tagline: string
  image: string
  desktopPosition: string
}

const carouselItems: CarouselItem[] = [
  {
    tagline: 'SS / 2026 Campaign',
    title: 'Luxury Editorial Edit',
    subtitle: 'Woven in raw tussar silk and structured on heritage looms.',
    image: '/images/showcase/Ultra_realistic_luxury_fashion_editorial_202605241208.jpeg',
    desktopPosition: '70% center',
  },
  {
    tagline: 'Handcrafted Heritage',
    title: 'Cinematic Heritage Edit',
    subtitle: 'Intricate textile embroidery meeting timeless structured silhouettes.',
    image: '/images/showcase/change_the_background_2K_202605241216.jpeg',
    desktopPosition: 'center center',
  },
  {
    tagline: 'SS / 2026 Modern',
    title: 'Contemporary Campaign Edit',
    subtitle: 'Tailored neutral cuts designed for contemporary styling.',
    image: '/images/showcase/the_model_looks_ai_the_202605241232.jpeg',
    desktopPosition: '55% center',
  }
]

const slideVariants = {
  enter: (direction: 'next' | 'prev') => ({
    opacity: 0,
    x: direction === 'next' ? 80 : -80,
    scale: 1.05,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: 'next' | 'prev') => ({
    opacity: 0,
    x: direction === 'next' ? -80 : 80,
    scale: 1.05,
  }),
}

const slideTransition = {
  duration: 1.2,
  ease: [0.76, 0, 0.24, 1] as const,
}

export function ShopCampaignCarousel() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const timerRef = useRef<any>(null)

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection('next')
    setIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)
  }

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection('prev')
    setIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length)
  }

  // Very slow auto-cycling
  const startAutoplay = () => {
    stopAutoplay()
    timerRef.current = setInterval(handleNext, 6500)
  }

  const stopAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    startAutoplay()
    return () => {
      stopAutoplay()
      window.removeEventListener('resize', checkMobile)
    }
  }, [isAnimating])

  return (
    <div
      className="group relative w-full h-[100svh] min-h-[100svh] overflow-hidden bg-cream border-b border-charcoal/5"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      {/* Background Campaign Images */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            onAnimationComplete={() => setIsAnimating(false)}
            className="absolute inset-0 w-full h-full"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Image with subtle continuous breathing animation */}
            <motion.img
              src={carouselItems[index].image}
              alt={carouselItems[index].title}
              animate={{
                scale: isMobile ? [1.02, 1.05, 1.02] : [1, 1.03, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="h-full w-full object-cover brightness-[95%] contrast-[98%]"
              style={{
                objectPosition: isMobile ? 'center center' : (carouselItems[index].desktopPosition || 'center center'),
                transform: isMobile ? 'scale(1.02)' : 'none',
              }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Ivory bottom fade to blend into the shop section */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-[40vh] bg-gradient-to-t from-cream via-cream/80 to-transparent z-10" />
      
      {/* Subtle warm atmospheric haze overlay */}
      <div className="pointer-events-none absolute inset-0 bg-cream/5 z-10" />

      {/* Content overlay */}
      <div className="absolute inset-x-8 bottom-[12vh] md:inset-x-16 md:bottom-[15vh] z-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pointer-events-none">
        <div className="max-w-xl text-charcoal">
          <motion.span
            key={`tag-${index}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="inline-block text-[9px] uppercase tracking-[0.35em] text-umber font-semibold mb-2"
          >
            {carouselItems[index].tagline}
          </motion.span>
          <motion.h2
            key={`title-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
            className="font-display font-light text-4xl sm:text-5xl md:text-6xl tracking-wide leading-none text-charcoal"
          >
            {carouselItems[index].title}
          </motion.h2>
          <motion.p
            key={`sub-${index}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            className="mt-4 font-sans text-xs md:text-sm font-light text-charcoal/70 tracking-wide max-w-md leading-relaxed"
          >
            {carouselItems[index].subtitle}
          </motion.p>
        </div>

        {/* Minimal Indicators / Dots */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {carouselItems.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (isAnimating || i === index) return
                setIsAnimating(true)
                setDirection(i > index ? 'next' : 'prev')
                setIndex(i)
              }}
              className="relative h-6 w-6 flex items-center justify-center focus:outline-none"
              aria-label={`Go to slide ${i + 1}`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? 'w-5 bg-umber shadow-[0_0_8px_rgba(212,165,116,0.3)]' : 'w-1.5 bg-charcoal/20 hover:bg-charcoal/50'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Premium Minimal Arrows */}
      <div className="absolute inset-y-0 inset-x-4 md:inset-x-8 flex items-center justify-between z-20 pointer-events-none">
        <button
          onClick={handlePrev}
          disabled={isAnimating}
          className="flex items-center justify-center h-12 w-12 rounded-full border border-charcoal/10 bg-cream/40 text-charcoal backdrop-blur-sm pointer-events-auto hover:bg-charcoal hover:text-cream hover:border-charcoal transition-all duration-300 disabled:opacity-30 focus:outline-none shadow-sm"
          aria-label="Previous slide"
        >
          <CaretLeft size={20} weight="light" />
        </button>
        
        <button
          onClick={handleNext}
          disabled={isAnimating}
          className="flex items-center justify-center h-12 w-12 rounded-full border border-charcoal/10 bg-cream/40 text-charcoal backdrop-blur-sm pointer-events-auto hover:bg-charcoal hover:text-cream hover:border-charcoal transition-all duration-300 disabled:opacity-30 focus:outline-none shadow-sm"
          aria-label="Next slide"
        >
          <CaretRight size={20} weight="light" />
        </button>
      </div>
    </div>
  )
}
export default ShopCampaignCarousel

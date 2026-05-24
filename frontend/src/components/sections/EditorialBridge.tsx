import { motion } from 'motion/react'

export function EditorialBridge() {
  const scrollVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] as const } 
    }
  }

  const imageLeftVariants = {
    initial: { opacity: 0, scale: 0.96, y: 30 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as const } 
    }
  }

  const imageFloatVariants = {
    initial: { opacity: 0, scale: 0.9, x: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      x: 0,
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 } 
    }
  }

  return (
    <section className="bg-cream py-24 md:py-48 overflow-hidden select-none border-b border-beige/30">
      <div className="mx-auto w-[min(1200px,92vw)] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-center">
        
        {/* Left Side: Editorial Storytelling Text */}
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            initial: {},
            animate: { transition: { staggerChildren: 0.15 } }
          }}
          className="space-y-6 md:space-y-8"
        >
          {/* Subtle Label */}
          <motion.div variants={scrollVariants} className="flex items-center gap-3">
            <span className="h-[1px] w-6 bg-gold/50" />
            <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-umber">
              Our Philosophy / SS26
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2 
            variants={scrollVariants} 
            className="font-display text-4xl sm:text-5xl font-light text-charcoal leading-[1.1] tracking-tight"
          >
            The poetry of <br />
            Loom and Line.
          </motion.h2>

          {/* Prose Narrative */}
          <motion.p 
            variants={scrollVariants} 
            className="font-sans text-sm text-charcoal/70 leading-relaxed max-w-md font-light"
          >
            Every silhouette we structure is a dialogue between Mewar's historic stonemasonry and the organic drape of raw tussar silks. We create garments that breathe in the spaces between ancient ceremony and the velocity of contemporary cities.
          </motion.p>

          <motion.p 
            variants={scrollVariants} 
            className="font-sans text-xs text-umber leading-relaxed max-w-sm tracking-wide font-light"
          >
            We celebrate the deliberate pause. Handloom weaves designed not to fill closets, but to anchor memories.
          </motion.p>
        </motion.div>

        {/* Right Side: Layered Asymmetrical Images */}
        <div className="relative flex items-center justify-center lg:justify-end mt-12 lg:mt-0 pb-12 lg:pb-0">
          
          {/* Main vertical cropped fashion image */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={imageLeftVariants}
            className="relative w-[280px] h-[380px] sm:w-[320px] sm:h-[440px] overflow-hidden border border-charcoal/10 p-2.5 bg-white/40 shadow-soft"
          >
            <div className="w-full h-full overflow-hidden">
              <img 
                src="/images/showcase/now_increase_the_quality_of_202605211723.jpeg" 
                alt="Modern drape silhouette" 
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-[2s] hover:scale-100"
              />
            </div>
            {/* Fine coordinate detail tag */}
            <div className="absolute -left-12 bottom-12 -rotate-90 origin-right">
              <span className="font-sans text-[7px] uppercase tracking-[0.3em] text-charcoal/40">
                SS_26_EDITORIAL_08
              </span>
            </div>
          </motion.div>

          {/* Floating detail fabric image overlay */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={imageFloatVariants}
            className="absolute -bottom-10 left-4 sm:-bottom-12 sm:left-12 lg:left-0 xl:left-8 w-[160px] h-[210px] sm:w-[190px] sm:h-[250px] overflow-hidden border border-charcoal/10 p-2 bg-white/80 shadow-2xl z-10"
          >
            <div className="w-full h-full overflow-hidden relative">
              {/* Soft light sweep */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/15 z-10 pointer-events-none" />
              <img 
                src="/images/showcase/add_some_natural_light_on_202605211810.jpeg" 
                alt="Intricate weave textile detail" 
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-[2s] hover:scale-100"
              />
            </div>
            {/* Fine label tag */}
            <div className="absolute right-3 bottom-3">
              <span className="font-sans text-[7px] uppercase tracking-[0.3em] text-gold font-medium">
                CHANDERI WEAVE
              </span>
            </div>
          </motion.div>

          {/* Asymmetric offset decorative outline frame */}
          <div className="absolute -top-6 -right-6 lg:right-0 xl:-right-6 w-[280px] h-[380px] sm:w-[320px] sm:h-[440px] border border-gold/15 pointer-events-none -z-10 translate-x-3 translate-y-3" />
        </div>

      </div>
    </section>
  )
}
export default EditorialBridge

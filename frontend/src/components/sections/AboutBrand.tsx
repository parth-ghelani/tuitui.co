import { useEffect, useRef } from 'react'
import { createTimeline, stagger } from 'animejs'

export function AboutBrand() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger Anime.js animation
            createTimeline({ defaults: { ease: 'easeOutExpo' } })
              .add('.story-image-wrap', {
                opacity: [0, 1],
                scale: [1.05, 1],
                translateY: [60, 0],
                duration: 1600,
              })
              .add('.story-text-reveal', {
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 1200,
                delay: stagger(150),
              }, '-=1200')
              .add('.story-stat-item', {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 1000,
                delay: stagger(120),
              }, '-=800')

            // Stop observing once animated
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-cream py-24 sm:py-32 overflow-hidden select-none"
    >
      <div className="mx-auto w-[min(1400px,90vw)]">
        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-24 items-center">
          
          {/* Left panel: Tall editorial image frame */}
          <div className="story-image-wrap opacity-0 w-full flex justify-center lg:justify-start">
            <div 
              ref={imageRef}
              className="relative overflow-hidden aspect-[3/4] w-full max-w-[520px] rounded-lg shadow-soft group bg-beige"
            >
              {/* Image zoom on hover */}
              <img
                src="/images/showcase/Ultra_realistic_faceless_luxury_fashion_202605221051.jpeg"
                alt="Editorial Portrait"
                className="h-full w-full object-cover object-center filter grayscale-[15%] sepia-[15%] brightness-[94%] transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              {/* Subtle atmospheric frame border */}
              <div className="absolute inset-4 border border-cream/25 pointer-events-none transition-all duration-700 group-hover:inset-6" />
              {/* Overlay vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none opacity-60" />
              
              <div className="absolute bottom-8 left-8 right-8 text-cream z-10">
                <span className="font-sans text-[8px] uppercase tracking-[0.3em] opacity-80">
                  Studio Atelier / Jaipur
                </span>
                <h4 className="font-display font-light text-xl mt-1 tracking-wide">
                  The Hand-Woven Symphony
                </h4>
              </div>
            </div>
          </div>

          {/* Right panel: Editorial text and paragraphs */}
          <div className="flex flex-col space-y-8 lg:pr-12">
            <div className="space-y-4">
              <span className="story-text-reveal opacity-0 inline-block font-sans text-[10px] tracking-[0.35em] uppercase text-umber font-semibold">
                02 / The Philosophy
              </span>
              <h2 className="story-text-reveal opacity-0 font-display font-light text-4xl sm:text-5xl md:text-6xl text-charcoal leading-tight tracking-tight">
                Crafted for the conscious wanderer.
              </h2>
            </div>

            <p className="story-text-reveal opacity-0 font-sans font-light text-charcoal/70 leading-relaxed text-sm sm:text-base max-w-xl">
              The Tuitui Co represents an artistic dialogue between traditional heritage craftsmanship and contemporary silhouette architecture. We create apparel that feels like second-skin poetry, designed to elevate your everyday rituals.
            </p>

            <p className="story-text-reveal opacity-0 font-sans font-light text-charcoal/70 leading-relaxed text-sm sm:text-base max-w-xl">
              By working in collaboration with heritage loom artisans across Udaipur and Maheshwar, each collection layers pure organic fibres with fine tailoring, celebrating slow design, understated luxury, and quiet ceremony.
            </p>

            {/* Editorial Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-charcoal/10">
              {[
                {
                  num: 'I',
                  title: 'Heritage Craft',
                  desc: 'Traditional handloom techniques meets clean architectural lines.'
                },
                {
                  num: 'II',
                  title: 'Quiet Luxury',
                  desc: 'Soft ivory tones, raw texturing, and custom buttons.'
                },
                {
                  num: 'III',
                  title: 'Slow Living',
                  desc: 'Consciously made in limited batches to cherish for seasons.'
                }
              ].map((item, idx) => (
                <div key={idx} className="story-stat-item opacity-0 flex flex-col space-y-2">
                  <span className="font-display font-light text-umber text-2xl">
                    {item.num}
                  </span>
                  <h4 className="font-sans text-[11px] uppercase tracking-wider font-semibold text-charcoal">
                    {item.title}
                  </h4>
                  <p className="font-sans text-[11px] leading-relaxed text-charcoal/50 font-light">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
export default AboutBrand


import { motion } from 'motion/react'

const lookbookImages = [
  {
    id: '1',
    image: '/images/showcase/Ultra_realistic_faceless_luxury_fashion_202605221051.jpeg',
    title: 'Dusk on silk',
  },
  {
    id: '2',
    image: '/images/showcase/western_showcase.jpeg',
    title: 'Modern drape',
  },
  {
    id: '3',
    image: '/images/showcase/now_increase_the_quality_of_202605211723.jpeg',
    title: 'Quiet power',
  },
  {
    id: '4',
    image: '/images/showcase/add_some_natural_light_on_202605211810.jpeg',
    title: 'Studio light',
  },
  {
    id: '5',
    image: '/images/showcase/change_the_clothing_to_the_202605211736.jpeg',
    title: 'After hours',
  },
  {
    id: '6',
    image: '/images/showcase/hero_202605231903.jpeg',
    title: 'Soft armor',
  },
]

export function Lookbook() {
  return (
    <section id="lookbook" className="bg-cream py-20 sm:py-24">
      <div className="mx-auto w-[min(1200px,92vw)]">
        <div className="mb-10 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-umber">
            Lookbook
          </p>
          <h2 className="mt-4 text-3xl sm:text-5xl font-light font-display text-charcoal">
            A cinematic wardrobe in motion.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lookbookImages.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              className="group relative overflow-hidden rounded-[2rem] border border-charcoal/10 bg-beige/30 p-2"
            >
              <div className="overflow-hidden rounded-[calc(2rem-0.5rem)]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[320px] w-full object-cover transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                />
              </div>
              {/* Overlay description: invisible on hover on desktop, always visible on mobile */}
              <div className="absolute inset-2 flex items-end rounded-[calc(2rem-0.5rem)] bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none">
                <p className="text-sm uppercase tracking-[0.3em] text-cream font-light">
                  {item.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default Lookbook

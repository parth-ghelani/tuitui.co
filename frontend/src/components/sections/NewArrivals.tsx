import { useEffect, useRef, useState } from 'react'
import { Heart, ShoppingBag } from '@phosphor-icons/react'
import { animate, stagger } from 'animejs'
import { useProductStore } from '../../store/useProductStore'
import { useCartStore } from '../../store/useCartStore'

export function NewArrivals() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const products = useProductStore((state) => state.products)
  const addItem = useCartStore((state) => state.addItem)
  const [wishlist, setWishlist] = useState<string[]>([])

  // Filter only featured products
  const featuredProducts = products.filter((p) => p.isFeatured)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger Anime.js staggered card entrance animation
            animate('.featured-card', {
              opacity: [0, 1],
              translateY: [40, 0],
              duration: 1200,
              delay: stagger(120),
              ease: 'easeOutExpo',
            })
            // Stop observing once animated
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceValue: product.priceValue,
      image: product.image,
      size: product.sizes[0] || 'M',
      color: product.colors[0] || '#111111',
    })
    // Dispatch event to open the slide-out cart drawer
    window.dispatchEvent(new CustomEvent('open-cart'))
  }

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <section 
      ref={sectionRef} 
      className="bg-cream py-24 sm:py-32 select-none overflow-hidden"
      aria-label="Featured Products Section"
    >
      <div className="mx-auto w-[min(1400px,90vw)]">
        {/* Editorial Heading */}
        <div className="mb-16 border-b border-charcoal/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <span className="inline-block font-sans text-[10px] tracking-[0.35em] uppercase text-umber font-semibold">
              05 / The Curated Edit
            </span>
            <h2 className="font-display font-light text-4xl sm:text-5xl md:text-6xl text-charcoal leading-tight tracking-tight">
              Featured Silhouettes
            </h2>
          </div>
          <p className="font-sans font-light text-charcoal/60 leading-relaxed text-xs sm:text-sm max-w-xs md:text-right">
            Hand-curated key looks from our Mewar Monologue and Western Modern campaigns. High-fashion utility for daily ceremony.
          </p>
        </div>

        {/* Horizontal Lookbook Catalog Slider */}
        <div className="overflow-x-auto pb-10 pt-4 scrollbar-none flex gap-8 -mx-4 px-4 sm:-mx-6 sm:px-6">
          {featuredProducts.map((product) => {
            const isLiked = wishlist.includes(product.id)
            return (
              <article
                key={product.id}
                className="featured-card opacity-0 w-[280px] sm:w-[320px] shrink-0 group flex flex-col justify-between"
              >
                {/* 3:4 Uniform Aspect Ratio image container */}
                <div className="relative overflow-hidden aspect-[3/4] rounded-lg shadow-soft bg-beige">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center filter grayscale-[10%] sepia-[10%] brightness-[94%] transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  {/* Subtle inner frame */}
                  <div className="absolute inset-3 border border-cream/20 pointer-events-none transition-all duration-700 group-hover:inset-4" />
                  
                  {/* Quick-add Overlay bar */}
                  <div className="absolute inset-x-0 bottom-0 p-4 md:translate-y-full md:group-hover:translate-y-0 translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between z-10">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-2 bg-cream text-charcoal text-[9px] uppercase tracking-widest font-semibold px-4 py-2.5 rounded-full hover:bg-black hover:text-cream transition-all duration-300"
                    >
                      <ShoppingBag size={12} />
                      Quick Add
                    </button>
                    
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`h-9 w-9 flex items-center justify-center rounded-full bg-cream/20 backdrop-blur-md text-cream hover:bg-cream hover:text-charcoal transition-all duration-300 ${
                        isLiked ? 'bg-cream text-charcoal' : ''
                      }`}
                      aria-label="Add to wishlist"
                    >
                      <Heart size={14} weight={isLiked ? 'fill' : 'light'} />
                    </button>
                  </div>
                </div>

                {/* Product Meta */}
                <div className="pt-6 space-y-2">
                  <div className="flex items-center justify-between text-[9px] tracking-[0.2em] uppercase text-umber font-semibold">
                    <span>{product.category}</span>
                    {product.stockStatus === 'low-stock' && (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Low Stock</span>
                    )}
                  </div>
                  
                  <h3 className="font-sans text-sm font-normal text-charcoal tracking-wide group-hover:text-umber transition-colors duration-300">
                    {product.name}
                  </h3>
                  
                  <p className="font-display font-light text-lg text-charcoal/80">
                    {product.price}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default NewArrivals


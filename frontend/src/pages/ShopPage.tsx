import React, { useState, useEffect } from 'react'
import { PageTransition } from '../components/layout/PageTransition'
import { useCartStore } from '../store/useCartStore'
import { useProductStore } from '../store/useProductStore'
import type { Product } from '../store/useProductStore'
import { motion, AnimatePresence } from 'motion/react'
import { gsap } from 'gsap'
import ProductSkeleton from '../components/sections/ProductSkeleton'
import { ShopCampaignCarousel } from '../components/sections/ShopCampaignCarousel'
import { Link } from 'react-router-dom'

function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { addItem } = useCartStore()
  const [isLoaded, setIsLoaded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceValue: product.priceValue,
      image: product.image,
      size: product.sizes[0] || 'M',
      color: product.colors[0] || '#111111',
    })
    window.dispatchEvent(new Event('open-cart'))
  }

  const handleShopNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceValue: product.priceValue,
      image: product.image,
      size: product.sizes[0] || 'M',
      color: product.colors[0] || '#111111',
    })
    window.dispatchEvent(new Event('open-cart'))
  }

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 35 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
      className={`group relative flex flex-col justify-between overflow-hidden bg-cream/40 p-4 border border-charcoal/5 rounded-[2rem] hover:shadow-[0_24px_80px_rgba(17,17,17,0.06)] transition-all duration-750 ${className}`}
    >
      {/* 4:5 Aspect Ratio Image Container */}
      <Link 
        to={`/product/${product.id}`}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.6rem] bg-[#f5efe6] flex items-center justify-center pointer-events-auto"
      >
        <motion.img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-103 group-hover:translate-y-[-4px]"
          style={{ opacity: isLoaded ? 1 : 0 }}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Soft mounting background blur or pulse before loaded */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-[#f5efe6] flex items-center justify-center">
            <div className="w-4/5 h-4/5 rounded bg-beige/30 animate-pulse" />
          </div>
        )}

        {/* Category tag */}
        <div className="absolute left-4 top-4 overflow-hidden z-10">
          <span className="inline-block rounded-full bg-cream/90 backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-charcoal/70 border border-charcoal/5 font-sans">
            {product.category}
          </span>
        </div>

        {/* Low Stock Warning Pill */}
        {product.stockStatus === 'low-stock' && (
          <div className="absolute right-4 top-4 z-10">
            <span className="inline-block rounded-full bg-[#D4A574]/10 border border-[#D4A574]/20 px-2.5 py-0.5 text-[8px] uppercase tracking-[0.15em] text-umber font-semibold font-sans">
              Low Stock
            </span>
          </div>
        )}

        {/* Out of Stock Banner */}
        {product.stockStatus === 'out-of-stock' && (
          <div className="absolute inset-0 bg-charcoal/20 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="rounded-full bg-charcoal/90 text-cream px-4 py-1.5 text-[9px] uppercase tracking-[0.25em] font-medium border border-white/10 font-sans">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Details Container */}
      <div className="mt-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <Link to={`/product/${product.id}`} className="hover:underline">
              <h3 className="font-display font-light text-2xl tracking-wide text-charcoal group-hover:text-umber transition-colors duration-500">
                {product.name}
              </h3>
            </Link>
            <p className="font-display text-lg text-charcoal/80 mt-1">{product.price}</p>
          </div>

          {/* Description reveal on hover */}
          <p className="mt-2 text-xs text-charcoal/60 leading-relaxed font-light font-sans max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden">
            {product.description}
          </p>

          {/* Sizes and Colors */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-charcoal/5 pt-3">
            <div className="flex gap-1 font-sans">
              {product.sizes.map((s) => (
                <span
                  key={s}
                  className="text-[8px] font-medium tracking-wider text-charcoal/40 border border-charcoal/10 rounded px-1.5 py-0.5"
                >
                  {s}
                </span>
              ))}
            </div>
            
            <div className="flex gap-1">
              {product.colors.map((c) => (
                <span
                  key={c}
                  className="h-2.5 w-2.5 rounded-full border border-charcoal/10"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Buttons: Slide up on hover (disabled when out of stock) */}
        {product.stockStatus !== 'out-of-stock' ? (
          <div className="mt-5 flex flex-col sm:flex-row gap-2 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 opacity-100 translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-full border border-charcoal/20 bg-cream/50 text-charcoal px-3 py-2.5 text-[9px] uppercase tracking-[0.2em] font-medium hover:border-charcoal hover:bg-charcoal/5 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-500 font-sans"
            >
              Add to Cart
            </button>
            
            <button
              onClick={handleShopNow}
              className="flex-1 rounded-full bg-charcoal text-cream px-3 py-2.5 text-[9px] uppercase tracking-[0.2em] font-medium hover:bg-black hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-500 font-sans"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="mt-5 flex flex-col sm:flex-row gap-2 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 opacity-100 translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
            <button
              disabled
              className="flex-1 rounded-full border border-charcoal/10 bg-cream/20 text-charcoal/30 px-3 py-2.5 text-[9px] uppercase tracking-[0.2em] font-medium cursor-not-allowed text-center font-sans"
            >
              Out of Stock
            </button>
          </div>
        )}
      </div>
    </motion.article>
  )
}

export function ShopPage() {
  const { products } = useProductStore()
  const [activeTab, setActiveTab] = useState<'all' | 'indian' | 'western' | 'navratri' | 'heritage'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initial page header entry animation
    gsap.fromTo(
      '.shop-header-text',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.1,
      }
    )

    // Initial mount loading trigger
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  // Trigger loading skeleton on category switch
  const handleTabChange = (tab: 'all' | 'indian' | 'western' | 'navratri' | 'heritage') => {
    if (tab === activeTab) return
    setIsLoading(true)
    setActiveTab(tab)
    setTimeout(() => {
      setIsLoading(false)
    }, 900)
  }

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true
    if (activeTab === 'indian') return p.category.toLowerCase().includes('indian')
    if (activeTab === 'western') return p.category.toLowerCase().includes('western')
    if (activeTab === 'navratri') return p.category.toLowerCase().includes('navratri')
    if (activeTab === 'heritage') return p.isFeatured && p.priceValue > 25000
    return true
  })

  // Staggered grid layouts for asymmetric look
  const getGridClasses = (index: number) => {
    const layouts = [
      'col-span-12 md:col-span-8 md:col-start-1 lg:col-span-7', // 0: Wide hero feature
      'col-span-12 md:col-span-4 md:col-start-9 lg:col-span-5 md:mt-24', // 1: Compact staggered
      'col-span-12 md:col-span-6 md:col-start-1 lg:col-span-5 lg:pl-8', // 2: Inset medium
      'col-span-12 md:col-span-6 md:col-start-7 lg:col-span-7 lg:mt-[-4rem]', // 3: Cinematic offset
      'col-span-12 md:col-span-5 md:col-start-1 lg:col-span-4 md:mt-16', // 4: Compact side
      'col-span-12 md:col-span-7 md:col-start-6 lg:col-span-8 lg:pl-16', // 5: Wide elegant card
      'col-span-12 md:col-span-6 md:col-start-1 lg:col-span-6 md:mt-[-2rem]', // 6: Inset card
      'col-span-12 md:col-span-6 md:col-start-7 lg:col-span-5 lg:pl-8', // 7: Staggered card
    ]
    return layouts[index % layouts.length]
  }

  const tabs = [
    { id: 'all', label: 'All Pieces' },
    { id: 'indian', label: 'The Indian Collection' },
    { id: 'western', label: 'Western Edit' },
    { id: 'navratri', label: 'Navratri Couture' },
    { id: 'heritage', label: 'Heritage Fashion' },
  ] as const

  return (
    <PageTransition>
      <section className="bg-cream min-h-screen pb-20">
        {/* Fullscreen Campaign Showcase */}
        <ShopCampaignCarousel />

        <div className="mx-auto w-[min(1200px,92vw)] pt-20">
          {/* Header */}
          <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-charcoal/10 pb-10">
            <div>
              <p className="shop-header-text text-xs uppercase tracking-[0.4em] text-umber font-semibold font-sans">
                Featured Pieces
              </p>
              <h1 className="shop-header-text mt-4 text-4xl sm:text-5xl md:text-6xl font-light tracking-tight font-display text-charcoal leading-none">
                Refined Wardrobe.
              </h1>
            </div>
            <p className="shop-header-text text-xs uppercase tracking-[0.3em] text-charcoal/50 font-light max-w-xs md:text-right font-sans">
              Curated luxury garments blending heritage craftsmanship with contemporary silhouettes.
            </p>
          </div>

          {/* Luxury Tabbed Navigation using display serif typography */}
          <div className="flex justify-center pb-4 mb-24">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-center relative w-full border-b border-charcoal/10 pb-6">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative py-2 transition-colors duration-500 font-display text-lg sm:text-xl font-light tracking-wide ${
                      isActive ? 'text-charcoal font-medium' : 'text-charcoal/40 hover:text-charcoal/70'
                    }`}
                  >
                    <span className={isActive ? 'italic' : ''}>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-charcoal"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Product Grid / Skeleton Showcase */}
          <div className="pb-32">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading-skeletons"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 },
                    },
                  }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-16 md:gap-y-32 lg:gap-x-20"
                >
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <ProductSkeleton key={idx} className={getGridClasses(idx)} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.06 },
                    },
                  }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-16 md:gap-y-32 lg:gap-x-20"
                >
                  {filteredProducts.map((product, idx) => (
                    <React.Fragment key={product.id}>
                      {idx === 2 && (
                        <div className="col-span-12 md:col-span-6 lg:col-span-7 flex flex-col justify-center p-8 sm:p-12 lg:p-20 bg-beige/25 border border-charcoal/5 rounded-[2rem] min-h-[240px] sm:min-h-[300px] mb-8 md:mb-0">
                          <span className="text-[10px] uppercase tracking-[0.3em] text-umber font-semibold mb-4 font-sans">Heritage Couture</span>
                          <p className="font-display font-light text-2xl sm:text-3xl text-charcoal italic leading-relaxed">
                            "Garments that whisper the history of craftsmanship, tailored for the contemporary silhouette."
                          </p>
                          <div className="h-[1px] w-12 bg-charcoal/20 mt-6" />
                        </div>
                      )}
                      
                      {idx === 5 && (
                        <div className="col-span-12 md:col-span-5 lg:col-span-4 flex flex-col justify-center p-8 sm:p-10 lg:p-14 bg-cream border border-charcoal/5 rounded-[2rem] min-h-[240px] sm:min-h-[300px] mb-8 md:mb-0">
                          <span className="text-[10px] uppercase tracking-[0.3em] text-umber font-semibold mb-4 font-sans">The Campaign Edit</span>
                          <h3 className="font-display font-light text-3xl text-charcoal tracking-wide mb-6">
                            Atelier Monologues
                          </h3>
                          <p className="font-sans font-light text-sm text-charcoal/70 leading-relaxed">
                            Shot under the warm Rajasthan sun, our SS/2026 collection is an exploration of raw silks, linen structures, and fine needlepoint detail.
                          </p>
                        </div>
                      )}
                      
                      <ProductCard product={product} className={getGridClasses(idx)} />
                    </React.Fragment>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

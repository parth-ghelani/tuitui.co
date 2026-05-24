import { useState, useEffect } from 'react'
import { PageTransition } from '../components/layout/PageTransition'
import { Heart } from '@phosphor-icons/react'
import { useCartStore } from '../store/useCartStore'
import { useProductStore } from '../store/useProductStore'
import { useParams, Link } from 'react-router-dom'

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const products = useProductStore((state) => state.products)
  const { addItem } = useCartStore()

  // Find active product or fall back to first one
  const product = products.find((p) => p.id === id) || products[0]

  // Construct gallery dynamically using the product's own image plus two other premium showcase images
  const otherImages = products
    .filter((p) => p.id !== product.id)
    .map((p) => p.image)
    .slice(0, 2)
  const gallery = [product.image, ...otherImages]

  const [selectedSize, setSelectedSize] = useState('M')
  const [activeImage, setActiveImage] = useState(gallery[0])

  // Sync active image when product changes
  useEffect(() => {
    setActiveImage(product.image)
  }, [product])

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceValue: product.priceValue,
      image: product.image,
      size: selectedSize,
      color: product.colors[0] || '#111111',
    })
    // Fire event to open cart drawer dynamically
    window.dispatchEvent(new Event('open-cart'))
  }

  return (
    <PageTransition>
      <section className="bg-cream py-20 min-h-screen">
        <div className="mx-auto w-[min(1200px,92vw)] mb-8">
          <Link to="/shop" className="text-xs uppercase tracking-[0.25em] text-charcoal/50 hover:text-charcoal transition-colors">
            &larr; Back to Collections
          </Link>
        </div>

        <div className="mx-auto grid w-[min(1200px,92vw)] gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-charcoal/10 bg-white/80 p-3 shadow-sm">
              <div className="overflow-hidden rounded-[calc(2rem-0.5rem)] aspect-[4/5] bg-[#f5efe6] flex items-center justify-center">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                />
              </div>
            </div>
            
            {/* Dynamic Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
              {gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(image)}
                  className={`rounded-[1.5rem] border p-2 transition-all duration-300 ${
                    activeImage === image
                      ? 'border-charcoal bg-white shadow-sm'
                      : 'border-charcoal/10 bg-white/80 hover:border-charcoal/30'
                  }`}
                >
                  <div className="aspect-[4/5] w-full rounded-[calc(1.5rem-0.5rem)] overflow-hidden bg-[#f5efe6] flex items-center justify-center">
                    <img
                      src={image}
                      alt={`Product alternate ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 flex flex-col justify-center">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-umber font-semibold font-sans">
                {product.category}
              </p>
              <h1 className="text-4xl sm:text-5xl font-light font-display text-charcoal tracking-wide leading-tight">
                {product.name}
              </h1>
              <p className="font-display text-2xl text-charcoal/90 mt-2">{product.price}</p>
            </div>

            <p className="text-sm leading-relaxed text-charcoal/70 font-sans font-light">
              {product.description}
            </p>

            <div className="border-t border-charcoal/10 pt-6">
              <p className="text-xs uppercase tracking-[0.4em] text-charcoal/60 font-sans">
                Select size
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 rounded-full border px-5 text-xs uppercase tracking-[0.4em] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] font-sans ${
                      selectedSize === size
                        ? 'border-charcoal bg-charcoal text-cream'
                        : 'border-charcoal/20 hover:border-charcoal hover:bg-charcoal/5 text-charcoal'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              {product.stockStatus !== 'out-of-stock' ? (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-full bg-charcoal px-6 py-4 text-xs uppercase tracking-[0.4em] text-cream transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-black hover:shadow-lg font-sans"
                >
                  Add to cart
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 rounded-full border border-charcoal/10 bg-cream/20 text-charcoal/30 px-6 py-4 text-xs uppercase tracking-[0.4em] cursor-not-allowed font-sans text-center"
                >
                  Out of Stock
                </button>
              )}
              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/20 hover:border-charcoal transition-colors">
                <Heart size={18} weight="light" />
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-charcoal/10 bg-white/70 p-6 text-sm text-charcoal/70 font-sans font-light">
              Free shipping on orders over ₹5,000. 30-day return guarantee.
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

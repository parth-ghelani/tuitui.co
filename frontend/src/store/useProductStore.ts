import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export interface Product {
  id: string
  name: string
  category: string
  price: string
  priceValue: number
  discountPrice?: string
  image: string
  description: string
  colors: string[]
  sizes: string[]
  quantity: number
  stockStatus: 'in-stock' | 'out-of-stock' | 'low-stock'
  sellerId: string
  isFeatured?: boolean
}

export interface HeroSlide {
  id: string
  index: string
  subtitle: string
  title: string
  heading: string
  narrative: string
  imageBg: string
  imageFg: string
  ctaText: string
  label: string
  place: string
  coords: string
}

interface ProductState {
  products: Product[]
  heroSlides: HeroSlide[]
  isLoading: boolean
  fetchProducts: () => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: string, updatedFields: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  updateHeroSlide: (index: number, updatedFields: Partial<HeroSlide>) => void
}

// ---------------------------------------------------------------------------
// Image translation helper (translates old database seed paths to shop-showcase paths)
// ---------------------------------------------------------------------------
function mapLegacyImage(img: string): string {
  if (!img) return img
  if (img.startsWith('/images/showcase/')) {
    if (img.includes('1736')) {
      return '/images/shop-showcase/change_the_ratio_2K_202605241737 (2).jpeg' // Red lehenga
    }
    if (img.includes('1810') || img.includes('1723')) {
      return '/images/shop-showcase/change_the_ratio_2K_202605241737.jpeg' // Maroon kurta / Udaipur heritage
    }
    if (img.includes('hero_202605231903')) {
      return '/images/shop-showcase/change_the_ratio_2K_202605241751.jpeg' // Floral gown
    }
    if (img.includes('navratri_top') || img.includes('1000000419') || img.includes('202605221056')) {
      return '/images/shop-showcase/Ultra_realistic_faceless_luxury_fashion_202605221056.jpeg' // Navratri blouse
    }
    // Fallback/Default matching coordination set
    return '/images/shop-showcase/change_the_ratio_2K_202605241737 (1).jpeg'
  }
  return img
}

// ---------------------------------------------------------------------------
// Local seed data (fallback when Supabase table is empty or unreachable)
// ---------------------------------------------------------------------------
const initialProducts: Product[] = [
  {
    id: 'ind-1',
    name: 'Mridula Silk Lehenga',
    category: 'Indian Collection',
    price: '₹32,500',
    priceValue: 32500,
    image: '/images/shop-showcase/change_the_ratio_2K_202605241737 (2).jpeg',
    description: 'An ethereal Varanasi silk lehenga featuring gold thread embroidery and structured pleats.',
    colors: ['#E8DED1', '#8B7355', '#111111'],
    sizes: ['S', 'M', 'L'],
    quantity: 12,
    stockStatus: 'in-stock',
    sellerId: 'seller-1',
    isFeatured: true,
  },
  {
    id: 'ind-2',
    name: 'Zoya Chanderi Kurta Set',
    category: 'Indian Collection',
    price: '₹14,200',
    priceValue: 14200,
    image: '/images/shop-showcase/change_the_ratio_2K_202605241737.jpeg',
    description: 'Breathable Chanderi weave kurta paired with tapered trousers and a matching hand-woven cotton dupatta.',
    colors: ['#8B7355', '#6B4B44'],
    sizes: ['S', 'M', 'L'],
    quantity: 18,
    stockStatus: 'in-stock',
    sellerId: 'seller-1',
    isFeatured: true,
  },
  {
    id: 'ind-3',
    name: 'Ishwari Silk Sharara',
    category: 'Indian Collection',
    price: '₹28,500',
    priceValue: 28500,
    image: '/images/shop-showcase/change_the_ratio_2K_202605241751.jpeg',
    description: 'A celebratory silhouette in silk georgette, structured with a flared sharara and gota borders.',
    colors: ['#D4A574', '#E8DED1'],
    sizes: ['S', 'M', 'L'],
    quantity: 15,
    stockStatus: 'in-stock',
    sellerId: 'seller-2',
    isFeatured: false,
  },
  {
    id: 'ind-4',
    name: 'Mewar Organza Anarkali',
    category: 'Indian Collection',
    price: '₹19,500',
    priceValue: 19500,
    image: '/images/shop-showcase/change_the_ratio_2K_202605241737.jpeg',
    description: 'Ethereal translucent silk organza, layering a soft slip and finished with fine needlepoint embellishments.',
    colors: ['#F8F5F1'],
    sizes: ['XS', 'S', 'M'],
    quantity: 6,
    stockStatus: 'in-stock',
    sellerId: 'seller-3',
    isFeatured: true,
  },
  {
    id: 'ind-5',
    name: 'Velvet Palazzo Suit',
    category: 'Indian Collection',
    price: '₹22,800',
    priceValue: 22800,
    image: '/images/shop-showcase/change_the_ratio_2K_202605241737 (1).jpeg',
    description: 'Plush micro-velvet kurta set detailed with gota patti handwork, paired with wide-leg trousers.',
    colors: ['#6B4B44', '#8B7355'],
    sizes: ['S', 'M', 'L'],
    quantity: 3,
    stockStatus: 'low-stock',
    sellerId: 'seller-3',
    isFeatured: false,
  },
  {
    id: 'nav-1',
    name: 'Navratri Couture Blouse',
    category: 'Navratri Collection',
    price: '₹12,800',
    priceValue: 12800,
    image: '/images/shop-showcase/Ultra_realistic_faceless_luxury_fashion_202605221056.jpeg',
    description: 'Intricately embroidered celebratory bodice, featuring hand-crafted mirrors and detailed thread-work.',
    colors: ['#D4A574', '#6B4B44'],
    sizes: ['XS', 'S', 'M', 'L'],
    quantity: 8,
    stockStatus: 'in-stock',
    sellerId: 'seller-3',
    isFeatured: true,
  },
  {
    id: 'nav-2',
    name: 'Rabari Heritage Jacket',
    category: 'Navratri Collection',
    price: '₹16,500',
    priceValue: 16500,
    image: '/images/shop-showcase/Ultra_realistic_faceless_luxury_fashion_202605221056.jpeg',
    description: 'A heritage vest showcasing traditional mirror work and heavy cotton embellishments from Kutch.',
    colors: ['#F8F5F1', '#111111'],
    sizes: ['S', 'M', 'L'],
    quantity: 5,
    stockStatus: 'in-stock',
    sellerId: 'seller-2',
    isFeatured: false,
  },
  {
    id: 'west-1',
    name: 'Architectural Linen Blazer',
    category: 'Western Collection',
    price: '₹18,900',
    priceValue: 18900,
    image: '/images/shop-showcase/change_the_ratio_2K_202605241737 (1).jpeg',
    description: 'Double-breasted blazer in premium water-resistant linen twill with structural shoulder details.',
    colors: ['#8B7355', '#E8DED1', '#111111'],
    sizes: ['S', 'M', 'L', 'XL'],
    quantity: 14,
    stockStatus: 'in-stock',
    sellerId: 'seller-1',
    isFeatured: true,
  },
  {
    id: 'west-2',
    name: 'Luxe Satin Wrap Dress',
    category: 'Western Collection',
    price: '₹24,000',
    priceValue: 24000,
    image: '/images/shop-showcase/change_the_ratio_2K_202605241737 (1).jpeg',
    description: 'Elegant wrap midi dress crafted in rich structured satin with architectural pleating.',
    colors: ['#F8F5F1', '#D4A574'],
    sizes: ['XS', 'S', 'M', 'L'],
    quantity: 9,
    stockStatus: 'in-stock',
    sellerId: 'seller-2',
    isFeatured: true,
  },
  {
    id: 'west-3',
    name: 'Asymmetric Editorial Gown',
    category: 'Western Collection',
    price: '₹42,000',
    priceValue: 42000,
    image: '/images/shop-showcase/change_the_ratio_2K_202605241751.jpeg',
    description: 'A breathtaking floor-length couture dress featuring clean lines and a structured asymmetric silhouette.',
    colors: ['#111111', '#E8DED1'],
    sizes: ['M', 'L'],
    quantity: 2,
    stockStatus: 'low-stock',
    sellerId: 'seller-1',
    isFeatured: false,
  },
  {
    id: 'west-4',
    name: 'Campaign Silk Trench',
    category: 'Western Collection',
    price: '₹48,500',
    priceValue: 48500,
    image: '/images/shop-showcase/change_the_ratio_2K_202605241737 (1).jpeg',
    description: 'A luxurious oversized silk wrap trench designed for dynamic seasonal layering.',
    colors: ['#8B7355', '#6B4B44'],
    sizes: ['S', 'M', 'L'],
    quantity: 7,
    stockStatus: 'in-stock',
    sellerId: 'seller-2',
    isFeatured: true,
  },
  {
    id: 'west-5',
    name: 'Minimalist Utility Vest',
    category: 'Western Collection',
    price: '₹8,200',
    priceValue: 8200,
    image: '/images/shop-showcase/change_the_ratio_2K_202605241737 (1).jpeg',
    description: 'A modern utilitarian vest structured with clean panels, silver zipper hardware, and adjustable side straps.',
    colors: ['#8B7355', '#E8DED1'],
    sizes: ['M', 'L'],
    quantity: 4,
    stockStatus: 'in-stock',
    sellerId: 'seller-2',
    isFeatured: false,
  },
]

const initialHeroSlides: HeroSlide[] = [
  {
    id: 'udaipur',
    index: '01',
    subtitle: 'THE UDAIPUR SAGA',
    title: 'Mewar Monologue',
    heading: 'Whispering Silk, Silent Stone.',
    narrative: "An aesthetic dialogue between Mewar's historic fortress walls and the fluid grace of modern hand-loomed drapes. Woven in raw tussar silk and structural handlooms.",
    imageBg: '/images/editorial/udaipur-1.jpg',
    imageFg: '/images/editorial/udaipur-1.jpg',
    ctaText: 'Enter Udaipur',
    label: 'CAMPAIGN IV / 2026',
    place: 'MEWAR, RAJASTHAN',
    coords: '24.58° N, 73.71° E',
  },
  {
    id: 'desert',
    index: '02',
    subtitle: 'DESERT SUNSET SAGA',
    title: 'Dunes & Drape',
    heading: 'Where Sand Meets Symphony.',
    narrative: 'Soft sandstone shades and fluid resort linen drifting effortlessly through the silent dunes of Jaisalmer. Crafted for the modern nomad.',
    imageBg: '/images/editorial/desert-1.jpg',
    imageFg: '/images/editorial/desert-1.jpg',
    ctaText: 'Explore Dunes',
    label: 'CAMPAIGN V / 2026',
    place: 'THAR DUNES, JAISALMER',
    coords: '26.91° N, 70.90° E',
  },
  {
    id: 'saree',
    index: '03',
    subtitle: 'THE ROYAL SAREES',
    title: 'Heritage Weft',
    heading: 'Woven Dreams, Unspoken Grace.',
    narrative: "Intricately hand-woven metallic sarees and ensembles, layered with contemporary structural tailoring. An ode to Varanasi's living looms.",
    imageBg: '/images/editorial/saree-1.jpg',
    imageFg: '/images/editorial/saree-1.jpg',
    ctaText: 'Discover drapes',
    label: 'CAMPAIGN VI / 2026',
    place: 'VARANASI ATELIER',
    coords: '25.31° N, 82.97° E',
  },
]

// ---------------------------------------------------------------------------
// Row mapper: Supabase snake_case → camelCase Product
// ---------------------------------------------------------------------------
function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    priceValue: row.price_value,
    discountPrice: row.discount_price ?? undefined,
    image: mapLegacyImage(row.image),
    description: row.description,
    colors: row.colors ?? [],
    sizes: row.sizes ?? [],
    quantity: row.quantity,
    stockStatus: row.stock_status,
    sellerId: row.seller_id,
    isFeatured: row.is_featured ?? false,
  }
}

// ---------------------------------------------------------------------------
// Row mapper: camelCase Product → Supabase snake_case row
// ---------------------------------------------------------------------------
function productToRow(p: Product | Omit<Product, 'id'>) {
  return {
    ...('id' in p ? { id: p.id } : {}),
    name: p.name,
    category: p.category,
    price: p.price,
    price_value: p.priceValue,
    discount_price: p.discountPrice ?? null,
    image: p.image,
    description: p.description,
    colors: p.colors,
    sizes: p.sizes,
    quantity: p.quantity,
    stock_status: p.stockStatus,
    seller_id: p.sellerId,
    is_featured: p.isFeatured ?? false,
  }
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export const useProductStore = create<ProductState>((set, get) => ({
  products: initialProducts,
  heroSlides: initialHeroSlides,
  isLoading: false,

  // ── FETCH ────────────────────────────────────────────────────────────────
  fetchProducts: async () => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error

      if (data && data.length > 0) {
        set({ products: data.map(rowToProduct) })
      } else {
        // Table is empty → self-seed with local data then re-fetch
        const rows = initialProducts.map(productToRow)
        const { error: seedError } = await supabase.from('products').insert(rows)
        if (!seedError) {
          const { data: seeded } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: true })
          if (seeded && seeded.length > 0) {
            set({ products: seeded.map(rowToProduct) })
          }
        }
        // If seed fails, keep initialProducts (already set)
      }
    } catch (err) {
      console.warn('[useProductStore] Supabase fetch failed, using local data.', err)
      // Keep initialProducts already set above
    } finally {
      set({ isLoading: false })
    }
  },

  // ── ADD ──────────────────────────────────────────────────────────────────
  addProduct: async (newProd) => {
    const currentProducts = get().products
    const prefix = newProd.category.toLowerCase().startsWith('indian') ? 'ind' :
      newProd.category.toLowerCase().startsWith('navratri') ? 'nav' : 'west'
    const newId = `${prefix}-${currentProducts.length + 1}-${Date.now()}`

    const productWithId: Product = { ...newProd, id: newId }

    // Optimistic update
    set({ products: [...currentProducts, productWithId] })

    try {
      const { error } = await supabase.from('products').insert([productToRow(productWithId)])
      if (error) throw error
    } catch (err) {
      console.error('[useProductStore] addProduct failed:', err)
      // Rollback
      set({ products: currentProducts })
    }
  },

  // ── UPDATE ───────────────────────────────────────────────────────────────
  updateProduct: async (id, updatedFields) => {
    const prev = get().products
    const updated = prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))

    // Optimistic update
    set({ products: updated })

    try {
      const row = productToRow({ ...prev.find((p) => p.id === id)!, ...updatedFields })
      const { id: _id, ...rowWithoutId } = row as typeof row & { id: string }
      const { error } = await supabase.from('products').update(rowWithoutId).eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('[useProductStore] updateProduct failed:', err)
      // Rollback
      set({ products: prev })
    }
  },

  // ── DELETE ───────────────────────────────────────────────────────────────
  deleteProduct: async (id) => {
    const prev = get().products

    // Optimistic update
    set({ products: prev.filter((p) => p.id !== id) })

    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('[useProductStore] deleteProduct failed:', err)
      // Rollback
      set({ products: prev })
    }
  },

  // ── HERO SLIDES (local only) ─────────────────────────────────────────────
  updateHeroSlide: (index, updatedFields) => {
    set((state) => {
      const slides = [...state.heroSlides]
      if (slides[index]) {
        slides[index] = { ...slides[index], ...updatedFields }
      }
      return { heroSlides: slides }
    })
  },
}))

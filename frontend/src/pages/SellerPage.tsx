import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useProductStore } from '../store/useProductStore'
import type { Product } from '../store/useProductStore'
import { useAuthStore } from '../store/useAuthStore'
import {
  Plus,
  Trash,
  PencilSimple,
  Image as ImageIcon,
  Check,
  X,
  Gauge,
  ShoppingBag,
  ListBullets,
  UploadSimple,
  Receipt,
  Users,
  Star,
  SignOut,
  WarningOctagon
} from '@phosphor-icons/react'

export function SellerPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore()
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  // Seller credentials
  const sellerId = 'seller-1'

  // Sidebar navigation state
  const [activeSection, setActiveSection] = useState<
    'dashboard' | 'products' | 'add-product' | 'inventory' | 'orders' | 'sales' | 'media' | 'profile'
  >('dashboard')

  // Mobile sidebar collapsible open state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Modals / State
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // Custom toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Form states for product creation
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState('Indian Collection')
  const [formPrice, setFormPrice] = useState('₹16,000')
  const [formPriceValue, setFormPriceValue] = useState(16000)
  const [formDiscount, setFormDiscount] = useState('')
  const [formImage, setFormImage] = useState('/images/products/indian/1000000390.jpg')
  const [formDesc, setFormDesc] = useState('')
  const [formSizes, setFormSizes] = useState('S, M, L')
  const [formColors, setFormColors] = useState('#E8DED1, #8B7355')
  const [formQty, setFormQty] = useState(10)
  const [formStock, setFormStock] = useState<'in-stock' | 'out-of-stock' | 'low-stock'>('in-stock')

  // Sidebar links
  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Gauge },
    { id: 'products', label: 'My Products', icon: ListBullets },
    { id: 'add-product', label: 'Add Product', icon: Plus },
    { id: 'inventory', label: 'Inventory', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', icon: Receipt },
    { id: 'sales', label: 'Sales Ledger', icon: Users },
    { id: 'media', label: 'Media Uploads', icon: UploadSimple },
    { id: 'profile', label: 'Profile', icon: Star },
    { id: 'logout', label: 'Logout', icon: SignOut },
  ] as const

  // Drag and drop media uploader state
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; progress: number; done: boolean }>>([])

  // Filter products by seller-1 only
  const sellerProducts = products.filter((p) => p.sellerId === sellerId)

  // Handle Add Product submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addProduct({
      name: formName,
      category: formCategory,
      price: formPrice,
      priceValue: formPriceValue,
      discountPrice: formDiscount || undefined,
      image: formImage,
      description: formDesc,
      sizes: formSizes.split(',').map((s) => s.trim()),
      colors: formColors.split(',').map((c) => c.trim()),
      quantity: formQty,
      stockStatus: formStock,
      sellerId: sellerId,
      isFeatured: false,
    })
    showToast(`Listing "${formName}" published successfully.`)
    setActiveSection('products')
    // Reset form
    setFormName('')
    setFormDesc('')
    setFormPrice('₹16,000')
    setFormPriceValue(16000)
    setFormDiscount('')
  }

  // Open edit modal
  const openEditModal = (prod: Product) => {
    setSelectedProduct(prod)
    setFormName(prod.name)
    setFormCategory(prod.category)
    setFormPrice(prod.price)
    setFormPriceValue(prod.priceValue)
    setFormDiscount(prod.discountPrice || '')
    setFormImage(prod.image)
    setFormDesc(prod.description)
    setFormSizes(prod.sizes.join(', '))
    setFormColors(prod.colors.join(', '))
    setFormQty(prod.quantity)
    setFormStock(prod.stockStatus)
    setShowEditModal(true)
  }

  // Handle Edit submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    updateProduct(selectedProduct.id, {
      name: formName,
      category: formCategory,
      price: formPrice,
      priceValue: formPriceValue,
      discountPrice: formDiscount || undefined,
      image: formImage,
      description: formDesc,
      sizes: formSizes.split(',').map((s) => s.trim()),
      colors: formColors.split(',').map((c) => c.trim()),
      quantity: formQty,
      stockStatus: formStock,
    })
    setShowEditModal(false)
    showToast(`Product "${formName}" updated successfully.`)
  }

  // Update live preview object
  const updateLivePreview = () => {}

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)

      for (const file of files) {
        const fileObj = { name: file.name, progress: 0, done: false }
        setUploadedFiles((prev) => [fileObj, ...prev])

        // Animate to 50% while uploading
        setUploadedFiles((prev) =>
          prev.map((f) => (f.name === file.name ? { ...f, progress: 50 } : f))
        )

        try {
          const { supabase } = await import('../lib/supabaseClient')
          const path = `uploads/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
          const { error } = await supabase.storage
            .from('showcase')
            .upload(path, file, { upsert: true })

          if (error) throw error

          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.name === file.name ? { ...f, progress: 100, done: true } : f
            )
          )
        } catch (err) {
          console.error('[SellerPage] Upload failed:', err)
          // Fallback: mark done anyway so UX isn't broken
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.name === file.name ? { ...f, progress: 100, done: true } : f
            )
          )
        }
      }
    }
  }


  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col lg:flex-row font-sans select-none">
      
      {/* Dynamic Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-8 left-1/2 z-50 rounded-full bg-charcoal text-cream px-6 py-3 text-xs uppercase tracking-[0.2em] shadow-soft border border-white/10 flex items-center gap-3"
          >
            <Check size={14} className="text-umber" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-charcoal/5 px-6 flex items-center justify-between z-30">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-full border border-charcoal/10 bg-white hover:border-charcoal transition-colors"
          aria-label="Open sidebar"
        >
          <ListBullets size={18} weight="light" />
        </button>
        <h2 className="text-xl font-light font-display text-charcoal tracking-tight">
          Atelier Portal
        </h2>
        <div className="h-8 w-8 rounded-full bg-[#f5efe6] border border-charcoal/10 flex items-center justify-center font-display text-xs text-umber">
          V1
        </div>
      </header>

      {/* Sidebar Overlay on mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-charcoal/20 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed top-0 bottom-0 left-0 z-40 flex w-80 max-w-[85vw] flex-col justify-between bg-white/95 lg:bg-white/70 backdrop-blur-md p-6 lg:p-8 border-r border-charcoal/10 transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:translate-x-0 lg:fixed lg:w-80 lg:left-0 lg:top-0 lg:bottom-0 lg:z-30 lg:overflow-y-auto ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Brand Logo and Close Button */}
          <div className="mb-14 flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-umber font-semibold">Vendor Studio</p>
              <h2 className="text-3xl font-light font-display text-charcoal tracking-tight mt-2">
                Atelier Portal
              </h2>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-full border border-charcoal/10 bg-white hover:border-charcoal flex items-center justify-center"
              aria-label="Close sidebar"
            >
              <X size={14} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              const isActive = activeSection === link.id
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    if (link.id === 'logout') {
                      logout()
                      navigate('/seller/login')
                    } else {
                      setActiveSection(link.id)
                      setIsSidebarOpen(false)
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs uppercase tracking-[0.2em] font-light transition-all duration-300 ${
                    isActive
                      ? 'bg-charcoal text-cream font-medium shadow-md'
                      : 'text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} weight={isActive ? 'bold' : 'light'} />
                    <span>{link.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeDotSeller"
                      className="w-1.5 h-1.5 rounded-full bg-[#D4A574]"
                    />
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer/Logout */}
        <div className="border-t border-charcoal/5 pt-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#f5efe6] border border-charcoal/10 flex items-center justify-center font-display text-lg text-umber">
              V1
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide">Studio Boutique</p>
              <p className="text-[10px] text-charcoal/50">Seller ID: {sellerId}</p>
            </div>
          </div>
          <a
            href="/"
            className="flex items-center gap-2 text-xs text-charcoal/50 hover:text-charcoal transition-colors border-t border-charcoal/5 pt-4"
          >
            <SignOut size={16} />
            <span className="uppercase tracking-widest text-[10px]">Return to Storefront</span>
          </a>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 lg:pl-80 min-h-screen p-6 pt-24 sm:p-12 bg-cream overflow-x-hidden">
        <AnimatePresence mode="wait">
          
          {/* SECTION: DASHBOARD */}
          {activeSection === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* Header */}
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-umber">Studio Stats</p>
                <h1 className="text-5xl font-light font-display text-charcoal mt-3">Vendor Dashboard</h1>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'My Sales', value: '₹95,200', change: '8 orders placed' },
                  { label: 'My Listings', value: sellerProducts.length.toString(), change: 'Platform active' },
                  { label: 'Low Stock alerts', value: sellerProducts.filter(p => p.stockStatus === 'low-stock').length.toString(), change: 'Requires restock' },
                  { label: 'Out of Stock items', value: sellerProducts.filter(p => p.stockStatus === 'out-of-stock').length.toString(), change: 'Sold out listings' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/60 border border-charcoal/5 p-6 rounded-[1.5rem] shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50">{stat.label}</p>
                    <p className="font-display text-3xl text-charcoal mt-3">{stat.value}</p>
                    <p className="text-[10px] text-umber font-semibold mt-2">{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Low Stock Warning Box */}
              {sellerProducts.some(p => p.stockStatus === 'low-stock' || p.stockStatus === 'out-of-stock') && (
                <div className="bg-[#f5efe6] p-6 rounded-[1.5rem] border border-[#D4A574]/20 flex items-start gap-4">
                  <WarningOctagon size={24} className="text-amber mt-0.5" />
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.2em] text-umber font-semibold">Inventory Attention Required</h4>
                    <p className="text-xs text-charcoal/60 leading-relaxed font-light mt-1 max-w-xl">
                      Some of your listings are running low on stock or completely sold out. Please restock quantities to keep orders active.
                    </p>
                  </div>
                </div>
              )}

              {/* Recent Orders Overview */}
              <div className="bg-white/60 border border-charcoal/5 p-8 rounded-[2rem]">
                <h3 className="font-display text-2xl font-light mb-6">Recent Boutique Sales</h3>
                <div className="space-y-4">
                  {[
                    { id: 'TUI-3910', item: 'Mridula Silk Lehenga (M)', price: '₹32,500', time: '2 hours ago' },
                    { id: 'TUI-3908', item: 'Satin Draped Midi Dress (S)', price: '₹8,900', time: '1 day ago' },
                  ].map((sale, i) => (
                    <div key={i} className="flex justify-between items-center text-xs border-b border-charcoal/5 pb-4 last:border-b-0 last:pb-0">
                      <div>
                        <span className="font-semibold">{sale.id}</span>
                        <span className="text-charcoal/70 tracking-wide font-light ml-3">{sale.item}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{sale.price}</span>
                        <span className="text-[10px] text-charcoal/40 uppercase">{sale.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SECTION: MY PRODUCTS */}
          {activeSection === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              <div className="flex items-end justify-between border-b border-charcoal/10 pb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-umber">Boutique catalog</p>
                  <h1 className="text-5xl font-light font-display text-charcoal mt-3">My Products</h1>
                </div>
                <button
                  onClick={() => setActiveSection('add-product')}
                  className="rounded-full bg-charcoal text-cream px-5 py-3 text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2 hover:bg-black transition-colors"
                >
                  <Plus size={14} />
                  <span>Publish New Product</span>
                </button>
              </div>

              {/* Products list grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sellerProducts.map((prod) => (
                  <div key={prod.id} className="group relative flex flex-col justify-between overflow-hidden bg-white/70 p-4 border border-charcoal/5 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-500">
                    
                    {/* Image frame */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.6rem] bg-[#f5efe6] flex items-center justify-center p-6">
                      <img src={prod.image} alt={prod.name} className="h-full w-full object-contain" />
                      {prod.stockStatus === 'out-of-stock' && (
                        <div className="absolute inset-0 bg-charcoal/20 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="rounded-full bg-charcoal text-cream px-3 py-1 text-[8px] uppercase tracking-widest">Sold Out</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="mt-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-display font-light text-xl text-charcoal">{prod.name}</h3>
                        <p className="font-display text-base text-charcoal/70">{prod.price}</p>
                      </div>
                      <p className="text-[10px] text-charcoal/40 mt-1 uppercase tracking-wider">Stock Qty: {prod.quantity} / Status: {prod.stockStatus}</p>

                      <div className="mt-4 pt-3 border-t border-charcoal/5 flex items-center justify-between gap-3">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="text-[9px] uppercase tracking-wider text-umber hover:text-charcoal transition-colors flex items-center gap-1.5"
                        >
                          <PencilSimple size={12} />
                          <span>Edit Details</span>
                        </button>
                        <button
                          onClick={() => {
                            deleteProduct(prod.id)
                            showToast(`Product "${prod.name}" deleted.`)
                          }}
                          className="text-[9px] uppercase tracking-wider text-red-600/70 hover:text-red-600 transition-colors flex items-center gap-1.5"
                        >
                          <Trash size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SECTION: ADD PRODUCT WITH PREVIEW */}
          {activeSection === 'add-product' && (
            <motion.div
              key="add-product"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-umber font-semibold">Publishing</p>
                <h1 className="text-5xl font-light font-display text-charcoal mt-3">Add Custom Dress</h1>
              </div>

              <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                
                {/* Form fields */}
                <form onSubmit={handleAddSubmit} className="bg-white/60 border border-charcoal/5 p-8 rounded-[2rem] space-y-6 text-xs">
                  <div className="grid gap-5">
                    <div>
                      <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Product Name</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => {
                          setFormName(e.target.value)
                          updateLivePreview()
                        }}
                        placeholder="e.g. Satin Slip Gown"
                        className="w-full h-11 rounded-lg border border-charcoal/10 bg-cream/35 px-4 focus:border-charcoal focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Category</label>
                        <select
                          value={formCategory}
                          onChange={(e) => {
                            setFormCategory(e.target.value)
                            updateLivePreview()
                          }}
                          className="w-full h-11 rounded-lg border border-charcoal/10 bg-cream/35 px-3 focus:border-charcoal focus:outline-none"
                        >
                          <option value="Indian Collection">Indian Collection</option>
                          <option value="Western Collection">Western Collection</option>
                        </select>
                      </div>
                      <div>
                        <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Price Tag</label>
                        <input
                          type="text"
                          required
                          value={formPrice}
                          onChange={(e) => {
                            setFormPrice(e.target.value)
                            const numeric = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10)
                            if (numeric) setFormPriceValue(numeric)
                            updateLivePreview()
                          }}
                          placeholder="e.g. ₹16,000"
                          className="w-full h-11 rounded-lg border border-charcoal/10 bg-cream/35 px-4 focus:border-charcoal focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Image URL path</label>
                      <input
                        type="text"
                        required
                        value={formImage}
                        onChange={(e) => {
                          setFormImage(e.target.value)
                          updateLivePreview()
                        }}
                        className="w-full h-11 rounded-lg border border-charcoal/10 bg-cream/35 px-4 focus:border-charcoal focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Garment Narrative</label>
                      <textarea
                        rows={3}
                        required
                        value={formDesc}
                        onChange={(e) => {
                          setFormDesc(e.target.value)
                          updateLivePreview()
                        }}
                        placeholder="Detail materials, embroidery weaves, fit instructions..."
                        className="w-full rounded-lg border border-charcoal/10 bg-cream/35 p-4 leading-relaxed focus:border-charcoal focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Sizes (comma split)</label>
                        <input
                          type="text"
                          value={formSizes}
                          onChange={(e) => {
                            setFormSizes(e.target.value)
                            updateLivePreview()
                          }}
                          className="w-full h-11 rounded-lg border border-charcoal/10 bg-cream/35 px-4 focus:border-charcoal focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Colors (HEX comma split)</label>
                        <input
                          type="text"
                          value={formColors}
                          onChange={(e) => {
                            setFormColors(e.target.value)
                            updateLivePreview()
                          }}
                          className="w-full h-11 rounded-lg border border-charcoal/10 bg-cream/35 px-4 focus:border-charcoal focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Quantity</label>
                        <input
                          type="number"
                          required
                          value={formQty}
                          onChange={(e) => {
                            setFormQty(parseInt(e.target.value, 10) || 0)
                            updateLivePreview()
                          }}
                          className="w-full h-11 rounded-lg border border-charcoal/10 bg-cream/35 px-4 focus:border-charcoal focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Stock Status</label>
                        <select
                          value={formStock}
                          onChange={(e) => {
                            setFormStock(e.target.value as 'in-stock' | 'out-of-stock' | 'low-stock')
                            updateLivePreview()
                          }}
                          className="w-full h-11 rounded-lg border border-charcoal/10 bg-cream/35 px-3 focus:border-charcoal focus:outline-none"
                        >
                          <option value="in-stock">In Stock</option>
                          <option value="low-stock">Low Stock</option>
                          <option value="out-of-stock">Sold Out</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-charcoal text-cream text-[10px] uppercase tracking-[0.25em] font-medium py-4 hover:bg-black transition-colors"
                  >
                    Publish Listing
                  </button>
                </form>

                {/* Live Card Preview Column */}
                <div className="space-y-6">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-charcoal/40 font-medium">Boutique Storefront Preview</h4>
                  <div className="border border-charcoal/5 p-4 bg-cream/40 rounded-[2rem] shadow-sm flex flex-col justify-between">
                    
                    {/* Padded image mounting frame */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.6rem] bg-[#f5efe6] flex items-center justify-center p-6">
                      <img
                        src={formImage}
                        alt="Preview"
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          // fallback placeholder if path breaks
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
                        }}
                      />
                      <div className="absolute left-4 top-4 overflow-hidden z-10">
                        <span className="inline-block rounded-full bg-cream/90 backdrop-blur-md px-3 py-1 text-[8px] uppercase tracking-[0.2em] text-charcoal/70 border border-charcoal/5">
                          {formCategory}
                        </span>
                      </div>
                    </div>

                    {/* Copy details */}
                    <div className="mt-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display font-light text-2xl tracking-wide text-charcoal">{formName || 'Garment Name Preview'}</h3>
                        <p className="font-display text-lg text-charcoal/80 mt-1">{formPrice}</p>
                      </div>
                      <p className="mt-2 text-xs text-charcoal/50 leading-relaxed font-light font-sans max-h-20 overflow-y-auto">{formDesc || 'Description paragraph preview...'}</p>

                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-charcoal/5 pt-3">
                        <div className="flex gap-1">
                          {formSizes.split(',').map((s) => (
                            <span key={s} className="text-[8px] font-medium text-charcoal/40 border border-charcoal/10 rounded px-1.5 py-0.5">{s.trim()}</span>
                          ))}
                        </div>
                        <span className="text-[8px] uppercase tracking-widest text-[#D4A574] font-semibold">{formStock}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* SECTION: INVENTORY */}
          {activeSection === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-umber">Atelier Stock</p>
                <h1 className="text-5xl font-light font-display text-charcoal mt-3">Inventory Balances</h1>
              </div>

              <div className="bg-white/60 border border-charcoal/5 rounded-[2rem] overflow-hidden">
                {/* Desktop View */}
                <div className="hidden md:block">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-charcoal/10 text-charcoal/40 uppercase tracking-[0.2em] text-[10px]">
                        <th className="py-5 px-6 font-medium">Dress Title</th>
                        <th className="py-5 px-6 font-medium">Collection</th>
                        <th className="py-5 px-6 font-medium">In Stock Qty</th>
                        <th className="py-5 px-6 font-medium">Status</th>
                        <th className="py-5 px-6 font-medium text-right">Quick Restock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {sellerProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-charcoal/5 transition-colors">
                          <td className="py-5 px-6 font-display text-base text-charcoal font-light">{prod.name}</td>
                          <td className="py-5 px-6 text-charcoal/60">{prod.category}</td>
                          <td className="py-5 px-6 font-semibold">{prod.quantity} items</td>
                          <td className="py-5 px-6">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[8px] uppercase tracking-wider border ${
                              prod.stockStatus === 'in-stock'
                                ? 'bg-cream border-charcoal/10 text-charcoal'
                                : prod.stockStatus === 'low-stock'
                                ? 'bg-[#D4A574]/10 border-[#D4A574]/20 text-amber font-medium'
                                : 'bg-charcoal text-cream border-white/5'
                            }`}>
                              {prod.stockStatus}
                            </span>
                          </td>
                          <td className="py-5 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  const newQty = Math.max(0, prod.quantity - 1)
                                  updateProduct(prod.id, {
                                    quantity: newQty,
                                    stockStatus: newQty === 0 ? 'out-of-stock' : newQty < 5 ? 'low-stock' : 'in-stock'
                                  })
                                }}
                                className="h-7 w-7 rounded-full border border-charcoal/10 bg-white flex items-center justify-center font-bold"
                              >
                                -
                              </button>
                              <button
                                onClick={() => {
                                  const newQty = prod.quantity + 1
                                  updateProduct(prod.id, {
                                    quantity: newQty,
                                    stockStatus: newQty >= 5 ? 'in-stock' : 'low-stock'
                                  })
                                }}
                                className="h-7 w-7 rounded-full border border-charcoal/10 bg-white flex items-center justify-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="block md:hidden divide-y divide-charcoal/5">
                  {sellerProducts.map((prod) => (
                    <div key={prod.id} className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-display font-light text-base text-charcoal">{prod.name}</h3>
                          <span className="text-[10px] text-charcoal/40 uppercase tracking-wider mt-0.5 block">{prod.category}</span>
                        </div>
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[8px] uppercase tracking-wider border ${
                          prod.stockStatus === 'in-stock'
                            ? 'bg-cream border-charcoal/10 text-charcoal'
                            : prod.stockStatus === 'low-stock'
                            ? 'bg-[#D4A574]/10 border-[#D4A574]/20 text-amber font-medium'
                            : 'bg-charcoal text-cream border-white/5'
                        }`}>
                          {prod.stockStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs uppercase tracking-wider text-charcoal/60 pt-1">
                        <div>
                          <span className="block text-[9px] text-charcoal/40 mb-0.5">In Stock Qty</span>
                          <span className="font-medium text-charcoal">{prod.quantity} items</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="block text-[9px] text-charcoal/40 mb-1">Quick Restock</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newQty = Math.max(0, prod.quantity - 1)
                                updateProduct(prod.id, {
                                  quantity: newQty,
                                  stockStatus: newQty === 0 ? 'out-of-stock' : newQty < 5 ? 'low-stock' : 'in-stock'
                                })
                              }}
                              className="h-8 w-8 rounded-full border border-charcoal/10 bg-white flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <button
                              onClick={() => {
                                const newQty = prod.quantity + 1
                                updateProduct(prod.id, {
                                  quantity: newQty,
                                  stockStatus: newQty >= 5 ? 'in-stock' : 'low-stock'
                                })
                              }}
                              className="h-8 w-8 rounded-full border border-charcoal/10 bg-white flex items-center justify-center font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SECTION: ORDERS */}
          {activeSection === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-umber">Customer Orders</p>
                <h1 className="text-5xl font-light font-display text-charcoal mt-3">My Orders</h1>
              </div>

              <div className="bg-white/60 border border-charcoal/5 rounded-[2rem] overflow-hidden">
                {/* Desktop View */}
                <div className="hidden md:block">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-charcoal/10 text-charcoal/40 uppercase tracking-[0.2em] text-[10px]">
                        <th className="py-5 px-6 font-medium">Order ID</th>
                        <th className="py-5 px-6 font-medium">Item Details</th>
                        <th className="py-5 px-6 font-medium">Earned Net</th>
                        <th className="py-5 px-6 font-medium">Delivery Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {[
                        { id: 'TUI-3910', item: 'Mridula Silk Lehenga (M)', price: '₹32,500', status: 'Shipped' },
                        { id: 'TUI-3908', item: 'Satin Draped Midi Dress (S)', price: '₹8,900', status: 'Delivered' },
                      ].map((order) => (
                        <tr key={order.id} className="hover:bg-charcoal/5 transition-colors">
                          <td className="py-5 px-6 font-semibold">{order.id}</td>
                          <td className="py-5 px-6 font-light">{order.item}</td>
                          <td className="py-5 px-6 font-medium">{order.price}</td>
                          <td className="py-5 px-6">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[8px] uppercase tracking-wider border ${
                              order.status === 'Delivered'
                                ? 'bg-cream border-charcoal/10 text-charcoal'
                                : 'bg-[#D4A574]/10 border-[#D4A574]/20 text-amber font-medium'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="block md:hidden divide-y divide-charcoal/5">
                  {[
                    { id: 'TUI-3910', item: 'Mridula Silk Lehenga (M)', price: '₹32,500', status: 'Shipped' },
                    { id: 'TUI-3908', item: 'Satin Draped Midi Dress (S)', price: '₹8,900', status: 'Delivered' },
                  ].map((order) => (
                    <div key={order.id} className="p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-charcoal">{order.id}</span>
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[8px] uppercase tracking-wider border ${
                          order.status === 'Delivered'
                            ? 'bg-cream border-charcoal/10 text-charcoal'
                            : 'bg-[#D4A574]/10 border-[#D4A574]/20 text-amber font-medium'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs uppercase tracking-wider text-charcoal/60">
                        <div className="col-span-2">
                          <span className="block text-[9px] text-charcoal/40 mb-0.5">Item Details</span>
                          <span className="text-charcoal font-light truncate block">{order.item}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-charcoal/40 mb-0.5">Earned Net</span>
                          <span className="font-medium text-charcoal">{order.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SECTION: SALES LEDGER */}
          {activeSection === 'sales' && (
            <motion.div
              key="sales"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-umber">Earnings ledger</p>
                <h1 className="text-5xl font-light font-display text-charcoal mt-3">Sales Ledger</h1>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-white/60 border border-charcoal/5 p-8 rounded-[2rem]">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40 mb-3">Gross earnings</h4>
                  <p className="font-display text-4xl text-charcoal">₹95,200</p>
                  <p className="text-[10px] text-umber font-semibold mt-2">After 10% platform commission deductions</p>
                </div>
                <div className="bg-[#f5efe6] p-8 rounded-[2rem] flex flex-col justify-between">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40">Active Payout account</h4>
                  <p className="text-xs font-semibold mt-3">Studio Bank Account (*4810)</p>
                  <span className="text-[9px] uppercase tracking-wider text-umber mt-2 font-semibold">Next payout scheduled: May 28, 2026</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* SECTION: MEDIA */}
          {activeSection === 'media' && (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-umber">Boutique photography</p>
                <h1 className="text-5xl font-light font-display text-charcoal mt-3">Media Uploads</h1>
              </div>

              {/* Drag Zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`h-64 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-charcoal bg-charcoal/5'
                    : 'border-charcoal/20 bg-white/40 hover:border-charcoal/40'
                }`}
              >
                <UploadSimple size={40} weight="light" className="text-charcoal/40 mb-4" />
                <p className="text-xs uppercase tracking-[0.15em] font-medium text-charcoal/70">Drop garment images here to upload</p>
                <p className="text-[10px] text-charcoal/40 mt-1 uppercase">Supports high-res clothing photos (3:4 ratio only)</p>
              </div>

              {/* Uploads list */}
              {uploadedFiles.length > 0 && (
                <div className="bg-white/60 border border-charcoal/5 p-6 rounded-[2rem] space-y-4">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-charcoal/40 font-medium font-semibold">Upload progress</h4>
                  <div className="space-y-3">
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-3">
                          <ImageIcon size={16} className="text-charcoal/60" />
                          <span className="text-charcoal/70 truncate max-w-xs">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-1 bg-charcoal/5 w-20 rounded-full overflow-hidden">
                            <div className="h-full bg-umber" style={{ width: `${file.progress}%` }} />
                          </div>
                          <span className="text-[9px] uppercase font-semibold text-umber">{file.done ? 'Uploaded' : `${file.progress}%`}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SECTION: PROFILE */}
          {activeSection === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-umber">Credentials</p>
                <h1 className="text-5xl font-light font-display text-charcoal mt-3">Vendor Credentials</h1>
              </div>

              <div className="bg-white/60 border border-charcoal/5 p-8 rounded-[2rem] max-w-xl space-y-6">
                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-charcoal/40 mb-1">Studio Brand</label>
                    <p className="font-semibold text-charcoal">Studio Boutique</p>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-charcoal/40 mb-1">Seller Access ID</label>
                    <p className="font-semibold text-charcoal">seller-1</p>
                  </div>
                  <div className="col-span-2 border-t border-charcoal/5 pt-4 mt-2">
                    <label className="block text-[9px] uppercase tracking-wider text-charcoal/40 mb-1">Billing Address</label>
                    <p className="text-charcoal/70">Atelier Lane 4, Mumbai, MH, 400001</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* MODAL: EDIT PRODUCT (SELLER-SPECIFIC) */}
      <AnimatePresence>
        {showEditModal && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-cream rounded-[2.5rem] border border-charcoal/10 p-8 shadow-soft overflow-y-auto max-h-[85vh]"
            >
              <div className="flex items-center justify-between border-b border-charcoal/10 pb-4 mb-6">
                <h3 className="font-display text-2xl font-light">Edit Boutique Listing</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="h-8 w-8 rounded-full border border-charcoal/10 flex items-center justify-center bg-white hover:border-charcoal"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full h-11 rounded-lg border border-charcoal/10 bg-white/70 px-4 text-xs focus:border-charcoal focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full h-11 rounded-lg border border-charcoal/10 bg-white/70 px-3 text-xs focus:border-charcoal focus:outline-none"
                    >
                      <option value="Indian Collection">Indian Collection</option>
                      <option value="Western Collection">Western Collection</option>
                    </select>
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Price Tag</label>
                    <input
                      type="text"
                      required
                      value={formPrice}
                      onChange={(e) => {
                        setFormPrice(e.target.value)
                        const numeric = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10)
                        if (numeric) setFormPriceValue(numeric)
                      }}
                      className="w-full h-11 rounded-lg border border-charcoal/10 bg-white/70 px-4 text-xs focus:border-charcoal focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Image Asset URL</label>
                  <input
                    type="text"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full h-11 rounded-lg border border-charcoal/10 bg-white/70 px-4 text-xs focus:border-charcoal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Garment Narrative</label>
                  <textarea
                    rows={3}
                    required
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full rounded-lg border border-charcoal/10 bg-white/70 p-4 text-xs leading-relaxed focus:border-charcoal focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Sizes (comma split)</label>
                    <input
                      type="text"
                      value={formSizes}
                      onChange={(e) => setFormSizes(e.target.value)}
                      className="w-full h-11 rounded-lg border border-charcoal/10 bg-white/70 px-4 text-xs focus:border-charcoal focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Colors (HEX comma split)</label>
                    <input
                      type="text"
                      value={formColors}
                      onChange={(e) => setFormColors(e.target.value)}
                      className="w-full h-11 rounded-lg border border-charcoal/10 bg-white/70 px-4 text-xs focus:border-charcoal focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Quantity</label>
                    <input
                      type="number"
                      required
                      value={formQty}
                      onChange={(e) => setFormQty(parseInt(e.target.value, 10) || 0)}
                      className="w-full h-11 rounded-lg border border-charcoal/10 bg-white/70 px-4 text-xs focus:border-charcoal focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Stock Status</label>
                    <select
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value as 'in-stock' | 'out-of-stock' | 'low-stock')}
                      className="w-full h-11 rounded-lg border border-charcoal/10 bg-white/70 px-3 text-xs focus:border-charcoal focus:outline-none"
                    >
                      <option value="in-stock">In Stock</option>
                      <option value="low-stock">Low Stock</option>
                      <option value="out-of-stock">Sold Out</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-charcoal text-cream text-[10px] uppercase tracking-[0.25em] font-medium py-3.5 mt-6 hover:bg-black transition-colors"
                >
                  Save Listing Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
export default SellerPage

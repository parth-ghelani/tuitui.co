import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useProductStore } from '../store/useProductStore'
import type { Product } from '../store/useProductStore'
import { useAuthStore } from '../store/useAuthStore'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
  Cell
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip
} from '../components/ui/chart'
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
  Compass,
  Gear,
  Star,
  Info,
  Coins,
  Eye,
  ArrowsCounterClockwise
} from '@phosphor-icons/react'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 dark:bg-charcoal/95 backdrop-blur-md border border-charcoal/10 dark:border-white/10 p-4 rounded-2xl shadow-soft font-sans text-xs z-50">
        <p className="font-display text-base font-semibold text-charcoal dark:text-cream border-b border-charcoal/5 dark:border-white/5 pb-1.5 mb-2 uppercase tracking-wide">
          {payload[0].name || label || data.name}
        </p>
        <div className="space-y-1 text-charcoal/80 dark:text-cream/80">
          {payload.map((item: any, idx: number) => {
            const val = item.value;
            const isCurrency = item.dataKey === 'revenue' || item.name.includes('Revenue') || (typeof item.name === 'string' && item.name.toLowerCase().includes('sales') && val > 1000) || item.dataKey === 'Indian' || item.dataKey === 'Western' || item.dataKey === 'Navratri';
            const formattedVal = typeof val === 'number'
              ? isCurrency
                ? `₹${val.toLocaleString()}`
                : item.dataKey === 'performance'
                  ? `${val}%`
                  : val
              : val;
            return (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || item.payload.fill || '#8B7355' }} />
                <span className="font-light text-charcoal/60 dark:text-cream/60">{item.name || item.dataKey}:</span>
                <span className="font-semibold text-charcoal dark:text-cream">{formattedVal}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export function AdminPage() {
  const { products, heroSlides, addProduct, updateProduct, deleteProduct, updateHeroSlide } = useProductStore()
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  // Sidebar navigation state
  const [activeSection, setActiveSection] = useState<
    'dashboard' | 'products' | 'collections' | 'media' | 'orders' | 'customers' | 'hero' | 'settings'
  >('dashboard')

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
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

  // General Search state for catalog
  const [searchQuery, setSearchQuery] = useState('')

  // Sidebar collapsible open state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Chart view type selector state
  const [chartType, setChartType] = useState<'bar' | 'trend'>('bar')

  // Metric selector state for Bar Chart
  const [barMetric, setBarMetric] = useState<'sold' | 'revenue' | 'performance'>('sold')

  // Form states for product creation/edit
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState('Indian Collection')
  const [formPrice, setFormPrice] = useState('₹18,000')
  const [formPriceValue, setFormPriceValue] = useState(18000)
  const [formImage, setFormImage] = useState('/images/products/indian/1000000390.jpg')
  const [formDesc, setFormDesc] = useState('')
  const [formSizes, setFormSizes] = useState('S, M, L')
  const [formColors, setFormColors] = useState('#E8DED1, #8B7355')
  const [formQty, setFormQty] = useState(10)
  const [formStock, setFormStock] = useState<'in-stock' | 'out-of-stock' | 'low-stock'>('in-stock')

  // Edit hero slide states
  const [editingHeroIdx, setEditingHeroIdx] = useState(0)
  const [heroSubtitle, setHeroSubtitle] = useState(() => heroSlides[0]?.subtitle || '')
  const [heroTitle, setHeroTitle] = useState(() => heroSlides[0]?.title || '')
  const [heroHeading, setHeroHeading] = useState(() => heroSlides[0]?.heading || '')
  const [heroNarrative, setHeroNarrative] = useState(() => heroSlides[0]?.narrative || '')
  const [heroPlace, setHeroPlace] = useState(() => heroSlides[0]?.place || '')

  const selectHeroSlide = (idx: number) => {
    setEditingHeroIdx(idx)
    const slide = heroSlides[idx]
    if (slide) {
      setHeroSubtitle(slide.subtitle)
      setHeroTitle(slide.title)
      setHeroHeading(slide.heading)
      setHeroNarrative(slide.narrative)
      setHeroPlace(slide.place)
    }
  }

  // Drag and drop media uploader state
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; progress: number; done: boolean }>>([])

  // Sidebar links
  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Gauge },
    { id: 'products', label: 'Products', icon: ListBullets },
    { id: 'collections', label: 'Collections', icon: ShoppingBag },
    { id: 'media', label: 'Upload Media', icon: UploadSimple },
    { id: 'orders', label: 'Orders', icon: Receipt },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'hero', label: 'Homepage Hero', icon: Compass },
    { id: 'settings', label: 'Settings', icon: Gear },
  ] as const

  // Handle Add Product submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addProduct({
      name: formName,
      category: formCategory,
      price: formPrice,
      priceValue: formPriceValue,
      image: formImage,
      description: formDesc,
      sizes: formSizes.split(',').map((s) => s.trim()),
      colors: formColors.split(',').map((c) => c.trim()),
      quantity: formQty,
      stockStatus: formStock,
      sellerId: 'platform',
      isFeatured: false,
    })
    setShowAddModal(false)
    showToast(`Product "${formName}" published successfully.`)
    // Reset form
    setFormName('')
    setFormDesc('')
    setFormPrice('₹18,000')
    setFormPriceValue(18000)
  }

  // Open edit product modal
  const openEditModal = (prod: Product) => {
    setSelectedProduct(prod)
    setFormName(prod.name)
    setFormCategory(prod.category)
    setFormPrice(prod.price)
    setFormPriceValue(prod.priceValue)
    setFormImage(prod.image)
    setFormDesc(prod.description)
    setFormSizes(prod.sizes.join(', '))
    setFormColors(prod.colors.join(', '))
    setFormQty(prod.quantity)
    setFormStock(prod.stockStatus)
    setShowEditModal(true)
  }

  // Handle Edit Product submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    updateProduct(selectedProduct.id, {
      name: formName,
      category: formCategory,
      price: formPrice,
      priceValue: formPriceValue,
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

  // Handle Save Hero changes
  const saveHeroSlideChanges = () => {
    updateHeroSlide(editingHeroIdx, {
      subtitle: heroSubtitle,
      title: heroTitle,
      heading: heroHeading,
      narrative: heroNarrative,
      place: heroPlace,
    })
    showToast(`Hero Slide ${editingHeroIdx + 1} updated live.`)
  }

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      files.forEach((file) => {
        const fileObj = { name: file.name, progress: 0, done: false }
        setUploadedFiles((prev) => [fileObj, ...prev])

        // Simulate upload progress
        let progress = 0
        const interval = setInterval(() => {
          progress += 20
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.name === file.name
                ? { ...f, progress, done: progress >= 100 }
                : f
            )
          )
          if (progress >= 100) clearInterval(interval)
        }, 300)
      })
    }
  }

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          Atelier CMS
        </h2>
        <div className="h-8 w-8 rounded-full bg-[#f5efe6] border border-charcoal/10 flex items-center justify-center font-display text-xs text-umber font-semibold">
          AD
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
              <p className="text-[10px] tracking-[0.4em] uppercase text-umber font-semibold">Atelier CMS</p>
              <h2 className="text-3xl font-light font-display text-charcoal tracking-tight mt-2">
                The Tuitui Co.
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
                    setActiveSection(link.id)
                    setIsSidebarOpen(false)
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
                      layoutId="activeDot"
                      className="w-1.5 h-1.5 rounded-full bg-[#D4A574]"
                    />
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer/Profile */}
        <div className="border-t border-charcoal/5 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#f5efe6] border border-charcoal/10 flex items-center justify-center font-display text-lg text-umber font-semibold">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide">Boutique Admin</p>
              <p className="text-[10px] text-charcoal/50">Full Platform Access</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <a
              href="/"
              className="text-[10px] uppercase tracking-wider text-charcoal/40 hover:text-charcoal transition-colors underline underline-offset-4"
            >
              Storefront
            </a>
            <button
              onClick={() => {
                logout()
                navigate('/seller/login')
              }}
              className="text-[10px] uppercase tracking-wider text-charcoal/40 hover:text-charcoal transition-colors underline underline-offset-4"
            >
              Logout
            </button>
          </div>
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
                <p className="text-xs uppercase tracking-[0.3em] text-umber dark:text-gold font-sans font-semibold">Overview</p>
                <h1 className="text-5xl font-light font-display text-charcoal dark:text-cream mt-3">Sales Analytics</h1>
              </div>

              {/* Summary Stats Cards */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Indian Collection Sales', value: '₹2.4L', change: '+12% this month', isPositive: true },
                  { label: 'Western Collection Sales', value: '₹1.8L', change: '+8% this month', isPositive: true },
                  { label: 'Total Platform Revenue', value: '₹4,89,500', change: '+18.2% this month', isPositive: true },
                  { label: 'Average Cart Value', value: '₹18,500', change: '+4.1% this month', isPositive: true },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/60 dark:bg-white/5 border border-charcoal/5 dark:border-white/5 p-6 rounded-[1.5rem] shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50 dark:text-cream/50 font-sans">{stat.label}</p>
                    <p className="font-display text-3xl text-charcoal dark:text-cream mt-3">{stat.value}</p>
                    <p className="text-[10px] text-umber dark:text-gold font-semibold mt-2">{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Chart & Insights Row */}
              <div className="grid gap-8 lg:grid-cols-12">
                {/* Asymmetric Interactive Chart Panel */}
                <div className="lg:col-span-8 bg-white/60 dark:bg-white/5 border border-charcoal/5 dark:border-white/5 p-6 sm:p-8 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[520px]">
                  
                  {/* Chart Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal/5 pb-4 mb-6">
                    <div>
                      <h3 className="font-display text-2xl font-light text-charcoal dark:text-cream">Collection Performance</h3>
                      <p className="text-xs text-charcoal/50 dark:text-cream/40 font-light mt-1 font-sans">Boutique intelligence sales indicators</p>
                    </div>

                    {/* Switchers Row */}
                    <div className="flex flex-wrap items-center gap-2 select-none">
                      {/* Sub-Switcher for Bar Metrics */}
                      {chartType === 'bar' && (
                        <div className="flex items-center gap-1 bg-beige/30 dark:bg-white/5 p-1 rounded-full border border-charcoal/5 shrink-0">
                          <button
                            onClick={() => setBarMetric('sold')}
                            className={`px-3 py-1 rounded-full text-[8px] uppercase tracking-wider font-sans font-semibold transition-all duration-300 ${
                              barMetric === 'sold' ? 'bg-charcoal text-cream shadow-sm' : 'text-charcoal/50 hover:text-charcoal dark:text-cream/40 dark:hover:text-cream'
                            }`}
                          >
                            Units
                          </button>
                          <button
                            onClick={() => setBarMetric('revenue')}
                            className={`px-3 py-1 rounded-full text-[8px] uppercase tracking-wider font-sans font-semibold transition-all duration-300 ${
                              barMetric === 'revenue' ? 'bg-charcoal text-cream shadow-sm' : 'text-charcoal/50 hover:text-charcoal dark:text-cream/40 dark:hover:text-cream'
                            }`}
                          >
                            Revenue
                          </button>
                          <button
                            onClick={() => setBarMetric('performance')}
                            className={`px-3 py-1 rounded-full text-[8px] uppercase tracking-wider font-sans font-semibold transition-all duration-300 ${
                              barMetric === 'performance' ? 'bg-charcoal text-cream shadow-sm' : 'text-charcoal/50 hover:text-charcoal dark:text-cream/40 dark:hover:text-cream'
                            }`}
                          >
                            Growth
                          </button>
                        </div>
                      )}

                      {/* Main Chart Switcher */}
                      <div className="flex items-center gap-1 bg-beige/30 dark:bg-white/5 p-1 rounded-full border border-charcoal/5 shrink-0">
                        <button
                          onClick={() => setChartType('bar')}
                          className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-wider font-sans font-semibold transition-all duration-300 ${
                            chartType === 'bar' ? 'bg-charcoal text-cream shadow-sm' : 'text-charcoal/50 hover:text-charcoal dark:text-cream/40 dark:hover:text-cream'
                          }`}
                        >
                          Bar Analytics
                        </button>
                        <button
                          onClick={() => setChartType('trend')}
                          className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-wider font-sans font-semibold transition-all duration-300 ${
                            chartType === 'trend' ? 'bg-charcoal text-cream shadow-sm' : 'text-charcoal/50 hover:text-charcoal dark:text-cream/40 dark:hover:text-cream'
                          }`}
                        >
                          Trend Analytics
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Chart Area with explicit height layout */}
                  <div className="relative w-full h-[350px] mt-2">
                    <AnimatePresence mode="wait">
                      {chartType === 'bar' ? (
                        <motion.div
                          key="bar-chart"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                          className="absolute inset-0 w-full h-full"
                        >
                          <ChartContainer
                            config={{}}
                            className="w-full h-full aspect-auto"
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={[
                                  { name: 'Indian Collection', sold: 320, revenue: 580000, performance: 94, fill: '#800020' },
                                  { name: 'Western Collection', sold: 280, revenue: 450000, performance: 88, fill: '#C8B195' },
                                  { name: 'Navratri Collection', sold: 190, revenue: 380000, performance: 96, fill: '#D4A574' },
                                  { name: 'Dresses', sold: 150, revenue: 270000, performance: 85, fill: '#8C7853' },
                                  { name: 'Tops', sold: 210, revenue: 180000, performance: 82, fill: '#E8DED1' },
                                  { name: 'Co-ord Sets', sold: 115, revenue: 230000, performance: 90, fill: '#222222' }
                                ]}
                                margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(17, 17, 17, 0.05)" />
                                <XAxis
                                  dataKey="name"
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fill: 'rgba(17, 17, 17, 0.4)', fontSize: 9, fontFamily: 'Plus Jakarta Sans' }}
                                />
                                <YAxis
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fill: 'rgba(17, 17, 17, 0.4)', fontSize: 9, fontFamily: 'Plus Jakarta Sans' }}
                                  tickFormatter={(v) => barMetric === 'revenue' ? `₹${v/1000}k` : barMetric === 'performance' ? `${v}%` : v}
                                />
                                <ChartTooltip content={<CustomTooltip />} />
                                <Bar dataKey={barMetric} radius={[6, 6, 0, 0]} name={barMetric === 'sold' ? 'Units Sold' : barMetric === 'revenue' ? 'Revenue' : 'Performance'}>
                                  {[
                                    { fill: '#800020' }, { fill: '#C8B195' }, { fill: '#D4A574' },
                                    { fill: '#8C7853' }, { fill: '#E8DED1' }, { fill: '#222222' }
                                  ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="trend-chart"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                          className="absolute inset-0 w-full h-full"
                        >
                          <ChartContainer
                            config={{}}
                            className="w-full h-full aspect-auto"
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={[
                                  { name: 'Jan', Indian: 120000, Western: 95000, Navratri: 30000 },
                                  { name: 'Feb', Indian: 150000, Western: 110000, Navratri: 35000 },
                                  { name: 'Mar', Indian: 180000, Western: 125000, Navratri: 40000 },
                                  { name: 'Apr', Indian: 165000, Western: 140000, Navratri: 65000 },
                                  { name: 'May', Indian: 210000, Western: 160000, Navratri: 110000 },
                                  { name: 'Jun', Indian: 240000, Western: 180000, Navratri: 160000 }
                                ]}
                                margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
                              >
                                <defs>
                                  <linearGradient id="colorIndian" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#800020" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#800020" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorWestern" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#C8B195" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#C8B195" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorNavratri" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D4A574" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#D4A574" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(17, 17, 17, 0.05)" />
                                <XAxis
                                  dataKey="name"
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fill: 'rgba(17, 17, 17, 0.4)', fontSize: 9, fontFamily: 'Plus Jakarta Sans' }}
                                />
                                <YAxis
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fill: 'rgba(17, 17, 17, 0.4)', fontSize: 9, fontFamily: 'Plus Jakarta Sans' }}
                                  tickFormatter={(v) => `₹${v / 1000}k`}
                                />
                                <ChartTooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="Indian" stroke="#800020" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIndian)" name="Indian Collection" />
                                <Area type="monotone" dataKey="Western" stroke="#C8B195" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWestern)" name="Western Collection" />
                                <Area type="monotone" dataKey="Navratri" stroke="#D4A574" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNavratri)" name="Navratri Collection" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

                {/* Detailed Business Insights Panel */}
                <div className="lg:col-span-4 flex flex-col justify-between gap-8">
                  <div className="bg-white/60 dark:bg-white/5 border border-charcoal/5 dark:border-white/5 p-8 rounded-[2rem] shadow-sm flex-1">
                    <h3 className="font-display text-2xl font-light text-charcoal dark:text-cream mb-6">Detailed Metrics</h3>
                    <div className="space-y-5">
                      {[
                        { label: 'Best Selling Collection', value: 'Indian Collection', desc: 'Chaniya Choli leads sales', icon: Star },
                        { label: 'Total Products Sold', value: '422 pieces', desc: 'Across all categories', icon: ShoppingBag },
                        { label: 'Stock Availability', value: '92% in stock', desc: 'Only 3 items flagged low stock', icon: ListBullets },
                        { label: 'Average Cart Value', value: '₹18,500', desc: 'Driven by high-end sarees', icon: Coins },
                        { label: 'Most Viewed Collection', value: 'Navratri Couture', desc: 'High traffic preview banner', icon: Eye },
                        { label: 'Returning Customers', value: '34.8%', desc: 'Strong brand retention rate', icon: ArrowsCounterClockwise },
                      ].map((item, i) => {
                        const Icon = item.icon
                        return (
                          <div key={i} className="flex items-start gap-3 border-b border-charcoal/5 dark:border-white/5 pb-4 last:border-b-0 last:pb-0">
                            <div className="p-2 rounded-xl bg-[#f5efe6] dark:bg-white/5 text-umber dark:text-gold shrink-0">
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase tracking-wide text-charcoal/40 dark:text-cream/40 font-sans leading-tight">{item.label}</p>
                              <p className="text-sm font-semibold text-charcoal dark:text-cream mt-1 leading-none">{item.value}</p>
                              <p className="text-[9px] text-charcoal/50 dark:text-cream/50 mt-1 truncate font-light leading-none">{item.desc}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Status Notification Box */}
                  <div className="bg-[#f5efe6] dark:bg-white/5 p-8 rounded-[2rem] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-umber dark:text-gold">
                        <Info size={16} />
                        <h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold font-sans">CMS Status</h4>
                      </div>
                      <p className="text-xs text-charcoal/60 dark:text-cream/60 leading-relaxed font-light mt-4 font-sans">
                        The Tuitui Co fashion catalog is fully dynamic. Adding, editing, or deleting products here will reflect instantly on the public shop page.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveSection('products')}
                      className="mt-6 w-full rounded-full bg-charcoal dark:bg-white/10 dark:hover:bg-white/20 text-cream text-[10px] uppercase tracking-[0.2em] font-medium py-3 hover:bg-black transition-colors font-sans"
                    >
                      Manage Inventory
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SECTION: PRODUCTS */}
          {activeSection === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              {/* Header */}
              <div className="flex items-end justify-between border-b border-charcoal/10 pb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-umber">Boutique Inventory</p>
                  <h1 className="text-5xl font-light font-display text-charcoal mt-3">Catalog Management</h1>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="rounded-full bg-charcoal text-cream px-5 py-3 text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2 hover:bg-black transition-colors"
                >
                  <Plus size={14} />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Search Control */}
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search catalog by name or collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-12 rounded-full border border-charcoal/10 bg-white/70 px-6 text-xs uppercase tracking-[0.1em] focus:border-charcoal focus:outline-none"
                />
              </div>

              {/* Catalog Table */}
              <div>
                {/* Desktop View */}
                <div className="hidden md:block bg-white/60 border border-charcoal/5 rounded-[2rem] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-charcoal/10 text-charcoal/40 uppercase tracking-[0.2em] text-[10px]">
                          <th className="py-5 px-6 font-medium">Image</th>
                          <th className="py-5 px-6 font-medium">Product Name</th>
                          <th className="py-5 px-6 font-medium">Collection</th>
                          <th className="py-5 px-6 font-medium">Price</th>
                          <th className="py-5 px-6 font-medium">Qty</th>
                          <th className="py-5 px-6 font-medium">Status</th>
                          <th className="py-5 px-6 font-medium">Featured</th>
                          <th className="py-5 px-6 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-charcoal/5">
                        {filteredProducts.map((prod) => (
                          <tr key={prod.id} className="hover:bg-charcoal/5 transition-colors">
                            <td className="py-4 px-6">
                              <div className="h-14 w-11 overflow-hidden rounded bg-[#f5efe6] border border-charcoal/10 p-1 flex items-center justify-center">
                                <img src={prod.image} alt={prod.name} className="h-full w-full object-contain" />
                              </div>
                            </td>
                            <td className="py-4 px-6 font-display text-base font-light text-charcoal">
                              {prod.name}
                              <span className="block text-[9px] uppercase tracking-wider text-charcoal/40 mt-1">ID: {prod.id} / Owner: {prod.sellerId}</span>
                            </td>
                            <td className="py-4 px-6 text-charcoal/70">{prod.category}</td>
                            <td className="py-4 px-6 font-medium">{prod.price}</td>
                            <td className="py-4 px-6 text-charcoal/60">{prod.quantity}</td>
                            <td className="py-4 px-6">
                              {prod.stockStatus === 'in-stock' && (
                                <span className="inline-block rounded-full bg-cream text-[9px] uppercase tracking-wider border border-charcoal/10 px-2 py-0.5">In Stock</span>
                              )}
                              {prod.stockStatus === 'low-stock' && (
                                <span className="inline-block rounded-full bg-[#D4A574]/10 text-amber text-[9px] uppercase tracking-wider border border-[#D4A574]/20 px-2 py-0.5">Low Stock</span>
                              )}
                              {prod.stockStatus === 'out-of-stock' && (
                                <span className="inline-block rounded-full bg-charcoal text-cream text-[9px] uppercase tracking-wider border border-white/5 px-2 py-0.5">Sold Out</span>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <button
                                onClick={() => updateProduct(prod.id, { isFeatured: !prod.isFeatured })}
                                className="text-charcoal/40 hover:text-amber transition-colors"
                              >
                                <Star size={18} weight={prod.isFeatured ? 'fill' : 'light'} className={prod.isFeatured ? 'text-amber' : ''} />
                              </button>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  onClick={() => openEditModal(prod)}
                                  className="h-8 w-8 rounded-full border border-charcoal/10 bg-white hover:border-charcoal flex items-center justify-center transition-all"
                                  aria-label="Edit product"
                                >
                                  <PencilSimple size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    deleteProduct(prod.id)
                                    showToast(`Listing "${prod.name}" deleted.`)
                                  }}
                                  className="h-8 w-8 rounded-full border border-charcoal/10 bg-white hover:border-red-600 hover:text-red-600 flex items-center justify-center transition-all"
                                  aria-label="Delete product"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Luxury Card Stack */}
                <div className="grid gap-4 md:hidden">
                  {filteredProducts.map((prod) => (
                    <div key={prod.id} className="bg-white/60 border border-charcoal/5 rounded-[1.5rem] p-5 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-12 overflow-hidden rounded bg-[#f5efe6] border border-charcoal/10 p-1 flex items-center justify-center flex-shrink-0">
                          <img src={prod.image} alt={prod.name} className="h-full w-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-base font-light text-charcoal truncate">{prod.name}</h3>
                          <p className="text-[9px] uppercase tracking-wider text-charcoal/40 mt-1">
                            ID: {prod.id} / Owner: {prod.sellerId}
                          </p>
                          <p className="text-xs text-charcoal/70 mt-1">{prod.category}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-b border-charcoal/5 py-3 text-xs uppercase tracking-wider text-charcoal/60">
                        <div>
                          <span className="block text-[9px] text-charcoal/40 mb-1">Price</span>
                          <span className="font-medium text-charcoal">{prod.price}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-charcoal/40 mb-1">Quantity</span>
                          <span className="text-charcoal">{prod.quantity}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-charcoal/40 mb-1">Status</span>
                          {prod.stockStatus === 'in-stock' && (
                            <span className="inline-block rounded-full bg-cream text-[9px] uppercase tracking-wider border border-charcoal/10 px-2 py-0.5">In Stock</span>
                          )}
                          {prod.stockStatus === 'low-stock' && (
                            <span className="inline-block rounded-full bg-[#D4A574]/10 text-amber text-[9px] uppercase tracking-wider border border-[#D4A574]/20 px-2 py-0.5">Low Stock</span>
                          )}
                          {prod.stockStatus === 'out-of-stock' && (
                            <span className="inline-block rounded-full bg-charcoal text-cream text-[9px] uppercase tracking-wider border border-white/5 px-2 py-0.5">Sold Out</span>
                          )}
                        </div>
                        <div>
                          <span className="block text-[9px] text-charcoal/40 mb-1">Featured</span>
                          <button
                            onClick={() => updateProduct(prod.id, { isFeatured: !prod.isFeatured })}
                            className="text-charcoal/40 hover:text-amber transition-colors flex items-center gap-1.5"
                          >
                            <Star size={16} weight={prod.isFeatured ? 'fill' : 'light'} className={prod.isFeatured ? 'text-amber' : ''} />
                            <span className="text-[10px]">{prod.isFeatured ? 'Featured' : 'Standard'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="rounded-full border border-charcoal/10 bg-white hover:border-charcoal px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2 transition-all"
                        >
                          <PencilSimple size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            deleteProduct(prod.id)
                            showToast(`Listing "${prod.name}" deleted.`)
                          }}
                          className="rounded-full border border-charcoal/10 bg-white hover:border-red-600 hover:text-red-600 px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2 transition-all"
                        >
                          <Trash size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SECTION: COLLECTIONS */}
          {activeSection === 'collections' && (
            <motion.div
              key="collections"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-umber">Boutique Categories</p>
                <h1 className="text-5xl font-light font-display text-charcoal mt-3">Collection Types</h1>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {[
                  { title: 'Indian Collection', desc: 'Garments inspired by traditional Mewar craftsmanship, Banarasi loom configurations, and heavy zardozi detailing.', count: products.filter(p => p.category.includes('Indian')).length },
                  { title: 'Western Collection', desc: 'Blazers, draped satin skirts, tailored wool crepe trousers, coordinate sets, and minimal utility wear.', count: products.filter(p => p.category.includes('Western')).length },
                ].map((col, i) => (
                  <div key={i} className="bg-white/60 border border-charcoal/5 p-8 rounded-[2rem] shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-3xl font-light mb-4">{col.title}</h3>
                      <p className="text-xs text-charcoal/60 leading-relaxed font-light">{col.desc}</p>
                    </div>
                    <div className="mt-8 flex justify-between items-center text-xs border-t border-charcoal/5 pt-4">
                      <span className="text-charcoal/40 uppercase tracking-widest">{col.count} Listings active</span>
                      <button
                        onClick={() => setActiveSection('products')}
                        className="text-umber uppercase tracking-wider underline underline-offset-4 font-semibold hover:text-charcoal transition-colors"
                      >
                        Edit collection
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SECTION: UPLOAD MEDIA */}
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
                <p className="text-xs uppercase tracking-[0.3em] text-umber">Media Assets</p>
                <h1 className="text-5xl font-light font-display text-charcoal mt-3">Drag & Drop Uploader</h1>
              </div>

              {/* Drag Zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`h-72 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-charcoal bg-charcoal/5 scale-[1.01]'
                    : 'border-charcoal/20 bg-white/40 hover:border-charcoal/40'
                }`}
              >
                <UploadSimple size={48} weight="light" className="text-charcoal/40 mb-4" />
                <p className="text-xs uppercase tracking-[0.15em] font-medium text-charcoal/70">Drag and drop files here to upload</p>
                <p className="text-[10px] text-charcoal/40 mt-1 uppercase">Supports high-res JPG, PNG, WEBP (ratio 3:4 recommended)</p>
              </div>

              {/* Uploading File Progress list */}
              {uploadedFiles.length > 0 && (
                <div className="bg-white/60 border border-charcoal/5 p-6 rounded-[2rem] space-y-4">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-charcoal/40 font-medium">Recent uploads</h4>
                  <div className="space-y-3">
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-3">
                          <ImageIcon size={16} className="text-charcoal/60" />
                          <span className="text-charcoal/70 truncate max-w-xs">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-24 bg-charcoal/5 rounded-full overflow-hidden">
                            <div className="h-full bg-umber" style={{ width: `${file.progress}%` }} />
                          </div>
                          <span className="text-[9px] uppercase font-semibold text-umber">{file.done ? 'Finished' : `${file.progress}%`}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                <p className="text-xs uppercase tracking-[0.3em] text-umber">Atelier Orders</p>
                <h1 className="text-5xl font-light font-display text-charcoal mt-3">Platform Orders</h1>
              </div>

              <div className="bg-white/60 border border-charcoal/5 rounded-[2rem] overflow-hidden">
                {/* Desktop View */}
                <div className="hidden md:block">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-charcoal/10 text-charcoal/40 uppercase tracking-[0.2em] text-[10px]">
                        <th className="py-5 px-6 font-medium">Order ID</th>
                        <th className="py-5 px-6 font-medium">Customer</th>
                        <th className="py-5 px-6 font-medium">Date</th>
                        <th className="py-5 px-6 font-medium">Total</th>
                        <th className="py-5 px-6 font-medium">Fulfillment</th>
                        <th className="py-5 px-6 font-medium text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {[
                        { id: 'TUI-3910', name: 'Kabir Dev', date: 'May 22, 2026', total: '₹3,900', status: 'Shipped' },
                        { id: 'TUI-3909', name: 'Meera Sen', date: 'May 21, 2026', total: '₹42,000', status: 'Processing' },
                        { id: 'TUI-3908', name: 'Ananya Roy', date: 'May 20, 2026', total: '₹18,900', status: 'Delivered' },
                        { id: 'TUI-3907', name: 'Rohan Shah', date: 'May 18, 2026', total: '₹9,800', status: 'Delivered' },
                      ].map((order) => (
                        <tr key={order.id} className="hover:bg-charcoal/5 transition-colors">
                          <td className="py-5 px-6 font-semibold">{order.id}</td>
                          <td className="py-5 px-6 text-charcoal/70">{order.name}</td>
                          <td className="py-5 px-6 text-charcoal/50">{order.date}</td>
                          <td className="py-5 px-6 font-medium">{order.total}</td>
                          <td className="py-5 px-6">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[8px] uppercase tracking-wider border ${
                              order.status === 'Delivered'
                                ? 'bg-cream border-charcoal/10 text-charcoal'
                                : order.status === 'Shipped'
                                ? 'bg-[#D4A574]/10 border-[#D4A574]/20 text-amber font-medium'
                                : 'bg-charcoal text-cream border-white/5'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-5 px-6 text-right text-[10px] uppercase font-semibold text-umber hover:text-charcoal cursor-pointer">View Details</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="block md:hidden divide-y divide-charcoal/5">
                  {[
                    { id: 'TUI-3910', name: 'Kabir Dev', date: 'May 22, 2026', total: '₹3,900', status: 'Shipped' },
                    { id: 'TUI-3909', name: 'Meera Sen', date: 'May 21, 2026', total: '₹42,000', status: 'Processing' },
                    { id: 'TUI-3908', name: 'Ananya Roy', date: 'May 20, 2026', total: '₹18,900', status: 'Delivered' },
                    { id: 'TUI-3907', name: 'Rohan Shah', date: 'May 18, 2026', total: '₹9,800', status: 'Delivered' },
                  ].map((order) => (
                    <div key={order.id} className="p-5 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-charcoal">{order.id}</span>
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[8px] uppercase tracking-wider border ${
                          order.status === 'Delivered'
                            ? 'bg-cream border-charcoal/10 text-charcoal'
                            : order.status === 'Shipped'
                            ? 'bg-[#D4A574]/10 border-[#D4A574]/20 text-amber font-medium'
                            : 'bg-charcoal text-cream border-white/5'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs uppercase tracking-wider text-charcoal/60">
                        <div>
                          <span className="block text-[9px] text-charcoal/40 mb-0.5">Customer</span>
                          <span className="text-charcoal">{order.name}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-charcoal/40 mb-0.5">Date</span>
                          <span className="text-charcoal">{order.date}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-charcoal/40 mb-0.5">Total</span>
                          <span className="font-medium text-charcoal">{order.total}</span>
                        </div>
                        <div className="flex items-end justify-end">
                          <button className="text-[10px] uppercase font-semibold text-umber hover:text-charcoal">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SECTION: HOMEPAGE HERO CONTROL */}
          {activeSection === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-umber">Homepage Branding</p>
                <h1 className="text-5xl font-light font-display text-charcoal mt-3">Hero Slide Manager</h1>
              </div>

              {/* Selector Tabs */}
              <div className="flex gap-4 border-b border-charcoal/10 pb-4">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => selectHeroSlide(idx)}
                    className={`text-xs uppercase tracking-[0.15em] font-medium py-2 px-4 rounded-lg transition-colors ${
                      editingHeroIdx === idx ? 'bg-charcoal text-cream' : 'text-charcoal/55 hover:text-charcoal hover:bg-charcoal/5'
                    }`}
                  >
                    Slide {idx + 1}: {slide.title}
                  </button>
                ))}
              </div>

              {/* Form & Live Preview */}
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                
                {/* Form fields */}
                <div className="bg-white/60 border border-charcoal/5 p-8 rounded-[2rem] space-y-6">
                  <h3 className="font-display text-2xl font-light text-charcoal mb-4">Edit Slide Details</h3>
                  
                  <div className="grid gap-5">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-charcoal/40 mb-1.5 font-medium">Subtitle</label>
                      <input
                        type="text"
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        className="w-full h-11 rounded-lg border border-charcoal/10 bg-cream/35 px-4 text-xs font-light tracking-wide focus:border-charcoal focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-charcoal/40 mb-1.5 font-medium">Title</label>
                      <input
                        type="text"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="w-full h-11 rounded-lg border border-charcoal/10 bg-cream/35 px-4 text-xs font-light tracking-wide focus:border-charcoal focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-charcoal/40 mb-1.5 font-medium">Heading</label>
                      <input
                        type="text"
                        value={heroHeading}
                        onChange={(e) => setHeroHeading(e.target.value)}
                        className="w-full h-11 rounded-lg border border-charcoal/10 bg-cream/35 px-4 text-xs font-light tracking-wide focus:border-charcoal focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-charcoal/40 mb-1.5 font-medium">Narrative Caption</label>
                      <textarea
                        rows={4}
                        value={heroNarrative}
                        onChange={(e) => setHeroNarrative(e.target.value)}
                        className="w-full rounded-lg border border-charcoal/10 bg-cream/35 p-4 text-xs font-light tracking-wide leading-relaxed focus:border-charcoal focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-charcoal/40 mb-1.5 font-medium">Location</label>
                      <input
                        type="text"
                        value={heroPlace}
                        onChange={(e) => setHeroPlace(e.target.value)}
                        className="w-full h-11 rounded-lg border border-charcoal/10 bg-cream/35 px-4 text-xs font-light tracking-wide focus:border-charcoal focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={saveHeroSlideChanges}
                    className="w-full rounded-full bg-charcoal text-cream text-[10px] uppercase tracking-[0.25em] font-medium py-3.5 hover:bg-black transition-colors"
                  >
                    Apply Hero Slide Changes
                  </button>
                </div>

                {/* Real-time Preview Mockup Card */}
                <div className="space-y-6">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-charcoal/40 font-medium">Storefront Live Preview</h4>
                  <div className="relative aspect-[3/4] w-full rounded-[2rem] overflow-hidden bg-charcoal/90 text-cream p-8 flex flex-col justify-between shadow-soft">
                    
                    {/* Background mock */}
                    <div className="absolute inset-0 bg-cover bg-center opacity-30 select-none pointer-events-none" style={{ backgroundImage: `url(${heroSlides[editingHeroIdx]?.imageBg})` }} />

                    {/* Meta */}
                    <div className="flex justify-between items-center text-[8px] uppercase tracking-widest text-white/50 relative z-10">
                      <span>{heroSlides[editingHeroIdx]?.index}</span>
                      <span>{heroSubtitle}</span>
                    </div>

                    {/* Copy */}
                    <div className="space-y-3 relative z-10">
                      <h2 className="font-display font-light text-4xl leading-tight">{heroTitle}</h2>
                      <p className="text-[10px] text-white/60 tracking-wider font-semibold uppercase">{heroHeading}</p>
                      <p className="text-[9px] leading-relaxed text-white/40 font-light font-sans max-w-xs">{heroNarrative}</p>
                    </div>

                    {/* Bottom Place */}
                    <div className="flex justify-between items-end text-[7px] uppercase tracking-widest text-white/30 relative z-10">
                      <span>{heroPlace}</span>
                      <span className="underline underline-offset-2">{heroSlides[editingHeroIdx]?.ctaText}</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* MODAL: ADD PRODUCT */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-cream rounded-[2.5rem] border border-charcoal/10 p-8 shadow-soft overflow-y-auto max-h-[85vh]"
            >
              <div className="flex items-center justify-between border-b border-charcoal/10 pb-4 mb-6">
                <h3 className="font-display text-2xl font-light">New Dress Listing</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="h-8 w-8 rounded-full border border-charcoal/10 flex items-center justify-center bg-white hover:border-charcoal"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block uppercase tracking-wider text-charcoal/40 mb-1.5">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Mridula Silk Lehenga"
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
                      placeholder="e.g. ₹18,000"
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
                    placeholder="Short luxury description..."
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
                  Publish to Storefront
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: EDIT PRODUCT */}
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
                <h3 className="font-display text-2xl font-light">Edit Catalog Listing</h3>
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
                  Save Catalog Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
export default AdminPage

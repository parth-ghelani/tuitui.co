import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '../lib/supabaseClient'
import { Check, WarningCircle, Eye, EyeSlash } from '@phosphor-icons/react'

export function SellerLoginPage() {
  const navigate = useNavigate()

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Notification states
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsLoading(false)

    if (error) {
      console.error(error.message)
      setErrorMsg(error.message)
      return
    }

    console.log('SUCCESS', data)
    setSuccessMsg('Session authenticated. Redirecting...')
    setTimeout(() => {
      navigate('/admin')
    }, 1200)
  }


  return (
    <div className="min-h-screen w-full bg-cream flex flex-col md:flex-row font-sans select-none overflow-hidden">
      
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-8 left-1/2 z-50 rounded-full bg-charcoal text-cream px-6 py-3.5 text-xs uppercase tracking-[0.2em] shadow-soft border border-red-900/30 flex items-center gap-3"
          >
            <WarningCircle size={16} className="text-red-500" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-8 left-1/2 z-50 rounded-full bg-charcoal text-cream px-6 py-3.5 text-xs uppercase tracking-[0.2em] shadow-soft border border-white/10 flex items-center gap-3"
          >
            <Check size={16} className="text-umber" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT COLUMN: Editorial Visual Banner */}
      <div className="hidden md:flex md:w-[45%] lg:w-[50%] relative bg-charcoal">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-65 scale-102 filter blur-[1px] transition-all duration-1000"
          style={{ backgroundImage: `url('/images/editorial/udaipur-1.jpg')` }}
        />
        {/* Luxury Vignette and Branding overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent flex flex-col justify-between p-16 z-10 text-cream">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-umber font-semibold">Atelier Gateway</p>
            <h2 className="text-4xl font-light font-display tracking-tight mt-3">The Tuitui Co.</h2>
          </div>
          <div className="space-y-4 max-w-sm">
            <span className="inline-block text-[8px] uppercase tracking-widest text-[#D4A574] border border-[#D4A574]/30 px-3 py-1 rounded-full bg-charcoal/40 backdrop-blur-md">
              Vendor & Admin Gate
            </span>
            <p className="text-xs leading-relaxed text-cream/65 font-light">
              Enter secure boutique credentials to manage inventory collections, fulfill consumer orders, and edit slides.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Luxury Login Form Container */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 md:p-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          className="w-full max-w-md space-y-12 bg-white/40 p-8 sm:p-12 rounded-[2.5rem] border border-charcoal/5 shadow-sm"
        >
          {/* Header */}
          <div className="text-center md:text-left">
            <span className="text-[9px] uppercase tracking-[0.25em] text-umber font-semibold">Sign In</span>
            <h1 className="font-display font-light text-4xl text-charcoal mt-3">Atelier Portal</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Input Field */}
            <div className="relative group">
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="w-full h-14 bg-cream/30 border border-charcoal/10 rounded-xl px-4 pt-4 text-xs font-light tracking-wide focus:border-charcoal focus:bg-white focus:outline-none transition-all duration-300 peer"
              />
              <label
                htmlFor="email-input"
                className="absolute left-4 top-4 text-charcoal/40 text-xs uppercase tracking-wider font-light pointer-events-none transform origin-left transition-all duration-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-2.5 peer-focus:text-charcoal peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:-translate-y-2.5"
              >
                Email Address
              </label>
            </div>

            {/* Password Input Field */}
            <div className="relative group">
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="w-full h-14 bg-cream/30 border border-charcoal/10 rounded-xl px-4 pr-12 pt-4 text-xs font-light tracking-wide focus:border-charcoal focus:bg-white focus:outline-none transition-all duration-300 peer"
              />
              <label
                htmlFor="password-input"
                className="absolute left-4 top-4 text-charcoal/40 text-xs uppercase tracking-wider font-light pointer-events-none transform origin-left transition-all duration-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-2.5 peer-focus:text-charcoal peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:-translate-y-2.5"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-charcoal text-cream text-[10px] uppercase tracking-[0.25em] font-medium rounded-full hover:bg-black hover:shadow-lg focus:outline-none transition-all duration-500 flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-cream" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Credentials Guide Info */}
          <div className="border-t border-charcoal/5 pt-6 text-[10px] text-charcoal/40 uppercase tracking-widest text-center space-y-1">
            <p>Seller login: <span className="font-semibold text-charcoal/60">vendor@tuitui.co</span> / <span className="font-semibold text-charcoal/60">atelier</span></p>
            <p>Admin login: <span className="font-semibold text-charcoal/60">admin@tuitui.co</span> / <span className="font-semibold text-charcoal/60">atelier</span></p>
          </div>
        </motion.div>
      </div>

    </div>
  )
}
export default SellerLoginPage

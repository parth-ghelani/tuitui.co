import { AnimatePresence, motion } from 'motion/react'
import { X, Trash } from '@phosphor-icons/react'
import { useCartStore } from '../../store/useCartStore'
import { useNavigate } from 'react-router-dom'

type CartDrawerProps = {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, addItem, removeItem, subtotal } = useCartStore()
  const navigate = useNavigate()

  const formattedSubtotal = `₹${subtotal().toLocaleString('en-IN')}`

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 z-50 h-full w-[min(420px,92vw)] border-l border-charcoal/10 bg-cream"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex h-full flex-col font-sans">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
                <p className="font-display text-2xl tracking-tight text-charcoal">
                  Your Wardrobe
                </p>
                <button
                  type="button"
                  aria-label="Close cart"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/10 bg-white text-charcoal transition-all duration-500 hover:border-charcoal/30 hover:scale-105"
                >
                  <X size={18} weight="light" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
                    <p className="font-display text-xl text-charcoal/50 italic">
                      Your wardrobe is empty.
                    </p>
                    <button
                      onClick={onClose}
                      className="text-xs uppercase tracking-[0.2em] text-charcoal underline underline-offset-4 hover:text-umber transition-colors"
                    >
                      Browse Collections
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div
                        key={`${item.id}-${item.size}-${item.color}`}
                        className="flex gap-4 border-b border-charcoal/5 pb-6"
                      >
                        <div className="h-28 w-20 overflow-hidden bg-beige">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-semibold text-charcoal tracking-tight">
                                {item.name}
                              </h4>
                              <button
                                onClick={() =>
                                  useCartStore.setState((state) => ({
                                    items: state.items.filter(
                                      (i) =>
                                        !(
                                          i.id === item.id &&
                                          i.size === item.size &&
                                          i.color === item.color
                                        )
                                    ),
                                  }))
                                }
                                className="text-charcoal/40 hover:text-charcoal transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash size={16} weight="light" />
                              </button>
                            </div>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-charcoal/50">
                              Size {item.size} / Color{' '}
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full border border-charcoal/10 ml-1 align-middle"
                                style={{ background: item.color }}
                              />
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3 rounded-full border border-charcoal/10 bg-white px-3 py-1 text-xs text-charcoal">
                              <button
                                type="button"
                                onClick={() => removeItem(item.id, item.size, item.color)}
                                className="hover:text-charcoal/60 transition-colors w-4"
                              >
                                -
                              </button>
                              <span className="w-4 text-center font-medium">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => addItem(item)}
                                className="hover:text-charcoal/60 transition-colors w-4"
                              >
                                +
                              </button>
                            </div>
                            <p className="font-display text-base text-charcoal">
                              ₹{(item.priceValue * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-charcoal/10 bg-white px-6 py-6">
                  <div className="flex items-center justify-between text-sm text-charcoal">
                    <span className="uppercase tracking-[0.1em] text-xs text-charcoal/60">Subtotal</span>
                    <span className="font-display text-2xl text-charcoal">
                      {formattedSubtotal}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="mt-6 w-full rounded-full bg-charcoal px-6 py-4 text-xs uppercase tracking-[0.3em] text-cream transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-black hover:shadow-lg"
                  >
                    Proceed to checkout
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full rounded-full border border-charcoal/20 px-6 py-3.5 text-xs uppercase tracking-[0.3em] text-charcoal hover:bg-charcoal hover:text-cream transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  >
                    Continue Browsing
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

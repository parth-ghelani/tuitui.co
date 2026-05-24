import { motion } from 'motion/react'

export function ProductSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden bg-cream/40 p-4 border border-charcoal/5 rounded-[2rem] shadow-sm ${className}`}
    >
      {/* Padded Mounting Frame */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.6rem] bg-[#f5efe6] flex items-center justify-center p-0">
        {/* Soft breathing opacity block with a subtle gold highlight */}
        <motion.div
          animate={{
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-4/5 h-4/5 rounded-lg bg-beige/40"
        />
        
        {/* Ambient golden soft pulse */}
        <motion.div
          animate={{ opacity: [0.08, 0.22, 0.08] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-tr from-[#D4A574]/5 via-transparent to-transparent pointer-events-none"
        />
      </div>

      {/* Details Skeleton */}
      <div className="mt-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            {/* Title Line Placeholder */}
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
              className="h-6 w-3/5 rounded bg-charcoal/10"
            />
            {/* Price Line Placeholder */}
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              className="h-6 w-1/5 rounded bg-charcoal/10"
            />
          </div>

          {/* Description reveal space */}
          <div className="space-y-2 mt-4">
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="h-3 w-full rounded bg-charcoal/5"
            />
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="h-3 w-4/5 rounded bg-charcoal/5"
            />
          </div>

          {/* Sizes and Colors */}
          <div className="mt-6 flex items-center justify-between gap-2 border-t border-charcoal/5 pt-4">
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 w-6 rounded bg-charcoal/5" />
              ))}
            </div>
            <div className="flex gap-1.5">
              {[1, 2].map((i) => (
                <div key={i} className="h-3 w-3 rounded-full bg-charcoal/5" />
              ))}
            </div>
          </div>
        </div>

        {/* Buttons placeholders */}
        <div className="mt-6 flex gap-3">
          <div className="h-9 flex-1 rounded-full border border-charcoal/10 bg-cream/40" />
          <div className="h-9 flex-1 rounded-full bg-charcoal/5" />
        </div>
      </div>
    </div>
  )
}
export default ProductSkeleton

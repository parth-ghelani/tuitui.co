import logoWordmarkLight from '../../assets/brand/logo-wordmark-light.png'
import logoMarkLight from '../../assets/brand/logo-mark-light.png'

const footerLinks = [
  {
    title: 'Shop',
    items: ['All Collections', 'New Arrivals', 'Best Sellers', 'Lookbook'],
  },
  {
    title: 'Customer Care',
    items: ['Contact', 'Shipping', 'Returns', 'Size Guide', 'FAQ'],
  },
  {
    title: 'Contact',
    items: ['contact@thetuitui.co', '+91 99999 88888', 'Mumbai, India'],
  },
]

export function Footer() {
  return (
    <footer className="mt-24 bg-charcoal text-cream">
      <div className="mx-auto w-[min(1200px,92vw)] py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_2fr]">
          <div className="space-y-6">
            <img src={logoWordmarkLight} alt="The Tuitui Co" className="h-10" />
            <p className="max-w-sm text-sm text-cream/70">
              A modern Indian womenswear label celebrating refined silhouettes,
              artisan textures, and a quiet kind of confidence.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/20">
                <img src={logoMarkLight} alt="" className="h-7 w-7" />
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-cream/70">
                Fusion of cultures, fashionably yours
              </p>
            </div>
          </div>

          <div className="grid gap-8 text-sm sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-cream/60">
                  {group.title}
                </p>
                <ul className="space-y-2 text-cream/80">
                  {group.items.map((item) => (
                    <li key={item} className="transition hover:text-cream">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-cream/10 pt-8 text-xs uppercase tracking-[0.3em] text-cream/50">
          © 2026 The Tuitui Co. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

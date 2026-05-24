import { PageTransition } from '../components/layout/PageTransition'

export function CartPage() {
  return (
    <PageTransition>
      <section className="bg-cream py-20">
        <div className="mx-auto w-[min(1000px,92vw)]">
          <p className="text-xs uppercase tracking-[0.4em] text-umber">Cart</p>
          <h1 className="mt-4 text-4xl font-semibold">Your edit</h1>

          <div className="mt-12 rounded-[2rem] border border-charcoal/10 bg-white/80 p-8">
            <div className="flex items-center justify-between border-b border-beige pb-6 text-sm uppercase tracking-[0.4em] text-charcoal/60">
              <span>Product</span>
              <span>Total</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80"
                  alt="Satin wrap top"
                  className="h-24 w-20 object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">Satin Wrap Top</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-umber">
                    Size M
                  </p>
                </div>
              </div>
              <p className="font-display text-lg">₹3,900</p>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-beige pt-6">
              <p className="text-sm uppercase tracking-[0.4em] text-charcoal/60">
                Subtotal
              </p>
              <p className="font-display text-2xl">₹3,900</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="flex-1 rounded-full bg-charcoal px-6 py-3 text-xs uppercase tracking-[0.4em] text-cream transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-black">
                Proceed to checkout
              </button>
              <button className="flex-1 rounded-full border border-charcoal/20 px-6 py-3 text-xs uppercase tracking-[0.4em] text-charcoal">
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

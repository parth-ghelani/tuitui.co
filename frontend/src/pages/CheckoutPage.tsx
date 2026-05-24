import { PageTransition } from '../components/layout/PageTransition'

export function CheckoutPage() {
  return (
    <PageTransition>
      <section className="bg-cream py-20">
        <div className="mx-auto grid w-[min(1100px,92vw)] gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-charcoal/10 bg-white/80 p-8">
            <p className="text-xs uppercase tracking-[0.4em] text-umber">
              Checkout
            </p>
            <h1 className="mt-4 text-3xl font-semibold">Shipping details</h1>

            <form className="mt-8 grid gap-5">
              <input
                placeholder="Full name"
                className="h-12 rounded-full border border-charcoal/20 px-5 text-sm"
              />
              <input
                placeholder="Email address"
                className="h-12 rounded-full border border-charcoal/20 px-5 text-sm"
              />
              <input
                placeholder="Phone number"
                className="h-12 rounded-full border border-charcoal/20 px-5 text-sm"
              />
              <input
                placeholder="Address line 1"
                className="h-12 rounded-full border border-charcoal/20 px-5 text-sm"
              />
              <input
                placeholder="City"
                className="h-12 rounded-full border border-charcoal/20 px-5 text-sm"
              />
              <input
                placeholder="Postal code"
                className="h-12 rounded-full border border-charcoal/20 px-5 text-sm"
              />

              <button className="mt-2 rounded-full bg-charcoal px-6 py-3 text-xs uppercase tracking-[0.4em] text-cream transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-black">
                Continue to payment
              </button>
            </form>
          </div>

          <aside className="rounded-[2rem] border border-charcoal/10 bg-white/80 p-8">
            <p className="text-xs uppercase tracking-[0.4em] text-umber">
              Order summary
            </p>
            <div className="mt-6 space-y-4 text-sm text-charcoal/70">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-display text-lg text-charcoal">
                  ₹3,900
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="font-display text-xl text-charcoal">
                  ₹3,900
                </span>
              </div>
            </div>
            <div className="mt-8 rounded-full border border-charcoal/20 px-5 py-3 text-xs uppercase tracking-[0.4em] text-charcoal/70">
              Coupon: TUITUI2026
            </div>
          </aside>
        </div>
      </section>
    </PageTransition>
  )
}

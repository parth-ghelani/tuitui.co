export function Newsletter() {
  return (
    <section className="bg-cream pb-24">
      <div className="mx-auto w-[min(1200px,92vw)]">
        <div className="rounded-[2rem] border border-charcoal/10 bg-beige/60 p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-umber">
                Studio notes
              </p>
              <h3 className="mt-4 text-3xl font-semibold">
                Receive early access to drops and private previews.
              </h3>
              <p className="mt-4 text-sm text-charcoal/70">
                Monthly dispatches from our atelier — tactile textures, styling
                stories, and behind-the-scenes glimpses.
              </p>
            </div>
            <form className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email address"
                className="h-12 rounded-full border border-charcoal/20 bg-white px-5 text-sm uppercase tracking-[0.2em] text-charcoal placeholder:text-charcoal/40"
              />
              <button
                type="submit"
                className="h-12 rounded-full bg-charcoal text-xs uppercase tracking-[0.4em] text-cream transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-black"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

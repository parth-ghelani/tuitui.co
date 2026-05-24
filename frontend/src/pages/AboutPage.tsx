import { PageTransition } from '../components/layout/PageTransition'
import { AboutBrand } from '../components/sections/AboutBrand'
import { Newsletter } from '../components/sections/Newsletter'

export function AboutPage() {
  return (
    <PageTransition>
      <section className="bg-cream py-20">
        <div className="mx-auto w-[min(1000px,92vw)]">
          <p className="text-xs uppercase tracking-[0.4em] text-umber">
            Studio
          </p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
            A quiet luxury label for women who lead with grace.
          </h1>
        </div>
      </section>
      <AboutBrand />
      <Newsletter />
    </PageTransition>
  )
}

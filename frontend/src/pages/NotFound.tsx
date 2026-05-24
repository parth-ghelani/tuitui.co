import { Link } from 'react-router-dom'
import { PageTransition } from '../components/layout/PageTransition'

export function NotFound() {
  return (
    <PageTransition>
      <section className="bg-cream py-32 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-umber">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
        <p className="mt-4 text-sm text-charcoal/70">
          The page you requested has moved or no longer exists.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full border border-charcoal/20 px-6 py-3 text-xs uppercase tracking-[0.4em] text-charcoal transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-charcoal hover:text-cream"
        >
          Return home
        </Link>
      </section>
    </PageTransition>
  )
}

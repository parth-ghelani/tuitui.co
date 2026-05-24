import { PageTransition } from '../components/layout/PageTransition'
import { AboutBrand } from '../components/sections/AboutBrand'
import { FeaturedCollections } from '../components/sections/FeaturedCollections'
import { Hero } from '../components/sections/Hero'
import { IndianCollectionSlider } from '../components/sections/IndianCollectionSlider'
import { NewArrivals } from '../components/sections/NewArrivals'
import { Newsletter } from '../components/sections/Newsletter'

export function HomePage() {
  return (
    <PageTransition>
      {/* Section 1: Luxury Fullscreen Hero */}
      <Hero />
      
      {/* Section 2: Asymmetric Storytelling */}
      <AboutBrand />
      
      {/* Section 3: Interactive Cinematic Showcase */}
      <IndianCollectionSlider />
      
      {/* Section 4: Premium Indian/Western Collection Split */}
      <FeaturedCollections />
      
      {/* Section 5: Luxury Featured Products */}
      <NewArrivals />
      
      {/* Bottom Newsletter */}
      <Newsletter />
    </PageTransition>
  )
}
export default HomePage

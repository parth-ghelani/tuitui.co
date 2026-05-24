import { AnimatePresence } from 'motion/react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { SiteLayout } from '../components/layout/SiteLayout'
import { HomePage } from '../pages/HomePage'
import { ShopPage } from '../pages/ShopPage'
import { ProductPage } from '../pages/ProductPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { AboutPage } from '../pages/AboutPage'
import { NotFound } from '../pages/NotFound'
import { AdminPage } from '../pages/AdminPage'
import { SellerPage } from '../pages/SellerPage'
import { SellerLoginPage } from '../pages/SellerLoginPage'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'

export function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          {/* Protected Shopping Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>
          
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* Backend Dashboards (Protected) */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="admin" element={<AdminPage />} />
        </Route>
        
        <Route element={<ProtectedRoute role="seller" />}>
          <Route path="seller" element={<SellerPage />} />
        </Route>

        {/* Auth Gate */}
        <Route path="seller/login" element={<SellerLoginPage />} />
      </Routes>
    </AnimatePresence>
  )
}


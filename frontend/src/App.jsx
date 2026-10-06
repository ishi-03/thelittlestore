import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TopBar from './components/TopBar.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import GiftSets from './pages/GiftSets.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import About from './pages/AboutPage.jsx'
import Contact from './pages/ContactPage.jsx'
import Products from "./pages/admin/Products.jsx";
import Categories from "./pages/admin/Categories.jsx";
import AgeGroups from "./pages/admin/AgeGroups.jsx";
import Cart from './pages/Cart.jsx'
import Favorites from './pages/Favorites.jsx'
import Checkout from './pages/Checkout.jsx'
import TrackOrder from './pages/TrackOrder.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import AdminGuard from './components/admin/AdminGuard.jsx'
import AdminLogin from './pages/admin/Login.jsx'
import AdminOrders from './pages/admin/Orders.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'


function App() {
  return (
    <div className="min-h-screen bg-cream font-body">
      <TopBar />
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/shop"        element={<Shop />} />
        <Route path="/gift-sets"   element={<GiftSets />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about"       element={<About />} />
        <Route path="/contact"     element={<Contact />} />
        <Route path="/cart"        element={<Cart />} />
        <Route path="/favorites"   element={<Favorites />} />
        <Route path="/checkout"    element={<Checkout />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/products" element={<AdminGuard><Products /></AdminGuard>} />
        <Route path="/admin/categories" element={<AdminGuard><Categories /></AdminGuard>} />
        <Route path="/admin/age-groups" element={<AdminGuard><AgeGroups /></AdminGuard>} />
        <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
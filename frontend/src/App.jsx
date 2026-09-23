import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TopBar from './components/TopBar.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import GiftSets from './pages/GiftSets.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
// import Collections from './pages/Collections.jsx'
import About from './pages/AboutPage.jsx'
import Contact from './pages/ContactPage.jsx'
import Products from "./pages/admin/Products.jsx";
import Categories from "./pages/admin/Categories.jsx";
import AgeGroups from "./pages/admin/AgeGroups.jsx";

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
         {/* <Route path="/collections" element={<Collections />} /> */}
        <Route path="/about"       element={<About />} />
        <Route path="/contact"     element={<Contact />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/age-groups" element={<AgeGroups />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
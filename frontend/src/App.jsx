import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CatalogPage from './pages/CatalogPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ItemDetailPage from './pages/ItemDetailPage';
import PickupPage from './pages/PickupPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import ImpactPage from './pages/ImpactPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import EditProductPage from './pages/EditProductPage';
import CartPage from './pages/CartPage';
import InvoicePage from './pages/InvoicePage';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/katalog" element={<CatalogPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/detail/:id" element={<ItemDetailPage />} />
          <Route path="/pickup" element={<PickupPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/edit-produk/:id" element={<EditProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/invoice" element={<InvoicePage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

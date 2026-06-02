import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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

import PesanMakananPage from './pages/PesanMakananPage';
import KonfirmasiBuktiPage from './pages/KonfirmasiBuktiPage';
import RiwayatPage from './pages/RiwayatPage';

import FlashSalePage from './pages/FlashSalePage';
import GamifikasiPage from './pages/GamifikasiPage';
import DampakPage from './pages/DampakPage';
import NotifikasiPage from './pages/NotifikasiPage';
import PetaPage from './pages/PetaPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/katalog" element={<CatalogPage />} />
            <Route path="/impact" element={<DampakPage />} />
            <Route path="/dampak" element={<DampakPage />} />
            <Route path="/flash-sale" element={<FlashSalePage />} />
            <Route path="/gamifikasi" element={<GamifikasiPage />} />
            <Route path="/notifikasi" element={<NotifikasiPage />} />
            <Route path="/peta" element={<PetaPage />} />
            
            {/* Detail Makanan */}
            <Route path="/makanan/:id" element={<ItemDetailPage />} />
            <Route path="/detail/:id" element={<ItemDetailPage />} /> {/* Backward compatibility */}

            {/* Protected Routes (Standard User) */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/makanan/tambah" element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            } /> {/* Backward compatibility */}
            
            <Route path="/pesan/:makananId" element={
              <ProtectedRoute>
                <PesanMakananPage />
              </ProtectedRoute>
            } />
            <Route path="/konfirmasi-bukti" element={
              <ProtectedRoute>
                <KonfirmasiBuktiPage />
              </ProtectedRoute>
            } />
            <Route path="/riwayat" element={
              <ProtectedRoute>
                <RiwayatPage />
              </ProtectedRoute>
            } />

            <Route path="/pickup" element={
              <ProtectedRoute>
                <PickupPage />
              </ProtectedRoute>
            } />
            <Route path="/payment" element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/edit-produk/:id" element={
              <ProtectedRoute>
                <EditProductPage />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="/invoice" element={
              <ProtectedRoute>
                <InvoicePage />
              </ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

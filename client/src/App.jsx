import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/public/HomePage';
import PropertiesPage from './pages/public/PropertiesPage';
import PropertyDetailPage from './pages/public/PropertyDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import FavoritesPage from './pages/buyer/FavoritesPage';
import BuyerInquiriesPage from './pages/buyer/BuyerInquiriesPage';

import AddPropertyPage from './pages/owner/AddPropertyPage';
import EditPropertyPage from './pages/owner/EditPropertyPage';
import ManageListingsPage from './pages/owner/ManageListingsPage';
import OwnerInquiriesPage from './pages/owner/OwnerInquiriesPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPropertiesPage from './pages/admin/AdminPropertiesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:id" element={<PropertyDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/inquiries" element={<BuyerInquiriesPage />} />
              </Route>
              
              <Route element={<ProtectedRoute role="owner" />}>
                <Route path="/list-property" element={<AddPropertyPage />} />
                <Route path="/my-listings" element={<ManageListingsPage />} />
                <Route path="/owner/inquiries" element={<OwnerInquiriesPage />} />
                <Route path="/owner/properties/edit/:id" element={<EditPropertyPage />} />
              </Route>

              <Route element={<ProtectedRoute role="admin" />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/properties" element={<AdminPropertiesPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
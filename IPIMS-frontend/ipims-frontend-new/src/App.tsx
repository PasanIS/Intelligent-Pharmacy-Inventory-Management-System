import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/Login.tsx';
import DashboardPage from './pages/Dashboard.tsx';
import InventoryPage from './pages/Inventory.tsx';
import AddDrugPage from './pages/AddDrug.tsx';
import AddSupplierPage from './pages/AddSupplier.tsx';
import AlertsPage from './pages/Alerts.tsx';
import SuppliersPage from './pages/Suppliers.tsx';
import SignUpPage from './pages/Signup.tsx';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
      <Route path="/add-drug" element={<ProtectedRoute><AddDrugPage /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
      <Route path="/suppliers" element={<ProtectedRoute><SuppliersPage /></ProtectedRoute>} />
      <Route path="/add-supplier" element={<ProtectedRoute><AddSupplierPage /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { VehicleDetails } from './pages/VehicleDetails';
import { VehicleSearch } from './pages/VehicleSearch';
import { MyPurchases } from './pages/MyPurchases';
import { PurchaseVehicle } from './pages/PurchaseVehicle';
import { AdminDashboard } from './pages/AdminDashboard';
import { RecentActivity } from './pages/RecentActivity';
import { NotFound } from './pages/NotFound';

// Instantiate TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Client Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/vehicles/:id" element={<VehicleDetails />} />
              <Route path="/vehicles/:id/purchase" element={<PurchaseVehicle />} />
              <Route path="/search" element={<VehicleSearch />} />
              <Route path="/purchases" element={<MyPurchases />} />
              <Route path="/activity" element={<RecentActivity />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Fallback 404 Route */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(51, 65, 85, 0.8)',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

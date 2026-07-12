import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { VehicleCard } from '../components/VehicleCard';
import { AdminDashboard } from '../pages/AdminDashboard';
afterEach(() => {
  cleanup()
})
// Helper to render components wrapped in Providers
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>{ui}</BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('Frontend Pages & Components', () => {
  
  describe('Login Form Page', () => {
    it('renders input elements and validation errors', async () => {
      renderWithProviders(<Login />);

      // Verify page titles and login components
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByText('CarVanta Dealership Portal')).toBeInTheDocument();

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: /login/i });

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      // Trigger empty submission for validation errors
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Must be a valid email address')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });
  });

  describe('Registration Form Page', () => {
    it('renders register input fields and triggers validations', async () => {
      renderWithProviders(<Register />);

      expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();

      const nameInput = screen.getByPlaceholderText('Enter your full name');
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Min. 6 characters');
      const registerButton = screen.getByRole('button', { name: /register/i });

      expect(nameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();

      // Trigger empty fields validation check
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Must be a valid email address')).toBeInTheDocument();
        expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
      });
    });
  });

  describe('Vehicle Card Component', () => {
    const dummyInStock = {
      id: 'v-1',
      make: 'Honda',
      model: 'Civic',
      category: 'Sedan',
      price: 24000,
      quantity: 5,
      createdAt: '',
      updatedAt: '',
    };

    const dummyOutOfStock = {
      id: 'v-2',
      make: 'Ford',
      model: 'Mustang',
      category: 'Sports',
      price: 38000,
      quantity: 0,
      createdAt: '',
      updatedAt: '',
    };

    it('renders vehicle specs and allows click action', () => {
      const handlePurchase = vi.fn();
      render(
        <VehicleCard vehicle={dummyInStock} onPurchase={handlePurchase} />
      );

      expect(screen.getByText('Honda')).toBeInTheDocument();
      expect(screen.getByText('Civic')).toBeInTheDocument();
      expect(screen.getByText('Sedan')).toBeInTheDocument();
      expect(screen.getByText('In Stock: 5')).toBeInTheDocument();

      // Click card
      fireEvent.click(screen.getByText('Civic'));
      expect(handlePurchase).toHaveBeenCalledWith('v-1');
    });

    it('does not trigger click action when quantity is zero', () => {
      const handlePurchase = vi.fn();
      render(<VehicleCard vehicle={dummyOutOfStock} onPurchase={handlePurchase} />);

      expect(screen.getByText('Sold Out')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Mustang'));
      expect(handlePurchase).not.toHaveBeenCalled();
    });
  });

  describe('Dashboard Component Rendering', () => {
    beforeEach(() => {
      localStorage.setItem('user', JSON.stringify({ id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'USER' }));
      localStorage.setItem('token', 'mock-token');
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('renders loaders first, then resolves and displays mock list of vehicles', async () => {
      renderWithProviders(<Dashboard />);

      // Confirm showroom catalog headers are present
      expect(screen.getByText('All Vehicles')).toBeInTheDocument();
      expect(screen.getByText('Browse our collection of quality vehicles')).toBeInTheDocument();

      // Wait for mock server data to resolve and render cards
      await waitFor(() => {
        expect(screen.getAllByText('Toyota')[0]).toBeInTheDocument();
        expect(screen.getByText('RAV4')).toBeInTheDocument();
        expect(screen.getAllByText('Tesla')[0]).toBeInTheDocument();
        expect(screen.getByText('Model 3')).toBeInTheDocument();
      });
    });
  });

  describe('Admin Dashboard Panel Management', () => {
    beforeEach(() => {
      localStorage.setItem('user', JSON.stringify({ id: 'admin-1', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' }));
      localStorage.setItem('token', 'mock-token');
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('renders inventory listing with manage actions', async () => {
      renderWithProviders(<AdminDashboard />);

      // Admin page titles and stats indicators
      expect(screen.getByText('Admin Control Panel')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add vehicle/i })).toBeInTheDocument();

      // Wait for mock data
      await waitFor(() => {
        expect(screen.getAllByText(/Toyota/i)[0]).toBeInTheDocument();
        // Since it's admin, they should have restock, edit, and delete action triggers in list
        expect(screen.getAllByRole('button', { name: /restock/i })[0]).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /edit/i })[0]).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: /delete/i })[0]).toBeInTheDocument();
      });
    });
  });
});

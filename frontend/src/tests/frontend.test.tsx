import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { Register } from '../pages/Register';
import { Login } from '../pages/Login';


afterEach(() => {
  cleanup();
});

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
})
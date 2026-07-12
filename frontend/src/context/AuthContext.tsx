import React, { createContext, useState, useEffect, useContext } from 'react';
import type { User, ApiResponse, AuthResponse } from '../types';
import type { RegisterInput} from '../schemas';
import axiosClient from '../api/axiosClient';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (data: RegisterInput) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen to token expired events
    const handleExpired = () => {
      logout();
    };

    window.addEventListener('auth-expired', handleExpired);
    return () => {
      window.removeEventListener('auth-expired', handleExpired);
    };
  }, []);

  const register = async (data: RegisterInput) => {
    setLoading(true);
    try {
      await axiosClient.post<ApiResponse<{ user: User }>>('/auth/register', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

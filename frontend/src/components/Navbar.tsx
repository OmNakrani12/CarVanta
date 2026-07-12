import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import projectLogo from '../assets/logo.png';
import { LogOut, LayoutDashboard, Shield, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-dark-800/80 px-6 py-4 bg-dark-950/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 text-white hover:text-brand-400 transition-colors duration-300">
          <img
            src={projectLogo}
            alt="CarVanta Logo"
            className="h-9 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(99,102,241,0.2)]"
          />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-dark-100 to-brand-400 bg-clip-text text-transparent">
            CarVanta
          </span>
        </Link>

        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <Link
                to="/"
                className="flex items-center space-x-2 text-dark-300 hover:text-white transition-colors duration-200"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 text-brand-400 hover:text-brand-300 transition-colors duration-200"
                >
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Admin Panel</span>
                </Link>
              )}

              <div className="h-4 w-[1px] bg-dark-800" />

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-dark-800 p-1.5 rounded-lg">
                    <UserIcon className="h-4 w-4 text-dark-300" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-white leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-dark-400 capitalize">
                      {user.role.toLowerCase()}
                    </span>
                  </div>
                  {isAdmin ? (
                    <span className="text-[10px] bg-red-950/60 text-red-400 border border-red-900/60 px-2 py-0.5 rounded-full font-bold tracking-wider">
                      ADMIN
                    </span>
                  ) : (
                    <span className="text-[10px] bg-brand-950/60 text-brand-400 border border-brand-900/60 px-2 py-0.5 rounded-full font-bold tracking-wider">
                      USER
                    </span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 px-3 py-1.5 rounded-lg border border-red-900/30 hover:border-red-900/50 transition-all duration-300 text-sm font-medium active:scale-95"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-dark-300 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="glass-btn-primary py-1.5 px-4 text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

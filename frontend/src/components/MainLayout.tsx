import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Car,
  Search,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  Bell,
  ChevronDown,
  Shield,
  Users,
  BarChart3,
  ClipboardList
} from 'lucide-react';

import projectLogo from '../assets/logo.png';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen flex bg-[#070b13] text-white font-sans overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0b1329] text-white flex flex-col justify-between shrink-0 border-r border-white/5">
        <div>
          {/* Logo */}
          <div className="h-16 px-6 flex items-center space-x-2.5 border-b border-white/5 shrink-0">
            <img
              src={projectLogo}
              alt="CarVanta Logo"
              className="h-8 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(99,102,241,0.25)]"
            />
            <span className="text-xl font-black tracking-wider text-white">CarVanta</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 px-3 py-6">
            {isAdmin ? (
              // Admin Sidebar
              <>
                <Link
                  to="/admin"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${isActive('/admin')
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/10'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${isActive('/')
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/10'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Vehicles</span>
                </Link>
              </>
            ) : (
              // Client Sidebar
              <>
                <Link
                  to="/"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${isActive('/')
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/10'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/search"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${isActive('/search')
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/10'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </Link>

                <Link
                  to="/purchases"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${isActive('/purchases')
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/10'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>My Purchases</span>
                </Link>
              </>
            )}

            {/* Shared Navigation Items for both Admin and User roles */}
            <div className="h-[1px] bg-white/10 my-2" />
            <Link
              to="/activity"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${isActive('/activity')
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/10'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Recent Activity</span>
            </Link>
          </nav>
        </div>

        {/* Logout at bottom */}
        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-all text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="h-16 bg-[#0c1220] border-b border-white/5 flex items-center justify-between px-8 relative z-30 shadow-sm">
          <div className="text-sm font-bold text-neutral-400">
            Welcome back, <span className="text-brand-400">{user?.name}</span>
          </div>

          <div className="flex items-center space-x-5">
            {/* Notification Bell */}
            {/* <button className="text-neutral-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
            </button> */}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-left focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs shadow-inner">
                  {user?.name.substring(0, 1).toUpperCase()}
                </div>
                <div className="hidden sm:block text-xs font-bold text-neutral-250">
                  {user?.name}
                  <span className="block text-[9px] text-neutral-450 uppercase tracking-wider mt-0.5">
                    {user?.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-48 bg-[#151f32] border border-white/10 rounded-lg shadow-xl py-1 z-50 text-left">
                  <div className="px-4 py-2 border-b border-white/5">
                    <p className="text-xs font-bold text-white">{user?.name}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-red-400 hover:bg-white/5 flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="flex-grow overflow-y-auto bg-[#070b13] px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

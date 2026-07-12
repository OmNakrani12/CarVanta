import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import type { Vehicle, ApiResponse } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import heroCar from '../assets/hero_car.png';
import projectLogo from '../assets/logo.png';
import {
  Car,
  RefreshCw,
  SlidersHorizontal,
  ShieldCheck,
  DollarSign,
  HelpCircle,
  Compass,
  Search,
  LayoutGrid,
  List,
  Tag
} from 'lucide-react';
export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Showroom catalog visual settings state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Query to fetch all vehicles for client showroom
  const { data, isLoading, isError, refetch, isFetching } = useQuery<ApiResponse<{ vehicles: Vehicle[] }>>({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await axiosClient.get('/vehicles');
      return response.data;
    },
    enabled: !!user, // Only fetch catalog if user is logged in
  });

  const vehicles = data?.data?.vehicles || [];

  // Helper currency formatter
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Categories list
  const categories = ['All', 'SUV', 'Sedan', 'Coupe', 'Hatchback', 'Electric'];

  // Dynamically extract unique brand makes from database inventory
  const brands = useMemo(() => {
    const uniqueMakes = Array.from(new Set(vehicles.map((v) => v.make)));
    return ['All', ...uniqueMakes];
  }, [vehicles]);

  // Compute filtered listings
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || v.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesBrand = selectedBrand === 'All' || v.make.toLowerCase() === selectedBrand.toLowerCase();

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [vehicles, searchQuery, selectedCategory, selectedBrand]);

  // 1. PUBLIC LANDING PAGE (Logged out state - premium dark mode interactive showroom landing)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#070b13] text-white flex flex-col font-sans relative overflow-hidden">
        {/* Glow ambient backdrops */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-brand-600/10 blur-[120px] -top-96 -left-48 pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] -bottom-96 -right-48 pointer-events-none" />

        {/* Public Header */}
        <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-20">
          <div className="flex items-center space-x-2.5">
            <img
              src={projectLogo}
              alt="CarVanta Logo"
              className="h-8 w-auto object-contain filter brightness-0 invert"
            />
            <span className="text-xl font-black tracking-wider text-white uppercase">CarVanta</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-[11px] font-black uppercase tracking-widest text-neutral-400">
            <span className="text-white border-b-2 border-brand-500 pb-1 cursor-pointer">Home</span>
            <Link to="/login" className="hover:text-white transition-colors">Inventory</Link>
            <span className="hover:text-white transition-colors cursor-pointer">About Us</span>
            <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-xs font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-brand-600/20"
            >
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-8 md:py-12 -mt-6 md:-mt-12 relative z-10 text-left">

          {/* Left Text Column */}
          <div className="space-y-7">
            <span className="inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-brand-500/10 text-brand-350 border border-brand-500/20">
              Future of Premium Performance
            </span>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] bg-gradient-to-r from-white via-neutral-100 to-brand-400 bg-clip-text text-transparent">
              Find Your <br />
              <span className="text-brand-500">Dream Car</span>
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-md">
              Explore our wide range of quality vehicles at the best prices. Find premium options tailored for you.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <Link
                to="/login"
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 px-7 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-600/20 active:scale-95"
              >
                Browse Inventory
              </Link>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3.5 px-7 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95 backdrop-blur-sm"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Image Showcase Column with radial back glow */}
          <div className="flex justify-center relative">
            <div className="absolute w-72 h-72 rounded-full bg-brand-500/10 blur-[100px] -top-10 pointer-events-none" />
            <img
              src={heroCar}
              alt="Premium Car Showcase"
              className="w-full max-w-md sm:max-w-xl h-auto object-contain filter drop-shadow-[0_20px_50px_rgba(99,102,241,0.25)] animate-fade-in relative z-10 transition-transform duration-500 hover:scale-102"
            />
          </div>
        </main>

        {/* Translucent Features Grid banner */}
        <section className="border-t border-white/10 bg-white/[0.02] backdrop-blur-[2px] py-16 relative z-10 text-left">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-brand-500/10 text-brand-400 p-3 rounded-xl w-fit mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Wide Catalog</h4>
              <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">Access 200+ luxury and performance vehicles checked for catalog spec excellence.</p>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-brand-500/10 text-brand-400 p-3 rounded-xl w-fit mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Best Prices</h4>
              <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">Enjoy completely competitive and transparent rates tailored to you.</p>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-brand-500/10 text-brand-400 p-3 rounded-xl w-fit mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Trusted Dealer</h4>
              <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">Buy with confidence with our strict double quality checks and certificate validations.</p>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="bg-brand-500/10 text-brand-400 p-3 rounded-xl w-fit mb-4">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">24/7 Support</h4>
              <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">Round the clock concierge buyer assistance ready to answer specs questions.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-[70vh]">
      {/* Welcome Hero Banner with soft dark gradient and search overlay */}
      <div className="bg-gradient-to-r from-brand-700 via-neutral-900 to-neutral-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-neutral-850">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="relative z-10 space-y-4 max-w-2xl text-left">
          <span className="inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-brand-500/20 text-brand-350 border border-brand-500/30">
            Exclusive Showroom Access
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Welcome back, <span className="text-brand-450">{user?.name || 'Valued Customer'}</span>!
          </h2>
          <p className="text-neutral-350 text-xs md:text-sm leading-relaxed max-w-md">
            Discover customized performance specs, check real-time stock levels, and purchase your next premium vehicle directly from your portal.
          </p>
          {/* Quick search input */}
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-3.5 py-2 max-w-md w-full focus-within:ring-2 focus-within:ring-brand-400 focus-within:border-transparent transition-all">
            <Search className="w-4 h-4 text-neutral-300 shrink-0" />
            <input
              type="text"
              placeholder="Search by make, model, or specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white placeholder-neutral-350 text-xs font-semibold focus:outline-none ml-2.5 w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-neutral-300 hover:text-white text-xs font-bold px-1.5 uppercase">
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Navigation Actions and Layout Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        {/* Left: Category filters capsules */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none pr-4 text-left">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border shrink-0 ${selectedCategory === cat
                  ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                  : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right: Actions, Filters, and Layout Mode toggles */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
          <button
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 p-2 rounded flex items-center space-x-1 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            title="Sync Inventory"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Layout Toggles */}
          <div className="bg-white/5 border border-white/10 p-1 rounded flex items-center space-x-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-neutral-300'}`}
              title="Grid Gallery View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-neutral-300'}`}
              title="Specs Compare List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => navigate('/search')}
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md shadow-brand-600/10 transition-all active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Specs Filter</span>
          </button>
        </div>
      </div>

      {/* Dynamic Brand Make Capsules Carousel */}
      {brands.length > 2 && (
        <div className="text-left space-y-2 border-b border-white/5 pb-4">
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center space-x-1.5">
            <Tag className="w-3 h-3 text-neutral-400" />
            <span>Select Brand Manufacturer</span>
          </span>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none pr-4">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider transition-all border shrink-0 ${selectedBrand === brand
                    ? 'bg-brand-600/15 border-brand-500/40 text-brand-400 font-black'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
                  }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Showroom Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4 text-left">
        <div>
          <h3 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
            <Car className="w-5 h-5 text-brand-600" />
            <span>All Vehicles</span>
          </h3>
          <p className="text-neutral-400 text-xs mt-0.5">Browse our collection of quality vehicles</p>
        </div>
      </div>

      {/* Showroom Catalog Grid / List display area */}
      <div className="text-left">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <SkeletonLoader key={idx} />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200 shadow-sm animate-fade-in">
            <p className="text-red-500 font-semibold text-sm">Failed to load vehicle list.</p>
            <button onClick={() => refetch()} className="bg-white border border-neutral-300 hover:bg-neutral-50 px-4 py-2 mt-4 rounded text-xs font-bold text-neutral-600">Try Again</button>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 text-center border border-neutral-200 shadow-sm animate-fade-in">
            <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-2">No matching vehicles found.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedBrand('All');
              }}
              className="text-[10px] font-black uppercase tracking-widest text-brand-600 hover:text-brand-500 hover:underline"
            >
              Reset Search Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onPurchase={(id) => navigate(`/vehicles/${id}`)}
              />
            ))}
          </div>
        ) : (
          /* LIST VIEW (Attractive Compare Specs List Layout) */
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-sm divide-y divide-white/5 animate-fade-in">
            {filteredVehicles.map((vehicle) => {
              const isOutOfStock = vehicle.quantity === 0;
              return (
                <div key={vehicle.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-white/5 transition-colors">
                  {/* Left details */}
                  <div className="flex items-center space-x-4">
                    {/* Centered Brand Logo */}
                    <div className="w-16 h-12 bg-black rounded-lg flex items-center justify-center shrink-0 border border-white/5">
                      <img
                        src={`https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/${vehicle.make.toLowerCase().replace(/\s+/g, '-')}.png`}
                        alt={vehicle.make}
                        className="h-8 w-auto object-contain max-w-[85%] filter brightness-0 invert"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/toyota.png';
                        }}
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-extrabold text-white">{vehicle.make} {vehicle.model}</h4>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-neutral-400 mt-1 inline-block">
                        {vehicle.category}
                      </span>
                    </div>
                  </div>

                  {/* Right action controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Price</p>
                      <p className="text-sm font-black text-white">{formatCurrency(vehicle.price)}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Availability</p>
                      <p className={`text-xs font-extrabold ${isOutOfStock ? 'text-red-400' : 'text-emerald-400'}`}>
                        {isOutOfStock ? 'Sold Out' : `${vehicle.quantity} Units`}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                      className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-brand-600/10 shrink-0"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

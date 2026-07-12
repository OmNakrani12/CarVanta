import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import type { Vehicle, ApiResponse } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { Search, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VehicleSearch: React.FC = () => {
  const navigate = useNavigate();

  // Search parameters local form state
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Applied parameters state for query
  const [appliedFilters, setAppliedFilters] = useState({
    make: '',
    model: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  // Query to fetch all vehicles (to extract filter dropdown options dynamically)
  const { data: allData } = useQuery<ApiResponse<{ vehicles: Vehicle[] }>>({
    queryKey: ['all-showroom-vehicles'],
    queryFn: async () => {
      const response = await axiosClient.get('/vehicles');
      return response.data;
    },
  });

  const allVehicles = allData?.data?.vehicles || [];

  // Compute unique dropdown values
  const uniqueMakes = useMemo(() => {
    return Array.from(new Set(allVehicles.map(v => v.make))).sort();
  }, [allVehicles]);

  const uniqueModels = useMemo(() => {
    return Array.from(new Set(allVehicles.map(v => v.model))).sort();
  }, [allVehicles]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(allVehicles.map(v => v.category))).sort();
  }, [allVehicles]);

  // Query search results
  const { data: searchData, isLoading, isError } = useQuery<ApiResponse<{ vehicles: Vehicle[] }>>({
    queryKey: ['search-vehicles', appliedFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (appliedFilters.make) params.append('make', appliedFilters.make);
      if (appliedFilters.model) params.append('model', appliedFilters.model);
      if (appliedFilters.category) params.append('category', appliedFilters.category);
      if (appliedFilters.minPrice) params.append('minPrice', appliedFilters.minPrice);
      if (appliedFilters.maxPrice) params.append('maxPrice', appliedFilters.maxPrice);

      const response = await axiosClient.get(`/vehicles/search?${params.toString()}`);
      return response.data;
    },
  });

  const searchResults = searchData?.data?.vehicles || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({ make, model, category, minPrice, maxPrice });
  };

  const handleReset = () => {
    setMake('');
    setModel('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setAppliedFilters({ make: '', model: '', category: '', minPrice: '', maxPrice: '' });
  };

  return (
    <div className="space-y-6 text-left min-h-[70vh]">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <Search className="w-6 h-6 text-brand-400" />
            <span>Search Showroom</span>
          </h1>
          <p className="text-neutral-450 text-xs mt-1">Search and filter the vehicle catalog</p>
        </div>
      </div>

      {/* Thin & Sleek Horizontal Filters Section */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 shadow-sm space-y-3 backdrop-blur-sm">
        <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
          <Search className="w-4 h-4 text-brand-400" />
          <h2 className="text-xs font-black tracking-widest text-white uppercase">Search & Filter</h2>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
          
          {/* Make Select */}
          <div className="space-y-1">
            <label className="block text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Make</label>
            <select
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl text-xs px-2.5 py-1.5 text-white focus:outline-none focus:border-brand-500 focus:bg-white/10 transition-all cursor-pointer"
            >
              <option value="" className="bg-[#0b1329] text-white">All Makes</option>
              {uniqueMakes.map(m => (
                <option key={m} value={m} className="bg-[#0b1329] text-white">{m}</option>
              ))}
            </select>
          </div>

          {/* Model Select */}
          <div className="space-y-1">
            <label className="block text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl text-xs px-2.5 py-1.5 text-white focus:outline-none focus:border-brand-500 focus:bg-white/10 transition-all cursor-pointer"
            >
              <option value="" className="bg-[#0b1329] text-white">All Models</option>
              {uniqueModels.map(m => (
                <option key={m} value={m} className="bg-[#0b1329] text-white">{m}</option>
              ))}
            </select>
          </div>

          {/* Category Select */}
          <div className="space-y-1">
            <label className="block text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl text-xs px-2.5 py-1.5 text-white focus:outline-none focus:border-brand-500 focus:bg-white/10 transition-all cursor-pointer"
            >
              <option value="" className="bg-[#0b1329] text-white">All Categories</option>
              {uniqueCategories.map(c => (
                <option key={c} value={c} className="bg-[#0b1329] text-white">{c}</option>
              ))}
            </select>
          </div>

          {/* Price Range inputs group */}
          <div className="space-y-1 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Min Price</label>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl text-xs px-2 py-1.5 text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:bg-white/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Max Price</label>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl text-xs px-2 py-1.5 text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          {/* Form submit/reset buttons (Thin UI) */}
          <div className="flex items-center space-x-2">
            <button
              type="submit"
              className="flex-grow bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-1 shadow-md shadow-brand-600/20 transition-all active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold p-2.5 rounded-xl text-xs uppercase transition-all"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>
      </div>

      {/* Results grid below horizontal filter panel */}
      <section className="space-y-4">
        <div className="border-b border-white/5 pb-2">
          <h3 className="text-lg font-black text-white tracking-tight">
            Search Results <span className="text-brand-400">({searchResults.length})</span>
          </h3>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <SkeletonLoader key={idx} />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white/[0.02] rounded-2xl p-12 text-center border border-white/10 shadow-sm">
            <p className="text-red-400 font-semibold text-sm">Failed to retrieve search results.</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="bg-white/[0.02] rounded-2xl p-16 text-center border border-white/10 shadow-sm animate-fade-in">
            <p className="text-neutral-450 text-xs font-bold uppercase tracking-wider">No vehicles match the applied filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {searchResults.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onPurchase={(id) => navigate(`/vehicles/${id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

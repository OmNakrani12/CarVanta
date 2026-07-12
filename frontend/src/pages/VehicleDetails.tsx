import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import type { Vehicle, ApiResponse } from '../types';
import { ArrowLeft, Car, Info, Sparkles } from 'lucide-react';
import { getBrandLogoUrl } from '../components/VehicleCard';

export const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery<ApiResponse<{ vehicle: Vehicle }>>({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const response = await axiosClient.get(`/vehicles/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4" />
        <p className="text-neutral-400">Loading vehicle details...</p>
      </div>
    );
  }

  if (isError || !data?.data?.vehicle) {
    return (
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm">
        <p className="text-red-400 font-semibold text-sm">Vehicle details could not be loaded.</p>
        <div className="flex gap-4 justify-center mt-6">
          <button onClick={() => navigate(-1)} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider transition-all">Back</button>
          <button onClick={() => refetch()} className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-600/10">Retry</button>
        </div>
      </div>
    );
  }

  const vehicle = data.data.vehicle;
  const isOutOfStock = vehicle.quantity === 0;

  // Indian Rupee currency format
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <div className="space-y-6 text-left">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Showroom</span>
      </button>

      {/* Main Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN: VISUAL CONTAINER & DESCRIPTION */}
        <div className="space-y-6">
          {/* Card image container */}
          <div className="h-80 w-full rounded-2xl bg-black relative flex items-center justify-center overflow-hidden border border-white/5 shadow-sm animate-fade-in">
            {getBrandLogoUrl(vehicle.make) ? (
              <img 
                src={getBrandLogoUrl(vehicle.make)} 
                alt={vehicle.make}
                className="h-44 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
              />
            ) : (
              <span className="text-3xl font-black text-white/50 tracking-wider">
                {vehicle.make.substring(0, 2).toUpperCase()}
              </span>
            )}
            <span className="absolute top-4 left-4 bg-black/50 border border-neutral-700/80 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-md shadow-sm backdrop-blur-[2px]">
              {vehicle.category}
            </span>
          </div>

          {/* Description Container */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-black text-white tracking-tight pb-3 border-b border-white/5 flex items-center space-x-2">
              <Info className="w-4 h-4 text-brand-400" />
              <span>Description</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-4 leading-relaxed">
              The {vehicle.make} {vehicle.model} is a premium vehicle in the {vehicle.category} segment. Engineered for high reliability, excellent fuel economy, and outstanding performance. A sleek styling profile combines with an exceptionally spacious cabin and intuitive dashboard safety controls to offer a premium driving experience.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: SPECS GRID & CHECKOUT CTA */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Header summary */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-black border border-white/5 flex items-center justify-center shadow-md shrink-0 overflow-hidden p-1.5">
                {getBrandLogoUrl(vehicle.make) ? (
                  <img 
                    src={getBrandLogoUrl(vehicle.make)} 
                    alt={vehicle.make} 
                    className="w-full h-full object-contain" 
                  />
                ) : (
                  <span className="text-[10px] font-black text-neutral-400">{vehicle.make.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-black text-white tracking-tight">{vehicle.make} {vehicle.model}</h1>
                  <span className="bg-white/5 border border-white/10 text-neutral-400 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    {vehicle.category}
                  </span>
                </div>
                <p className="text-xl font-extrabold text-brand-400 tracking-tight mt-2">{formattedPrice}</p>
              </div>
            </div>

            <div className="text-right">
              {isOutOfStock ? (
                <span className="text-[9px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                  Sold Out
                </span>
              ) : (
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  In Stock: {vehicle.quantity}
                </span>
              )}
            </div>
          </div>

          {/* Specs Details List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/5 pb-2">Vehicle Specifications</h3>
            
            <div className="divide-y divide-white/5 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Make</span>
                <span className="text-white font-bold">{vehicle.make}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Model Variant</span>
                <span className="text-white font-bold">{vehicle.model}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Category</span>
                <span className="text-white font-bold">{vehicle.category}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Fuel Type</span>
                <span className="text-white font-bold">Diesel / Electric</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Transmission</span>
                <span className="text-white font-bold">Automatic Drive</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">Production Year</span>
                <span className="text-white font-bold">2024</span>
              </div>
            </div>
          </div>

          {/* CTA checkout controls */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => navigate(`/vehicles/${vehicle.id}/purchase`)}
              disabled={isOutOfStock}
              className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-neutral-800 disabled:text-white/20 disabled:pointer-events-none text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-lg shadow-brand-600/10 transition-all duration-200 active:scale-95"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Purchase Now</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

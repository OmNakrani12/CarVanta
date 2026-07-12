import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import type { Vehicle, ApiResponse } from '../types';
import { toast } from 'react-hot-toast';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { getBrandLogoUrl } from '../components/VehicleCard';

export const PurchaseVehicle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Query to fetch vehicle details
  const { data, isLoading, isError } = useQuery<ApiResponse<{ vehicle: Vehicle }>>({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const response = await axiosClient.get(`/vehicles/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const vehicle = data?.data?.vehicle;

  // Mutation to purchase vehicle
  const purchaseMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosClient.post(`/vehicles/${id}/purchase`, {
        quantity,
      });
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Vehicle purchased successfully!');
      queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      navigate('/purchases');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Purchase failed');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4" />
        <p className="text-neutral-400">Loading purchase details...</p>
      </div>
    );
  }

  if (isError || !vehicle) {
    return (
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm text-white">
        <p className="text-red-400 font-semibold text-sm">Failed to retrieve vehicle specifications.</p>
        <button onClick={() => navigate(-1)} className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 mt-4 rounded-xl text-xs font-bold text-white transition-all">Back</button>
      </div>
    );
  }

  const isOutOfStock = vehicle.quantity === 0;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const incrementQty = () => {
    if (quantity < vehicle.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = vehicle.price * quantity;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    purchaseMutation.mutate();
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Details</span>
      </button>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN: VEHICLE BRIEF CARD */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="h-48 w-full bg-black rounded-xl relative flex items-center justify-center overflow-hidden border border-white/5 shadow-inner">
            {getBrandLogoUrl(vehicle.make) ? (
              <img 
                src={getBrandLogoUrl(vehicle.make)} 
                alt={vehicle.make}
                className="h-24 w-auto object-contain filter drop-shadow-[0_4px_10px_rgba(255,255,255,0.15)]"
              />
            ) : (
              <span className="text-xl font-black text-white/50 tracking-wider">
                {vehicle.make.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex justify-between items-start">
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
                <h2 className="text-lg font-black text-white">{vehicle.make} {vehicle.model}</h2>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{vehicle.category}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-base font-extrabold text-brand-400">{formatPrice(vehicle.price)}</p>
              {isOutOfStock ? (
                <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider block mt-1">Sold Out</span>
              ) : (
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block mt-1">In Stock: {vehicle.quantity}</span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PURCHASE DETAILS FORM */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-black text-white pb-3 border-b border-white/5 uppercase tracking-wider">Purchase Details</h2>

          <form onSubmit={handlePurchase} className="space-y-6">
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Quantity</span>
              <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-white/5">
                <button
                  type="button"
                  onClick={decrementQty}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors border-r border-white/10"
                >
                  <Minus className="w-3.5 h-3.5 text-white" />
                </button>
                <span className="px-5 text-sm font-bold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={incrementQty}
                  disabled={quantity >= vehicle.quantity || isOutOfStock}
                  className="p-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors border-l border-white/10"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Total Price Block */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Total Price</span>
              <span className="text-xl font-extrabold text-white">{formatPrice(totalPrice)}</span>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3 text-left">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Payment Method</label>
              
              <div className="space-y-2">
                <label className="flex items-center px-4 py-3 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-white">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-white/10 bg-white/5 cursor-pointer"
                  />
                  <span className="ml-3 text-xs font-bold text-white/90">Credit / Debit Card</span>
                </label>

                <label className="flex items-center px-4 py-3 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-white">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-white/10 bg-white/5 cursor-pointer"
                  />
                  <span className="ml-3 text-xs font-bold text-white/90">UPI</span>
                </label>

                <label className="flex items-center px-4 py-3 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-white">
                  <input
                    type="radio"
                    name="payment"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-white/10 bg-white/5 cursor-pointer"
                  />
                  <span className="ml-3 text-xs font-bold text-white/90">Net Banking</span>
                </label>
              </div>
            </div>

            {/* Confirm button */}
            <button
              type="submit"
              disabled={isOutOfStock || purchaseMutation.isPending}
              className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-neutral-800 disabled:text-white/20 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-lg shadow-brand-600/20 transition-all duration-200 active:scale-95 pt-4"
            >
              {purchaseMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Confirm Purchase</span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>

    </div>
  );
};

export default PurchaseVehicle;

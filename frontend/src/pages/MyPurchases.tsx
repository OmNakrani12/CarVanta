import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import type { ApiResponse } from '../types';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ShoppingBag } from 'lucide-react';

interface PurchaseRecord {
  id: string;
  userId: string;
  vehicleId: string;
  quantity: number;
  purchaseDate: string;
  vehicle?: {
    make: string;
    model: string;
    price: number;
  };
  model?: string;
}

export const MyPurchases: React.FC = () => {
  // Query to fetch purchases for logged-in user
  const { data, isLoading, isError, refetch } = useQuery<ApiResponse<{ purchases: PurchaseRecord[] }>>({
    queryKey: ['purchases'],
    queryFn: async () => {
      const response = await axiosClient.get('/vehicles/purchases');
      return response.data;
    },
  });

  const purchases = data?.data?.purchases || [];

  // Format currency (Rupees)
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 text-left min-h-[70vh]">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-brand-400" />
            <span>My Purchases</span>
          </h1>
          <p className="text-neutral-450 text-xs mt-1">View your purchase history</p>
        </div>
      </div>

      {/* Purchases list table */}
      {isLoading ? (
        <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/10 shadow-sm space-y-4">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="h-10 bg-white/5 rounded animate-pulse w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white/[0.02] rounded-2xl p-12 text-center border border-white/10 shadow-sm">
          <p className="text-red-400 font-semibold text-sm">Failed to retrieve purchase records.</p>
          <button onClick={() => refetch()} className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 mt-4 rounded-xl text-xs font-bold text-white transition-all">Try Again</button>
        </div>
      ) : purchases.length === 0 ? (
        <div className="bg-white/[0.02] rounded-2xl p-16 text-center border border-white/10 shadow-sm animate-fade-in">
          <p className="text-neutral-450 text-xs font-bold uppercase tracking-wider">No purchase transactions found.</p>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-sm animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4 text-center">Quantity</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4">Purchase Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-semibold text-neutral-350">
                {purchases.map((purchase) => {
                  const vehicleName = purchase.vehicle 
                    ? `${purchase.vehicle.make} ${purchase.model || purchase.vehicle.model}`
                    : 'Unknown Vehicle';
                  const unitPrice = purchase.vehicle?.price || 0;
                  const totalCost = unitPrice * purchase.quantity;
                  const orderNum = `#ORD${purchase.id.split('-')[0].toUpperCase()}`;

                  return (
                    <tr key={purchase.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-brand-400 font-bold">{orderNum}</td>
                      <td className="px-6 py-4 text-white font-bold">{vehicleName}</td>
                      <td className="px-6 py-4 text-center font-bold text-neutral-400">{purchase.quantity}</td>
                      <td className="px-6 py-4 text-right font-extrabold text-white">{formatPrice(totalCost)}</td>
                      <td className="px-6 py-4 text-neutral-400">{new Date(purchase.purchaseDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          Completed
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyPurchases;

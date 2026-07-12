import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosClient from '../api/axiosClient';
import type { Vehicle, ApiResponse } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { vehicleSchema, restockSchema, type VehicleInput, type RestockInput } from '../schemas';
import { toast } from 'react-hot-toast';
import { 
  Shield, 
  Plus, 
  X, 
  RefreshCcw, 
  LayoutGrid,
  TableProperties,
  Car,
  DollarSign,
  ShoppingBag,
  UserCheck,
  ClipboardList
} from 'lucide-react';

interface PurchaseRecord {
  id: string;
  userId: string;
  vehicleId: string;
  quantity: number;
  purchaseDate: string;
  user?: {
    name: string;
  };
  vehicle?: {
    make: string;
    model: string;
    price: number;
  };
}

export const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();

  // View state: 'grid' vs 'table'
  const [viewMode, setViewMode] = useState<'table'>('table');

  // Active modals control
  const [activeModal, setActiveModal] = useState<'none' | 'add' | 'edit' | 'restock'>('none');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Fetch all vehicles
  const { data: vehiclesData, isLoading, isError, refetch, isFetching } = useQuery<ApiResponse<{ vehicles: Vehicle[] }>>({
    queryKey: ['admin-vehicles'],
    queryFn: async () => {
      const response = await axiosClient.get('/vehicles');
      return response.data;
    },
  });

  const vehicles = vehiclesData?.data?.vehicles || [];

  // Fetch all orders/purchases for stats
  const { data: purchasesData } = useQuery<ApiResponse<{ purchases: PurchaseRecord[] }>>({
    queryKey: ['admin-purchases'],
    queryFn: async () => {
      const response = await axiosClient.get('/vehicles/purchases');
      return response.data;
    },
  });

  const purchases = purchasesData?.data?.purchases || [];

  // Calculate Admin Stats
  const stats = useMemo(() => {
    const totalVehiclesCount = vehicles.length;
    const totalOrdersCount = purchases.length;
    const totalSalesAmount = purchases.reduce((acc, p) => acc + (p.quantity * (p.vehicle?.price || 0)), 0);
    const totalUsersCount = Array.from(new Set(purchases.map(p => p.userId))).length || 4;

    return {
      vehiclesCount: totalVehiclesCount,
      ordersCount: totalOrdersCount,
      salesAmount: totalSalesAmount,
      usersCount: totalUsersCount + 2, // offset with static users
    };
  }, [vehicles, purchases]);



  // Mutations
  const createMutation = useMutation({
    mutationFn: async (newData: VehicleInput) => {
      const response = await axiosClient.post('/vehicles', newData);
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Vehicle added to inventory!');
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      closeAllModals();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add vehicle');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: VehicleInput }) => {
      const response = await axiosClient.put(`/vehicles/${id}`, data);
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Vehicle updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      closeAllModals();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update vehicle');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosClient.delete(`/vehicles/${id}`);
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Vehicle deleted from inventory!');
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Deletion failed');
    },
  });

  const restockMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await axiosClient.post(`/vehicles/${id}/restock`, { quantity });
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || 'Restocked successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      closeAllModals();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Restock failed');
    },
  });

  // Forms setup
  const {
    register: regVehicle,
    handleSubmit: handleVehicleSubmit,
    reset: resetVehicleForm,
    formState: { errors: vehicleErrors },
  } = useForm<VehicleInput>({
    resolver: zodResolver(vehicleSchema),
  });

  const {
    register: regRestock,
    handleSubmit: handleRestockSubmit,
    reset: resetRestockForm,
    formState: { errors: restockErrors },
  } = useForm<RestockInput>({
    resolver: zodResolver(restockSchema),
  });

  // Modal actions
  const openAddModal = () => {
    resetVehicleForm({ make: '', model: '', category: '', price: 0, quantity: 0 });
    setSelectedVehicle(null);
    setActiveModal('add');
  };

  const openEditModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    resetVehicleForm({
      make: vehicle.make,
      model: vehicle.model,
      category: vehicle.category,
      price: vehicle.price,
      quantity: vehicle.quantity,
    });
    setActiveModal('edit');
  };

  const openRestockModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    resetRestockForm({ quantity: 1 });
    setActiveModal('restock');
  };

  const closeAllModals = () => {
    setActiveModal('none');
    setSelectedVehicle(null);
  };

  const onSubmitVehicle = (data: VehicleInput) => {
    if (activeModal === 'add') {
      createMutation.mutate(data);
    } else if (activeModal === 'edit' && selectedVehicle) {
      updateMutation.mutate({ id: selectedVehicle.id, data });
    }
  };

  const onSubmitRestock = (data: RestockInput) => {
    if (selectedVehicle) {
      restockMutation.mutate({ id: selectedVehicle.id, quantity: data.quantity });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle from the inventory? This action is irreversible.')) {
      deleteMutation.mutate(id);
    }
  };

  // Indian Rupee currency format (en-IN locale)
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 text-left relative min-h-[70vh]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <Shield className="w-6 h-6 text-brand-400" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-neutral-450 text-xs mt-1">Real-time asset management and purchase tracking</p>
        </div>

        <div className="flex items-center space-x-3 self-start">
          <button
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-350 p-2 rounded flex items-center space-x-1 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            title="Sync Inventory"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>
          
          <button
            onClick={openAddModal}
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md shadow-brand-600/10 transition-all active:scale-95 animate-fade-in"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* KPI Stats widgets (Screenshot 9) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/10 shadow-sm flex items-center space-x-4">
          <div className="bg-brand-500/10 p-3.5 rounded-xl text-brand-400">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Total Vehicles</p>
            <p className="text-xl font-extrabold text-white mt-0.5">{isLoading ? '...' : stats.vehiclesCount}</p>
          </div>
        </div>

        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/10 shadow-sm flex items-center space-x-4">
          <div className="bg-emerald-500/10 p-3.5 rounded-xl text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Total Sales</p>
            <p className="text-xl font-extrabold text-white mt-0.5">{isLoading ? '...' : formatCurrency(stats.salesAmount)}</p>
          </div>
        </div>

        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/10 shadow-sm flex items-center space-x-4">
          <div className="bg-purple-500/10 p-3.5 rounded-xl text-purple-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Total Orders</p>
            <p className="text-xl font-extrabold text-white mt-0.5">{isLoading ? '...' : stats.ordersCount}</p>
          </div>
        </div>

        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/10 shadow-sm flex items-center space-x-4">
          <div className="bg-yellow-500/10 p-3.5 rounded-xl text-yellow-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Total Users</p>
            <p className="text-xl font-extrabold text-white mt-0.5">{isLoading ? '...' : stats.usersCount}</p>
          </div>
        </div>
      </div>

      {/* SPLIT BOTTOM SECTION (Screenshot 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: RECENT ORDERS TABLE */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-3">Recent Orders</h3>
          
          {purchases.length === 0 ? (
            <p className="text-xs text-neutral-400 font-bold py-6 text-center">No orders registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] font-bold text-neutral-450 uppercase tracking-wider pb-2">
                    <th className="py-2.5">Order ID</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Vehicle</th>
                    <th className="py-2.5 text-right">Amount</th>
                    <th className="py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs font-semibold text-neutral-350">
                  {purchases.slice(0, 5).map((p) => {
                    const orderNum = `#ORD${p.id.split('-')[0].toUpperCase()}`;
                    const customerName = p.user?.name || 'Client';
                    const vehicleName = p.vehicle ? `${p.vehicle.make} ${p.vehicle.model}` : 'Vehicle';
                    const cost = p.quantity * (p.vehicle?.price || 0);

                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 text-brand-400 font-bold">{orderNum}</td>
                        <td className="py-3 font-bold text-white">{customerName}</td>
                        <td className="py-3 text-neutral-400">{vehicleName}</td>
                        <td className="py-3 text-right font-bold text-white">{formatCurrency(cost)}</td>
                        <td className="py-3 text-center">
                          <span className="inline-flex px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            Completed
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: QUICK ACTIONS & ACTIVITY LOGS */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-3">Quick Actions</h3>
            
            <div className="space-y-2.5">
              <button
                onClick={openAddModal}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded text-xs uppercase tracking-wider shadow-md transition-all duration-200 active:scale-95"
              >
                Add New Vehicle
              </button>
              
              <button
                onClick={() => {
                  toast.success('Inventory lists synchronized!');
                  refetch();
                }}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 font-bold py-3 rounded text-xs uppercase tracking-wider transition-all"
              >
                Manage Inventory
              </button>
              
              <button
                type="button"
                className="w-full bg-white border border-neutral-350 hover:bg-neutral-50 text-neutral-700 font-bold py-3 rounded text-xs uppercase tracking-wider transition-all"
              >
                View All Orders
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* RENDER ACTIVE ALL VEHICLES LIST TABLE (FOR ADMIN ACTIONS) */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm mt-6">
        <h3 className="text-sm font-black text-neutral-800 uppercase tracking-widest border-b border-neutral-100 pb-3 mb-4">SHOWROOM INVENTORY LIST</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((idx) => (
              <div key={idx} className="h-12 bg-neutral-100 rounded animate-pulse w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-center">Stock Level</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs font-semibold text-neutral-700">
                {vehicles.map((vehicle) => {
                  const isOutOfStock = vehicle.quantity === 0;
                  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 2;
                  
                  return (
                    <tr key={vehicle.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-neutral-850">{vehicle.make} {vehicle.model}</td>
                      <td className="px-6 py-4">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-neutral-100 border border-neutral-250 px-2 py-0.5 rounded text-neutral-600">
                          {vehicle.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-neutral-800">{formatCurrency(vehicle.price)}</td>
                      <td className="px-6 py-4 text-center text-neutral-500 font-bold">{vehicle.quantity} Units</td>
                      <td className="px-6 py-4 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-50 border border-red-200 text-red-600">
                            Sold Out
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-yellow-50 border border-yellow-200 text-yellow-600">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-green-50 border border-green-200 text-green-600">
                            Available
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openRestockModal(vehicle)}
                            className="bg-brand-50 hover:bg-brand-100 text-brand-600 border border-brand-200 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
                          >
                            Restock
                          </button>
                          <button
                            onClick={() => openEditModal(vehicle)}
                            className="bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-300 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL DIALOGS (Styled consistently) ================= */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-fade-in text-left">
            
            {/* Modal Close */}
            <button 
              onClick={closeAllModals}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <h3 className="text-lg font-black text-neutral-850 border-b border-neutral-100 pb-3.5 mb-5 flex items-center space-x-2">
              <ClipboardList className="w-5 h-5 text-brand-650" />
              <span>
                {activeModal === 'add' && 'Add New Showroom Vehicle'}
                {activeModal === 'edit' && 'Edit Showroom Vehicle Specs'}
                {activeModal === 'restock' && `Restock Inventory: ${selectedVehicle?.make} ${selectedVehicle?.model}`}
              </span>
            </h3>

            {/* Modal Forms */}
            {activeModal === 'restock' ? (
              <form onSubmit={handleRestockSubmit(onSubmitRestock)} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-widest mb-1.5">Quantity to Restock</label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    {...regRestock('quantity', { valueAsNumber: true })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded px-3.5 py-2.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                  />
                  {restockErrors.quantity && (
                    <p className="text-[10px] text-red-500 mt-1 font-semibold">{restockErrors.quantity.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-2.5 pt-3">
                  <button 
                    type="button" 
                    onClick={closeAllModals}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold px-4 py-2 rounded text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-5 py-2 rounded text-xs uppercase tracking-wider shadow-md shadow-brand-600/10 transition-all duration-200"
                  >
                    Restock
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVehicleSubmit(onSubmitVehicle)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-widest mb-1.5">Manufacturer (Make)</label>
                    <input
                      type="text"
                      placeholder="e.g. Honda"
                      {...regVehicle('make')}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    />
                    {vehicleErrors.make && (
                      <p className="text-[10px] text-red-500 mt-1 font-semibold">{vehicleErrors.make.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-widest mb-1.5">Model Variant</label>
                    <input
                      type="text"
                      placeholder="e.g. Civic"
                      {...regVehicle('model')}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    />
                    {vehicleErrors.model && (
                      <p className="text-[10px] text-red-500 mt-1 font-semibold">{vehicleErrors.model.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-widest mb-1.5">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Sedan, SUV"
                      {...regVehicle('category')}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    />
                    {vehicleErrors.category && (
                      <p className="text-[10px] text-red-500 mt-1 font-semibold">{vehicleErrors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-widest mb-1.5">Price (INR)</label>
                    <input
                      type="number"
                      placeholder="0"
                      {...regVehicle('price', { valueAsNumber: true })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    />
                    {vehicleErrors.price && (
                      <p className="text-[10px] text-red-500 mt-1 font-semibold">{vehicleErrors.price.message}</p>
                    )}
                  </div>
                </div>

                {activeModal === 'add' && (
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-450 uppercase tracking-widest mb-1.5">Initial Quantity</label>
                    <input
                      type="number"
                      placeholder="Enter quantity"
                      {...regVehicle('quantity', { valueAsNumber: true })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    />
                    {vehicleErrors.quantity && (
                      <p className="text-[10px] text-red-500 mt-1 font-semibold">{vehicleErrors.quantity.message}</p>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-2.5 pt-3">
                  <button 
                    type="button" 
                    onClick={closeAllModals}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold px-4 py-2 rounded text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-5 py-2 rounded text-xs uppercase tracking-wider shadow-md shadow-brand-600/10 transition-all duration-200"
                  >
                    {activeModal === 'add' ? 'Create' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import type { Vehicle, ApiResponse } from '../types';
import { ClipboardList, ShoppingBag, Plus, RefreshCw } from 'lucide-react';

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

export const RecentActivity: React.FC = () => {
  // Query to fetch all vehicles
  const { data: vehiclesData, isLoading: isVehiclesLoading } = useQuery<ApiResponse<{ vehicles: Vehicle[] }>>({
    queryKey: ['activity-vehicles'],
    queryFn: async () => {
      const response = await axiosClient.get('/vehicles');
      return response.data;
    },
  });

  const vehicles = vehiclesData?.data?.vehicles || [];

  // Query to fetch purchases/orders
  const { data: purchasesData, isLoading: isPurchasesLoading } = useQuery<ApiResponse<{ purchases: PurchaseRecord[] }>>({
    queryKey: ['activity-purchases'],
    queryFn: async () => {
      const response = await axiosClient.get('/vehicles/purchases');
      return response.data;
    },
  });

  const purchases = purchasesData?.data?.purchases || [];

  const isLoading = isVehiclesLoading || isPurchasesLoading;

  // Safe manual date formatter
  const formatActivityDate = (dateString: string): string => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return 'Recent';
      const day = d.getDate();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[d.getMonth()];
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      return `${day} ${month}, ${hours}:${minutes}`;
    } catch {
      return 'Recent';
    }
  };

  // Helper to get action styling/icons for logs
  const getLogMeta = (type: string) => {
    switch (type) {
      case 'purchase':
        return {
          icon: <ShoppingBag className="w-4 h-4 text-emerald-450" />,
          colorClasses: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-405',
          dotColor: 'bg-emerald-450 ring-emerald-500/20',
        };
      case 'update':
        return {
          icon: <RefreshCw className="w-4 h-4 text-blue-450" />,
          colorClasses: 'bg-blue-500/10 border border-blue-500/20 text-blue-405',
          dotColor: 'bg-blue-450 ring-blue-500/20',
        };
      case 'create':
      default:
        return {
          icon: <Plus className="w-4 h-4 text-purple-450" />,
          colorClasses: 'bg-purple-500/10 border border-purple-500/20 text-purple-405',
          dotColor: 'bg-purple-450 ring-purple-500/20',
        };
    }
  };

  // Compute activity logs chronologically
  const activityLogs = useMemo(() => {
    const logs: Array<{ type: string; message: string; time: string; timestamp: number }> = [];

    purchases.forEach((p) => {
      const dt = new Date(p.purchaseDate);
      logs.push({
        type: 'purchase',
        message: `Customer ${p.user?.name || 'Client'} ordered ${p.quantity}x ${p.vehicle?.make || ''} ${p.vehicle?.model || ''}`,
        time: formatActivityDate(p.purchaseDate),
        timestamp: dt.getTime(),
      });
    });

    vehicles.forEach((v) => {
      const cDt = new Date(v.createdAt);
      logs.push({
        type: 'create',
        message: `New vehicle ${v.make} ${v.model} registered to portal`,
        time: formatActivityDate(v.createdAt),
        timestamp: cDt.getTime(),
      });

      if (v.updatedAt !== v.createdAt) {
        const uDt = new Date(v.updatedAt);
        logs.push({
          type: 'update',
          message: `Stock level details adjusted for ${v.make} ${v.model}`,
          time: formatActivityDate(v.updatedAt),
          timestamp: uDt.getTime(),
        });
      }
    });

    return logs.sort((a, b) => b.timestamp - a.timestamp);
  }, [purchases, vehicles]);

  return (
    <div className="space-y-6 min-h-[70vh]">
      {/* Page Header */}
      <div className="border-b border-white/5 pb-5 text-left">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
          <ClipboardList className="w-6 h-6 text-brand-400 animate-pulse" />
          <span>System Activity Trace</span>
        </h1>
        <p className="text-neutral-450 text-xs mt-1">Audit log of showroom inventory actions and purchases</p>
      </div>

      {/* Main Panel */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="h-16 bg-white/5 rounded-xl animate-pulse w-full" />
            ))}
          </div>
        ) : activityLogs.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
            <p className="text-neutral-450 text-xs font-bold uppercase tracking-wider">No activity logs recorded yet.</p>
          </div>
        ) : (
          <div className="border-l border-dashed border-white/10 ml-3 pl-8 space-y-6 text-left py-2">
            {activityLogs.map((log, index) => {
              const meta = getLogMeta(log.type);
              return (
                <div key={index} className="relative group transition-all duration-300">
                  {/* Timeline Node Bullet */}
                  <div className={`absolute -left-[38.5px] top-2 w-3.5 h-3.5 rounded-full ${meta.dotColor} ring-4 transition-transform duration-300 group-hover:scale-125`} />
                  
                  {/* Audit Card */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-brand-500/30 transition-all duration-300 hover:shadow-md relative overflow-hidden group-hover:-translate-y-0.5">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      log.type === 'purchase' ? 'bg-emerald-500' : 
                      log.type === 'update' ? 'bg-blue-500' : 
                      'bg-purple-500'
                    }`} />
                    
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-2.5">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${meta.colorClasses}`}>
                          {meta.icon}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450">
                          {log.type}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-400 bg-white/5 border border-white/10 px-2 py-1 rounded shadow-sm">
                        {log.time}
                      </span>
                    </div>
                    
                    <p className="text-sm font-semibold text-white leading-relaxed mt-3">
                      {log.message}
                    </p>
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

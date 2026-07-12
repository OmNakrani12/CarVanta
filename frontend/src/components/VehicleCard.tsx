import React from 'react';
import type { Vehicle } from '../types';
import { PlusCircle, Edit, Trash2, AlertCircle } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase?: (id: string) => void;
  purchaseLoading?: boolean; // maintained for compatibility
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (id: string) => void;
  onRestock?: (vehicle: Vehicle) => void;
  isAdminView?: boolean;
}

// Brand Logo URL dictionary mapping
export const getBrandLogoUrl = (make: string): string => {
  const norm = make.toLowerCase().trim();
  let filename = '';
  
  if (norm.includes('toyota')) filename = 'toyota';
  else if (norm.includes('honda')) filename = 'honda';
  else if (norm.includes('audi')) filename = 'audi';
  else if (norm.includes('bmw')) filename = 'bmw';
  else if (norm.includes('mercedes')) filename = 'mercedes-benz';
  else if (norm.includes('tesla')) filename = 'tesla';
  else if (norm.includes('hyundai')) filename = 'hyundai';
  else if (norm.includes('ford')) filename = 'ford';
  else if (norm.includes('suzuki') || norm.includes('maruti')) filename = 'suzuki';
  else if (norm.includes('tata')) filename = 'tata';
  else if (norm.includes('mahindra')) filename = 'mahindra';
  else if (norm.includes('kia')) filename = 'kia';
  else if (norm.includes('jeep')) filename = 'jeep';
  else if (norm.includes('chevrolet')) filename = 'chevrolet';
  else if (norm.includes('nissan')) filename = 'nissan';
  else if (norm.includes('volkswagen') || norm.includes('vw')) filename = 'volkswagen';
  
  if (filename) {
    // Return transparent background high-resolution logo png
    return `https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/${filename}.png`;
  }
  return '';
};

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
  isAdminView = false,
}) => {
  const isOutOfStock = vehicle.quantity === 0;

  // Indian Rupee currency format (en-IN locale)
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const handleClick = () => {
    if (!isAdminView && onPurchase && !isOutOfStock) {
      onPurchase(vehicle.id);
    }
  };

  const logoUrl = getBrandLogoUrl(vehicle.make);

  return (
    <div 
      onClick={handleClick}
      className={`bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)] hover:border-brand-500/40 transition-all duration-300 flex flex-col h-full group ${
        !isAdminView ? 'cursor-pointer hover:-translate-y-1' : ''
      }`}
    >
      {/* Visual Image Block (Solid Black with centered brand logo) */}
      <div className="h-52 w-full bg-black relative flex items-center justify-center overflow-hidden border-b border-white/5">
        
        {/* Scaled brand logo centered on solid black background */}
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={vehicle.make} 
            className="h-28 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)] transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span className="text-xl font-black text-white/50 tracking-wider">
            {vehicle.make.substring(0, 2).toUpperCase()}
          </span>
        )}

        {/* Translucent Capsule Category Badge */}
        <span className="absolute top-3.5 left-3.5 bg-black/50 border border-neutral-700/80 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm backdrop-blur-[2px]">
          {vehicle.category}
        </span>
      </div>

      {/* Info Body */}
      <div className="p-5 flex flex-col flex-grow justify-between text-left">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-bold">{vehicle.make}</p>
          <h3 className="text-xl font-extrabold text-white tracking-tight transition-colors">
            {vehicle.model}
          </h3>
        </div>

        <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
          <div>
            <p className="text-xl font-extrabold text-brand-400 tracking-tight">{formattedPrice}</p>
          </div>
          <div>
            {isOutOfStock ? (
              <span className="text-[9px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Sold Out</span>
              </span>
            ) : (
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                In Stock: {vehicle.quantity}
              </span>
            )}
          </div>
        </div>

        {/* Admin actions (only visible in admin dashboard grid) */}
        {isAdminView && (
          <div className="w-full mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onRestock && onRestock(vehicle); }}
              className="flex flex-col items-center justify-center p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-brand-400 transition-all duration-200 active:scale-95"
              title="Restock vehicle"
            >
              <PlusCircle className="w-4 h-4 mb-1" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Restock</span>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onEdit && onEdit(vehicle); }}
              className="flex flex-col items-center justify-center p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-yellow-500 transition-all duration-200 active:scale-95"
              title="Edit vehicle"
            >
              <Edit className="w-4 h-4 mb-1" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Edit</span>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onDelete && onDelete(vehicle.id); }}
              className="flex flex-col items-center justify-center p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded transition-all duration-200 active:scale-95"
              title="Delete vehicle"
            >
              <Trash2 className="w-4 h-4 mb-1" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Delete</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

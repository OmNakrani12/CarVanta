import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowRight } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background radial overlays */}
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative space-y-6 max-w-md animate-fade-in">
        {/* Animated Icon */}
        <div className="mx-auto bg-dark-900 border border-dark-800 p-6 rounded-3xl w-fit shadow-xl shadow-brand-500/5 hover:-rotate-6 transition-transform duration-300">
          <Car className="w-16 h-16 text-brand-500" />
        </div>

        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-dark-300 to-brand-500 tracking-tighter">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Route Not Found</h2>
          <p className="text-dark-400 text-sm max-w-xs mx-auto">
            The page you are looking for does not exist or has been relocated to another route.
          </p>
        </div>

        <div className="pt-4">
          <Link
            to="/"
            className="glass-btn-primary inline-flex items-center space-x-2 shadow-lg"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

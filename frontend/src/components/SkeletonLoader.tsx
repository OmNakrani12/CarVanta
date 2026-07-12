import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-xl animate-pulse flex flex-col h-full border border-dark-800/80">
      <div className="h-48 w-full bg-dark-800" />
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="h-3 w-1/4 bg-dark-800 rounded mb-2" />
          <div className="h-6 w-3/4 bg-dark-800 rounded mb-4" />
        </div>
        <div>
          <div className="h-3 w-1/5 bg-dark-800 rounded mb-1" />
          <div className="h-8 w-1/3 bg-dark-800 rounded mb-6" />
          <div className="h-10 w-full bg-dark-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

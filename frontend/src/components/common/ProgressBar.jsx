import React from 'react';

export default function ProgressBar({ progress = 65, variant = 'energy', className = '' }) {
  if (variant === 'thin') {
    return (
      <div className={`w-64 h-[1px] bg-outline-variant/30 mx-auto mt-6 relative overflow-hidden ${className}`}>
        <div 
          className="absolute inset-y-0 left-0 bg-secondary transition-transform duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }

  // default energy variant
  return (
    <div className={`w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden relative ${className}`}>
      <div 
        className="h-full energy-bar relative rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-secondary/50 rounded-full blur-lg"></div>
      </div>
    </div>
  );
}

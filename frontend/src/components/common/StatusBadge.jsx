import React from 'react';

export default function StatusBadge({ children, variant = 'gold', className = '' }) {
  const getStyles = () => {
    switch (variant) {
      case 'gold':
        return 'bg-secondary/10 border-secondary/30 text-secondary';
      case 'gold-solid':
        return 'bg-secondary text-on-secondary font-bold';
      case 'green':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
      case 'green-pulse':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 flex items-center gap-1.5';
      case 'red':
        return 'bg-red-500/10 border-red-500/30 text-red-500';
      case 'warning':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      case 'muted':
        return 'bg-background/80 border-outline-variant/50 text-on-surface-variant';
      default:
        return 'bg-white/5 border-white/10 text-on-surface-variant';
    }
  };

  return (
    <div className={`px-3 py-1 rounded border font-mono text-mono-sm uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center w-fit ${getStyles()} ${className}`}>
      {variant === 'green-pulse' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
      )}
      {children}
    </div>
  );
}

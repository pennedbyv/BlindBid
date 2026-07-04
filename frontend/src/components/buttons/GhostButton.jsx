import React from 'react';
import { motion } from 'framer-motion';

export default function GhostButton({ children, onClick, variant = 'gold', className = '', disabled = false, type = 'button' }) {
  const borderStyles = () => {
    switch (variant) {
      case 'white':
        return 'border-white/30 text-on-surface hover:bg-white/5 hover:border-white/50';
      case 'muted':
        return 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-highest/20 hover:border-outline-variant/50';
      case 'gold':
      default:
        return 'border-secondary text-secondary hover:bg-secondary/5';
    }
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={`px-10 py-5 border font-label text-label-md rounded-full flex items-center justify-center gap-2 transition-all uppercase tracking-widest font-medium disabled:opacity-40 disabled:pointer-events-none ${borderStyles()} ${className}`}
    >
      {children}
    </motion.button>
  );
}

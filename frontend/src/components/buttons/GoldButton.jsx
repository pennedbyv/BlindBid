import React from 'react';
import { motion } from 'framer-motion';

export default function GoldButton({ children, onClick, className = '', disabled = false, type = 'button' }) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={`px-10 py-5 bg-secondary text-on-secondary font-label text-label-md rounded-full flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-colors hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none ${className}`}
    >
      {children}
    </motion.button>
  );
}

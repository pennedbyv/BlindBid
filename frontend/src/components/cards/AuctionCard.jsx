import React from 'react';
import { motion } from 'framer-motion';

export default function AuctionCard({ auction }) {
  const { name, description, status, statusText, minPrice, type } = auction;
  const isPending = type === 'pending';

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-[#17171F] border border-[#2B2A34] rounded-2xl p-5 flex flex-col justify-between w-full"
    >
      {/* Visual Placeholder container */}
      <div className="relative aspect-[4/3] w-full bg-[#0D0E12] rounded-xl flex items-center justify-center border border-white/5 overflow-hidden">
        {/* Badge in top-left */}
        <div className="absolute top-4 left-4 z-10">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono tracking-wider font-semibold ${
            isPending 
              ? 'border-secondary/40 text-secondary bg-secondary/5' 
              : 'border-outline-variant/30 text-on-surface-variant bg-white/5'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isPending ? 'bg-secondary animate-pulse' : 'bg-on-surface-variant/40'}`}></span>
            {status}
          </div>
        </div>

        {/* Locked Vector Icon in Center */}
        <div className="w-16 h-16 rounded-xl border border-secondary/20 bg-secondary/[0.02] flex items-center justify-center">
          <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>
            lock
          </span>
        </div>
      </div>

      {/* Meta Content */}
      <div className="mt-5 space-y-4">
        <div>
          <h3 className="font-headline text-lg font-bold text-white tracking-tight">
            {name}
          </h3>
          <p className="font-body text-xs text-on-surface-variant mt-1">
            {description}
          </p>
        </div>

        {/* Separator line */}
        <div className="border-t border-[#2B2A34] pt-4 space-y-2">
          {/* Status Row */}
          <div className="flex justify-between items-center text-xs">
            <span className="font-body text-on-surface-variant font-medium">Status</span>
            <span className={`font-mono font-bold ${isPending ? 'text-secondary' : 'text-on-surface-variant/60'}`}>
              {statusText}
            </span>
          </div>

          {/* Min Price Row */}
          <div className="flex justify-between items-center text-xs">
            <span className="font-body text-on-surface-variant font-medium">Min Price</span>
            <span className="font-mono text-secondary font-bold">
              {minPrice}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import React from 'react';
import GlassCard from '../common/GlassCard';

export default function VaultValuation({ minVal = '0.45', maxVal = '1.20', currency = 'QIE' }) {
  return (
    <GlassCard className="p-6 h-full flex flex-col justify-between">
      <div>
        {/* Header Title */}
        <div className="flex items-center gap-2 text-on-surface-variant mb-6">
          <span className="material-symbols-outlined text-secondary text-sm">
            security
          </span>
          <h2 className="uppercase tracking-widest text-[10px] sm:text-xs font-bold font-mono">
            Vault Valuation
          </h2>
        </div>

        {/* Estimation card */}
        <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="text-[10px] uppercase font-bold text-secondary border border-secondary/30 px-2 py-1 rounded font-mono">
              Medium
            </span>
          </div>
          <div className="flex items-center gap-2 text-secondary mb-2">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span className="text-xs uppercase font-bold tracking-wider font-mono">Estimated Value</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-secondary mb-1">
            {minVal} - {maxVal} {currency}
          </div>
          <p className="text-xs text-on-surface-variant font-mono">
            Confidence: <span className="text-white">Low</span>
          </p>
        </div>

        {/* Rarity Breakdown lists */}
        <div>
          <h3 className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-4 font-mono">
            Rarity Breakdown
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Category 1: Common */}
            <div className="bg-white/[0.03] border border-white/[0.08] border-l-4 border-l-outline rounded-xl p-5">
              <div className="w-10 h-10 bg-surface-bright/35 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-on-surface-variant text-sm">
                  star
                </span>
              </div>
              <p className="text-md font-bold">Common</p>
              <p className="text-xs text-on-surface-variant">
                <span className="text-white font-bold">3</span> NFTs
              </p>
            </div>

            {/* Category 2: Analyzing */}
            <div className="bg-white/[0.01] border border-white/[0.05] border-l-4 border-l-secondary/40 opacity-55 rounded-xl p-5 flex items-center justify-center">
              <span className="text-on-surface-variant text-xs uppercase font-bold italic font-mono">
                Analyzing...
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning block */}
      <div className="mt-8 p-4 bg-orange-950/20 border border-orange-500/20 rounded-lg flex items-start gap-3">
        <span className="material-symbols-outlined text-orange-500 mt-0.5">
          warning
        </span>
        <p className="text-xs text-orange-200/80 leading-snug">
          Fresh mint detected — valuation may be uncertain due to limited market history.
        </p>
      </div>
    </GlassCard>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BundleStaging({ stagedNFTs = [], onRemoveNFT, showEncryptionWarning = false }) {
  
  // Calculate stats dynamically
  const calculateTotalValue = () => {
    let total = 0;
    stagedNFTs.forEach(nft => {
      const val = parseFloat(nft.price);
      if (!isNaN(val)) total += val;
    });
    return total.toFixed(1);
  };

  const getRarityScore = () => {
    if (stagedNFTs.length === 0) return '0.0';
    return stagedNFTs.some(n => n.rarity === 'Rare') ? '98.4' : '84.2';
  };

  return (
    <section className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full">
      <div className="bg-charcoal-card rounded-2xl border border-white/5 flex-grow p-8 flex flex-col relative overflow-hidden">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="mb-8">
              <h2 className="font-headline text-headline-md font-bold text-white mb-2">Bundle Staging</h2>
              <p className="font-body text-on-surface-variant text-sm">
                Drag assets here or tap them to construct your high-value auction bundle.
              </p>
              {showEncryptionWarning && (
                <div className="mt-2 flex items-center gap-1.5 text-emerald-500/60 font-mono text-[10px] uppercase tracking-tighter">
                  <span className="material-symbols-outlined text-xs">lock</span>
                  <span>Encrypted Vault Protocol Active</span>
                </div>
              )}
            </div>

            {/* Selected slots layout */}
            <div className="grid grid-cols-2 gap-4 content-start">
              {/* Staged Slots */}
              <AnimatePresence>
                {stagedNFTs.map((nft) => (
                  <motion.div
                    key={nft.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="aspect-[4/5] rounded-2xl bg-surface p-2 border border-white/10 group relative overflow-hidden"
                  >
                    <img 
                      className="w-full h-full object-cover rounded-xl opacity-60" 
                      alt={nft.name}
                      src={nft.image}
                    />
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <p className="font-label text-xs text-white font-medium truncate">{nft.name}</p>
                      <p className="font-mono text-[10px] text-secondary">{nft.price}</p>
                    </div>
                    <button 
                      onClick={() => onRemoveNFT && onRemoveNFT(nft)}
                      className="absolute top-3 right-3 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Slot placeholder: Add Asset */}
              <div className="aspect-[4/5] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-on-surface-variant group hover:border-secondary/40 transition-colors cursor-pointer min-h-[180px]">
                <span className="material-symbols-outlined text-3xl group-hover:text-secondary transition-colors">
                  add_circle
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase">Add Asset</span>
              </div>
            </div>
          </div>

          {/* Metrics block */}
          <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1 block">Est. Bundle Value</label>
                <div className="font-headline text-headline-md font-bold text-white font-mono">
                  {calculateTotalValue()} <span className="text-secondary">MON</span>
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-1 block">Rarity Score</label>
                <div className="font-headline text-headline-md font-bold text-white font-mono">
                  {getRarityScore()}<span className="text-xs text-emerald-500 ml-1 font-bold">TOP 2%</span>
                </div>
              </div>
            </div>
            
            {/* Heatmap */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">Market Demand Heatmap</label>
                <span className="font-mono text-[10px] text-secondary uppercase font-semibold">High Intensity</span>
              </div>
              <div className="h-2 w-full rounded-full heatmap-gradient"></div>
              <div className="flex justify-between mt-1">
                <span className="font-mono text-[8px] text-on-surface-variant uppercase">Cool</span>
                <span className="font-mono text-[8px] text-on-surface-variant uppercase">Critical</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

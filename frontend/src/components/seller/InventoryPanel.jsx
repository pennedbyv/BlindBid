import React from 'react';
import NFTInventoryCard from '../cards/NFTInventoryCard';

export default function InventoryPanel({ nfts, onAddNFT, showOwnerBadge = false }) {
  return (
    <section className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full overflow-hidden">
      {/* Header Counter & Visibility badge */}
      <div className="flex justify-between items-center px-2 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h2 className="font-headline text-headline-md font-bold text-white leading-none">Inventory</h2>
          <span className="font-mono text-mono-sm px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs">
            {nfts.length} ITEMS
          </span>
        </div>
        
        {showOwnerBadge && (
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-gold-accent/10 border border-gold-accent/20 group relative cursor-help">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-accent animate-pulse"></span>
            <span className="font-mono text-[9px] text-gold-accent uppercase tracking-widest">
              Owner View: Full Access
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-surface-container-highest border border-white/10 rounded-lg text-[10px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 shadow-xl">
              Buyers only see encrypted vaults. Your privacy protocol is active.
            </div>
          </div>
        )}
      </div>

      {/* Scrollable list */}
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 mask-fade-bottom">
        <div className="grid grid-cols-1 gap-4 pb-16">
          {nfts.map((nft) => (
            <NFTInventoryCard 
              key={nft.id} 
              nft={nft} 
              onAdd={onAddNFT} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

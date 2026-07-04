import React, { useState } from 'react';

export default function NFTRevealCard({ onReveal }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (isFlipped) return;
    setIsFlipped(true);
    if (onReveal) {
      onReveal();
    }
  };

  return (
    <div className={`perspective-1000 w-full max-w-[400px] h-[560px] mx-auto ${isFlipped ? 'reveal-active' : ''}`}>
      <div 
        onClick={handleFlip}
        className="nft-card preserve-3d w-full h-full relative cursor-pointer"
      >
        {/* Front cover (Gold Mystery) */}
        <div className="backface-hidden absolute inset-0 bg-surface-container-high rounded-2xl border border-secondary/20 overflow-hidden flex flex-col items-center justify-center p-8">
          <div className="shimmer-gold absolute inset-0"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 mb-8 border-2 border-secondary/40 rotate-45 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-4xl -rotate-45" style={{ fontVariationSettings: "'FILL' 0" }}>
                lock
              </span>
            </div>
            <span className="font-mono text-mono-sm text-secondary tracking-widest mb-2">
              UNKNOWN ENTITY
            </span>
            <div className="font-headline text-headline-md text-on-surface text-center px-4 font-bold">
              Click to Fracture the Seal
            </div>
          </div>
        </div>

        {/* Back (Revealed NFT details) */}
        <div className="rotate-y-180 backface-hidden absolute inset-0 bg-surface-container-high rounded-2xl border border-outline-variant overflow-hidden shadow-2xl flex flex-col">
          {/* NFT Cover Image */}
          <div className="h-2/3 w-full bg-surface-container-lowest relative">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDS-L4U49_N8R42C3wEEi5slZJXR-eQQPeMA-MDxPsGD01hufmo5s--IDyDzjkMPje83f9nuB26sMuX6azngTjGPReUuBAHSumnZjcfaHEQ5-XIWcXTjlSVzVgJt0SL4nqZP_ph3JZg3pEeln-goXS3j7VdWNFqVSPoAG9lz_vfszuSvD_vWLYYKkRTTIEGW8qHXDnSZbpQAv3m7lvVEqvs3W1yeVxVKxkwVvFBJmwanMy24YKReX3A')` }}
            />
            <div className="absolute top-4 right-4">
              <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-secondary/50 text-secondary font-mono text-[10px] tracking-wider uppercase font-semibold">
                ELITE LEGENDARY
              </div>
            </div>
          </div>

          {/* NFT Card details */}
          <div className="p-8 flex-grow flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-mono text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider">Void Shards</p>
                <h3 className="font-headline text-headline-md text-on-surface font-bold">The Obsidian Catalyst #001</h3>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] text-secondary uppercase tracking-wider">Winning Bid</p>
                <p className="font-headline text-headline-md text-on-surface font-bold">42.5 MON</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-outline-variant/35 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined text-sm">person</span>
                </div>
                <span className="font-mono text-mono-sm text-on-surface-variant">0x88...f10</span>
              </div>
              <span className="font-label text-label-md text-on-surface-variant uppercase tracking-tighter">
                Winner Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

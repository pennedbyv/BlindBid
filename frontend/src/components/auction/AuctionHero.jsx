import React from 'react';
import CountdownTimer from '../common/CountdownTimer';

export default function AuctionHero({ bundleId = '8421', title = 'The Obsidian Vault', timerSeconds = 45 }) {
  return (
    <div className="glass-card flex-grow relative overflow-hidden flex flex-col items-center justify-center py-16 px-6">
      {/* Decorative Golden Ambient Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none"></div>
      
      {/* Timer content */}
      <div className="relative z-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-4 font-mono">
          Auction Terminating In
        </p>
        <CountdownTimer initialSeconds={timerSeconds} variant="large" className="mb-2" />
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant font-mono">
            Time Remaining
          </span>
        </div>
      </div>

      {/* Vault Identity */}
      <div className="mt-12 text-center relative z-10">
        <div className="inline-block px-3 py-1 rounded-full bg-surface-bright/50 border border-outline-variant/30 text-[10px] uppercase font-bold text-secondary mb-3 font-mono">
          Bundle #{bundleId}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-headline text-white">
          {title}
        </h1>
      </div>
    </div>
  );
}

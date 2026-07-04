import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountdownTimer from '../common/CountdownTimer';
import StatusBadge from '../common/StatusBadge';

export default function VaultCard({ vault, locked = false }) {
  const { id, name, series, image, shards, confidence, estimatedValue, reservePrice, timeRemainingSeconds } = vault;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.2, 0, 0.2, 1] }}
      className="group flex flex-col bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/10 hover:border-secondary/30 transition-all duration-500 gold-glow hover:-translate-y-2 vault-card-shadow"
    >
      {/* Image / Blur cover container */}
      <div className="relative aspect-square overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60 z-10"></div>
        
        {locked ? (
          <>
            {/* Blurred image for locked state */}
            <div 
              className="w-full h-full bg-cover bg-center blur-md opacity-40 transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${image})` }}
            />
            {/* Encrypted lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
                <span className="font-mono text-mono-sm text-secondary uppercase tracking-widest bg-background/60 backdrop-blur-md px-2 py-1 rounded">
                  Encrypted
                </span>
              </div>
            </div>
          </>
        ) : (
          /* Normal image display */
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-6 left-6 z-20 flex flex-wrap gap-2">
          <StatusBadge variant="muted">{shards} Shards</StatusBadge>
          {locked && (
            <StatusBadge variant="gold">Encrypted for Buyers</StatusBadge>
          )}
        </div>

        <div className="absolute top-6 right-6 z-20">
          <StatusBadge variant="gold">{confidence}</StatusBadge>
        </div>

        {/* Timer overlay at bottom */}
        <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase mb-1">Time Remaining</span>
            <CountdownTimer initialSeconds={timeRemainingSeconds} variant="card" />
          </div>
        </div>
      </div>

      {/* Info Content Section */}
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-headline text-headline-md text-on-surface mb-1">{name}</h3>
            <p className="font-body text-body-md text-on-surface-variant">{series}</p>
          </div>
          <button className="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors">
            favorite
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-b border-outline-variant/20 py-6">
          <div>
            <p className="font-mono text-[10px] text-on-surface-variant uppercase mb-1">Est. Value</p>
            <p className="font-headline text-headline-md text-secondary">{estimatedValue}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] text-on-surface-variant uppercase mb-1">Reserve Price</p>
            <p className="font-headline text-headline-md text-on-surface">{reservePrice}</p>
          </div>
        </div>

        <Link to={`/auction/${id}`} className="block">
          <button className="w-full bg-secondary hover:bg-secondary/90 text-on-secondary py-4 rounded font-label text-label-md uppercase font-bold tracking-widest transition-all active:scale-[0.98]">
            Join Auction
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

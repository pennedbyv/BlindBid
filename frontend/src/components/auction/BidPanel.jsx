import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function BidPanel({ initialHighestBid = 0, currency = 'QIE' }) {
  const [highestBid, setHighestBid] = useState(initialHighestBid);
  const [bidAmount, setBidAmount] = useState('');
  const [isSeller, setIsSeller] = useState(true); // Toggle to simulate buyer/seller
  const [bidsCount, setBidsCount] = useState(0);

  const handlePlaceBid = (e) => {
    e.preventDefault();
    const bidVal = parseFloat(bidAmount);
    if (!isNaN(bidVal) && bidVal > highestBid) {
      setHighestBid(bidVal);
      setBidAmount('');
      setBidsCount(prev => prev + 1);
    }
  };

  return (
    <div className="glass-card p-8 bg-surface/40">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Bid Status */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                Current Highest Bid
              </p>
              <button 
                onClick={() => setIsSeller(prev => !prev)}
                className="text-[10px] uppercase font-mono text-secondary hover:underline"
              >
                [Simulate {isSeller ? 'Buyer' : 'Seller'} View]
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">{highestBid} {currency}</span>
            </div>
            <p className="text-sm text-on-surface-variant mt-1 italic">
              {bidsCount === 0 ? 'No bids yet' : `${bidsCount} bid${bidsCount > 1 ? 's' : ''} placed`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-full">
              <span className="material-symbols-outlined text-secondary text-sm">
                {isSeller ? 'person' : 'payments'}
              </span>
            </div>
            <p className="text-sm font-medium text-on-surface-variant">
              {isSeller ? (
                <>You are the <span className="text-secondary">seller</span> of this auction</>
              ) : (
                <>You are bidding as <span className="text-secondary font-mono">0x05...066b</span></>
              )}
            </p>
          </div>
        </div>

        {/* Bid Action Form */}
        <div className={isSeller ? 'opacity-40 pointer-events-none grayscale' : ''}>
          <form onSubmit={handlePlaceBid}>
            <div className="relative">
              <input
                disabled={isSeller}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-4 text-white focus:ring-secondary focus:border-secondary placeholder:text-on-surface-variant/40"
                placeholder={isSeller ? "Seller cannot bid" : `Enter Bid (> ${highestBid})`}
                type="text"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">
                {currency}
              </div>
            </div>
            <button 
              type="submit"
              disabled={isSeller || !bidAmount || parseFloat(bidAmount) <= highestBid}
              className="w-full mt-4 bg-secondary text-black font-extrabold py-4 rounded-xl uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:hover:bg-secondary disabled:cursor-not-allowed"
            >
              Place Bid ⚡
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

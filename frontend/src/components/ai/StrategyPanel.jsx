import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function StrategyPanel() {
  const navigate = useNavigate();
  const [confidence, setConfidence] = useState(98.4);

  // Live telemetry updates
  useEffect(() => {
    const timer = setInterval(() => {
      setConfidence(parseFloat((98.0 + Math.random() * 0.8).toFixed(1)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleExecute = () => {
    navigate('/winner');
  };

  return (
    <aside className="w-full lg:w-1/4 h-full">
      <div className="bg-surface-container-high rounded-2xl p-8 border border-outline-variant/20 h-full flex flex-col justify-between relative overflow-hidden strategy-card-hover transition-all duration-500">
        <div className="absolute inset-0 neural-bg opacity-5 pointer-events-none"></div>
        
        <div>
          {/* Header Title */}
          <div className="flex items-center gap-3 mb-10">
            <span className="material-symbols-outlined text-secondary font-bold">
              strategy
            </span>
            <h2 className="font-headline text-headline-md font-bold text-on-surface">
              Strategy
            </h2>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-2 gap-gutter mb-10">
            <div className="space-y-1">
              <p className="font-mono text-mono-sm text-on-surface-variant uppercase">Reserve</p>
              <p className="font-headline text-headline-md text-secondary font-bold">42.5 ETH</p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-mono-sm text-on-surface-variant uppercase">Duration</p>
              <p className="font-headline text-headline-md text-on-surface font-bold">72 Hours</p>
            </div>
            <div className="col-span-2 space-y-2 pt-4 border-t border-outline-variant/10">
              <p className="font-mono text-mono-sm text-on-surface-variant uppercase">Confidence</p>
              <div className="flex items-end gap-2">
                <span className="font-headline text-display-lg text-secondary font-bold leading-none font-mono">
                  {confidence}%
                </span>
                <span className="font-mono text-mono-sm text-emerald-500 mb-2 font-bold uppercase">
                  High
                </span>
              </div>
            </div>
          </div>

          {/* Logic summary text block */}
          <div className="space-y-4">
            <p className="font-mono text-mono-sm text-on-surface-variant uppercase tracking-widest">
              Logic Summary
            </p>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 relative">
              <p className="text-body-md text-on-surface font-body font-light leading-relaxed italic opacity-85">
                "Utilizing a descending clock auction variant. The agent detected high initial momentum in 'Collection A' and will start at a 15% premium, decaying over 72 hours to maximize liquidity while respecting the 42.5 ETH floor."
              </p>
            </div>
          </div>
        </div>

        {/* Buttons footer */}
        <div className="mt-10 pt-8 border-t border-outline-variant/20 flex flex-col gap-4">
          <motion.button 
            onClick={handleExecute}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-secondary text-on-secondary font-label font-bold py-4 rounded-xl hover:brightness-110 transition-all uppercase tracking-widest animate-breathing"
          >
            Execute Auction
          </motion.button>
          <button 
            onClick={() => navigate('/seller')}
            className="w-full border border-outline-variant/30 text-on-surface-variant font-label py-4 rounded-xl hover:bg-surface-container-highest hover:text-white transition-all uppercase tracking-widest font-semibold"
          >
            Modify Parameters
          </button>
        </div>
      </div>
    </aside>
  );
}

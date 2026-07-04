import React, { useState, useEffect } from 'react';

export default function AIStatusPanel() {
  const [computeRate, setComputeRate] = useState(14.2);

  // Live telemetry mock updates
  useEffect(() => {
    const timer = setInterval(() => {
      setComputeRate((13.5 + Math.random() * 1.5).toFixed(1));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="w-full lg:w-1/4 flex flex-col gap-6 h-full">
      {/* status details card */}
      <div className="bg-surface-container-high rounded-2xl p-8 border border-outline-variant/20 relative overflow-hidden group">
        <div className="absolute inset-0 neural-bg opacity-10 pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-secondary font-bold">
            monitoring
          </span>
          <h2 className="font-headline text-headline-md font-bold text-on-surface">AI Status</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-mono text-mono-sm text-on-surface-variant uppercase tracking-widest">
              Current Phase
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-headline-lg text-secondary">Execution</span>
              <span className="text-secondary font-mono animate-pulse">...</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-mono-sm text-on-surface-variant uppercase tracking-widest">
              Estimated Completion
            </p>
            <p className="font-headline text-headline-lg font-mono text-on-surface">
              2.4<span className="text-body-md ml-1 opacity-50 font-sans">s</span>
            </p>
          </div>

          <div className="pt-6 border-t border-outline-variant/20">
            <p className="font-mono text-mono-sm text-on-surface-variant uppercase tracking-widest mb-4">
              Blockchain Status
            </p>
            <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl border border-white/[0.03]">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                <span className="font-label text-label-md">Monad Network</span>
              </div>
              <span className="text-emerald-500 font-mono text-mono-sm uppercase font-bold">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* visualizer card */}
      <div className="flex-grow bg-surface-container-low rounded-2xl border border-outline-variant/10 overflow-hidden relative p-8 min-h-[160px]">
        <div className="absolute inset-0 neural-bg opacity-20"></div>
        <div className="relative h-full flex flex-col justify-end">
          <p className="font-mono text-mono-sm text-secondary uppercase tracking-[0.2em] font-semibold">
            Neural Signal
          </p>
          <p className="text-on-surface-variant text-sm mt-2 font-body font-light">
            Processing {computeRate}k data points per second...
          </p>
        </div>
      </div>
    </aside>
  );
}

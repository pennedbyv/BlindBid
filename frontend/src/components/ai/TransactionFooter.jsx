import React, { useState, useEffect } from 'react';
import ProgressBar from '../common/ProgressBar';

export default function TransactionFooter({ txHash = '0x7a8c4f2b1d0e9a3f7c5e2d1b0a9f8e7d6c5b4a32e' }) {
  const [progress, setProgress] = useState(65);

  // Live progress mock updates
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        const add = Math.floor(Math.random() * 2) + 1;
        return prev + add;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const truncate = (str, len = 6) => {
    return `${str.substring(0, len)}...${str.substring(str.length - len)}`;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/80 backdrop-blur-md border-t border-outline-variant/10 py-8">
      <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        {/* Left Side: Confirmation status */}
        <div className="w-full md:w-48 text-center md:text-left flex flex-col items-center md:items-start">
          <p className="font-mono text-mono-sm text-on-surface-variant uppercase mb-1">Confirmation</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
              hourglass_top
            </span>
            <span className="font-label text-label-md text-on-surface font-semibold">
              {progress < 100 ? 'Awaiting Wallet' : 'Confirmed'}
            </span>
          </div>
        </div>

        {/* Center: Energy Progress Bar */}
        <div className="flex-grow w-full flex flex-col gap-2">
          <div className="flex justify-between items-center px-1">
            <span className="font-mono text-mono-sm text-secondary uppercase font-semibold">
              Transaction Broadcast Progress
            </span>
            <span className="font-mono text-mono-sm text-on-surface font-bold">
              {progress}%
            </span>
          </div>
          <ProgressBar progress={progress} variant="energy" />
        </div>

        {/* Right Side: Tx Hash */}
        <div className="w-full md:w-64 text-center md:text-right flex flex-col items-center md:items-end">
          <p className="font-mono text-mono-sm text-on-surface-variant uppercase mb-1">Transaction Hash</p>
          <p className="font-mono text-mono-sm text-secondary truncate max-w-full font-semibold" title={txHash}>
            {truncate(txHash, 10)}
          </p>
        </div>
      </div>
    </footer>
  );
}

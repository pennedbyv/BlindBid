import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function WinnerDetails({ winnerAddress = '0x88f10b2c3a5d8e9f7c5e2d1b0a9f8e7d6c5b4a32', txHash = '0x7a8c4f2b1d0e9a3f7c5e2d1b0a9f8e7d6c5b4a32e' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(winnerAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncate = (str, len = 6) => {
    return `${str.substring(0, len)}...${str.substring(str.length - len)}`;
  };

  return (
    <div className="w-full max-w-2xl text-center">
      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-12">
        {/* Winner Address */}
        <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/30 flex flex-col items-center">
          <span className="font-mono text-mono-sm text-on-surface-variant mb-2 uppercase tracking-wider">
            Winner Address
          </span>
          <div className="flex items-center gap-2 text-on-surface text-lg">
            <span className="font-mono">{truncate(winnerAddress, 8)}</span>
            <button 
              onClick={handleCopy}
              className="text-secondary cursor-pointer hover:scale-110 transition-transform active:scale-95 flex items-center"
              title="Copy Address"
            >
              <span className="material-symbols-outlined text-sm">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
        </div>

        {/* Transaction Hash */}
        <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/30 flex flex-col items-center">
          <span className="font-mono text-mono-sm text-on-surface-variant mb-2 uppercase tracking-wider">
            Transaction Hash
          </span>
          <div className="flex items-center gap-2 text-on-surface text-lg">
            <span className="font-mono">{truncate(txHash, 6)}</span>
            <a 
              href={`https://explorer.monad.xyz/tx/${txHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-secondary cursor-pointer hover:scale-110 transition-transform flex items-center"
            >
              <span className="material-symbols-outlined text-sm">
                open_in_new
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
        <button className="bg-secondary text-on-secondary px-10 py-4 rounded-full font-label text-label-md hover:scale-95 active:scale-90 transition-transform min-w-[240px] font-bold uppercase tracking-widest">
          View Transaction
        </button>
        <a 
          href={`https://explorer.monad.xyz/tx/${txHash}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="border border-outline-variant/40 text-on-surface px-10 py-4 rounded-full font-label text-label-md hover:border-secondary hover:text-secondary transition-all min-w-[240px] inline-block font-bold uppercase tracking-widest"
        >
          View on Monad Explorer
        </a>
      </div>

      {/* Return back link */}
      <div>
        <Link 
          to="/marketplace" 
          className="font-label text-label-md text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-widest font-semibold"
        >
          Return to Marketplace
        </Link>
      </div>
    </div>
  );
}

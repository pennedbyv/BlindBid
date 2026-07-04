import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import WalletButton from '../buttons/WalletButton';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  // Helpers to determine active states dynamically
  const isHomeActive = path === '/';
  const isAuctionsActive = path.startsWith('/marketplace') || path.startsWith('/auction') || path.startsWith('/winner');
  const isAIActive = path.startsWith('/seller') || path.startsWith('/reasoning');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-surface/90 backdrop-blur-xl border-b border-white/5 h-24">
      <div className="max-w-container-max mx-auto px-margin-desktop h-full flex justify-between items-center w-full">
        {/* Left side: Premium box icon + title logo */}
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center font-extrabold text-black text-xl font-headline">B</div>
            <Link to="/" className="font-bold text-xl tracking-tight text-white hover:text-secondary transition-colors">
              BlindBid
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8 items-center">
            <Link 
              to="/" 
              className={`font-label text-label-md transition-colors duration-300 ${
                isHomeActive ? 'text-secondary border-b border-secondary pb-1' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/marketplace" 
              className={`font-label text-label-md transition-colors duration-300 ${
                isAuctionsActive ? 'text-secondary border-b border-secondary pb-1' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Auctions
            </Link>
            <Link 
              to="/seller" 
              className={`font-label text-label-md transition-colors duration-300 ${
                isAIActive ? 'text-secondary border-b border-secondary pb-1' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              AI Strategist
            </Link>
          </div>
        </div>

        {/* Right side: Wallet Address component */}
        <div>
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}

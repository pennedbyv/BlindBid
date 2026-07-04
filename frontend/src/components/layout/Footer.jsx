import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ variant = 'landing' }) {
  if (variant === 'dashboard') {
    return (
      <footer className="w-full bg-surface-container-lowest/80 backdrop-blur-md border-t border-white/5 py-6">
        <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter text-sm text-on-surface-variant">
          <div className="font-headline text-secondary tracking-tighter uppercase text-sm font-bold">
            BlindBid
          </div>
          <div className="flex gap-8 items-center">
            <a href="#governance" className="hover:text-secondary transition-colors font-label">Governance</a>
            <a href="#docs" className="hover:text-secondary transition-colors font-label">Docs</a>
            <a href="#support" className="hover:text-secondary transition-colors font-label">Support</a>
            <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
            <span className="font-mono text-mono-sm opacity-55">© 2026 BlindBid. Precision Engineered.</span>
          </div>
        </div>
      </footer>
    );
  }

  // default landing full variant
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/10 w-full mt-auto">
      <div className="max-w-container-max mx-auto px-margin-desktop py-20 flex flex-col md:flex-row justify-between items-center gap-gutter">
        <div className="flex flex-col gap-6 items-center md:items-start">
          <span className="font-headline text-headline-md text-secondary tracking-tighter uppercase font-extrabold">BlindBid</span>
          <p className="font-mono text-mono-sm text-on-surface-variant max-w-xs text-center md:text-left opacity-80 leading-relaxed">
            © 2026 BlindBid. Precision Engineered. Decentralized Intelligence for Liquid Markets.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          <a className="font-label text-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#privacy">Privacy</a>
          <a className="font-label text-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#terms">Terms</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#governance">Governance</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors" href="#docs">Docs</a>
        </div>
        <div className="flex gap-6">
          <div className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center opacity-80 hover:opacity-100 hover:border-secondary transition-all cursor-pointer">
            <span className="material-symbols-outlined text-secondary text-sm">share</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center opacity-80 hover:opacity-100 hover:border-secondary transition-all cursor-pointer">
            <span className="material-symbols-outlined text-secondary text-sm">mail</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

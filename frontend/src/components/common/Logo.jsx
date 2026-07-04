import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ className = '' }) {
  return (
    <Link 
      to="/" 
      className={`font-headline text-headline-lg text-secondary tracking-tighter uppercase font-extrabold cursor-pointer hover:brightness-110 transition-all ${className}`}
    >
      BlindBid
    </Link>
  );
}

import React from 'react';

export default function SectionTitle({ children, className = '', centered = true }) {
  return (
    <div className={`flex flex-col gap-4 mb-20 ${centered ? 'text-center items-center' : ''} ${className}`}>
      <h2 className="font-headline text-headline-lg text-on-surface">{children}</h2>
      <div className="w-24 h-1 bg-secondary rounded-full"></div>
    </div>
  );
}

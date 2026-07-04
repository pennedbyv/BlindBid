import React from 'react';

export default function StatCard({ label, value, showBorder = false }) {
  return (
    <div className={`flex flex-col gap-2 ${showBorder ? 'border-x border-outline-variant/20 px-8' : ''}`}>
      <span className="font-mono text-mono-sm text-secondary uppercase tracking-widest">
        {label}
      </span>
      <span className="font-headline text-display-lg text-on-surface leading-none">
        {value}
      </span>
    </div>
  );
}
